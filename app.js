const express = require('express')
const qs = require('querystring');
const app = express()
const port = process.env.PORT || 3000;
const crypto = require('crypto')
const axios = require('axios');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secp256k1 = require('secp256k1');
const config = require('./config').config;

let private_key_ECDSA_back = config.private_key_ECDSA_back;
let public_key_ECDSA_back = config.public_key_ECDSA_back;
const FRONT_URL_REDIRECT = config.FRONT_URL_REDIRECT;
const client_secret = config.client_secret;
const client_id = config.client_id;
const urlServer = config.urlServer;
const FC_URL = config.FC_URL; 

/// GENERATE ECDSA PRIVATE KEY BEFORE LAUNCHING THE API
if (private_key_ECDSA_back === '') {
    do {
        private_key_ECDSA_back = crypto.randomBytes(32)
    } while (!secp256k1.privateKeyVerify(private_key_ECDSA_back));
    public_key_ECDSA_back = secp256k1.publicKeyCreate(private_key_ECDSA_back);
}
console.log(private_key_ECDSA_back.toString());
console.log(public_key_ECDSA_back.toString());

function randomValueHex(len) {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len) // return required number of characters
}

let storedStateAndNonce = new Map();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use((req, res, next) => {
    let reqDate = new Date();
    console.log(reqDate + " " + req.method + " " + req.path);
    return next();
});

// Redirect with the right datas,
// Needed datas : 
// response_type=code
// client_id=CLIENT_ID
// redirect_uri=<THIS_SERVER_URL>/redirectFCToken
// scope=<SCOPES> // openid%20profile%20email 
// state=<STATE> // A generer aleatoirement, le stocker ici, puis vérifier que celui ci correspond bien au retour de l'appel, enmpeche l'exploitation d'une faille CSRF
// nonce=<NONCE> // To retrieve from request, is equal to the user identity's address
app.get('/getFCToken', (req, res) => {
    try {
        if (!req.query.nonce) return res.status(422).send('Missing nonce parameter');
        let buildRedirectURL = FC_URL + '/api/v1/authorize?response_type=code';
        let generatedState = randomValueHex(16);
        let keyID = randomValueHex(16);
        let generatedNonce = randomValueHex(16); // or retrieved value for nonce in request to put it in the request
        buildRedirectURL += '&client_id=' + client_id;
        buildRedirectURL += '&redirect_uri=' + encodeURIComponent(urlServer + '/redirectFCToken?keyID=' + keyID);
        buildRedirectURL += '&scope=openid%20profile%20email';
        buildRedirectURL += '&state=' + generatedState;
        buildRedirectURL += '&nonce=' + generatedNonce;
        storedStateAndNonce.set(keyID, { state: generatedState });
        console.log(buildRedirectURL);
        return res.send(buildRedirectURL);
    } catch (e) {
        console.log('ERROR : ' + e);
        return res.status(500).send('Error in /getFCToken');
    }
});

app.get('/redirectFCToken', (req, res) => {
    if (!req.query.code) return res.status(422).send('Missing query code in request');
    if (!req.query.state) return res.status(422).send('Missing query state in request');
    if (!req.query.keyID) return res.status(422).send('Missing query keyID in request');
    let auth_code = req.query.code;
    let state = req.query.state;
    let keyID = req.query.keyID;
    if (!storedStateAndNonce.has(keyID)) return res.status(500).send('NO key ID found with one given');
    let objectStore = storedStateAndNonce.get(keyID);
    if (state !== objectStore.state) return res.status(500).send('ERROR SECURITY ERROR FAILLE CSRF');
    storedStateAndNonce.delete(keyID);
    // Call method that initialize the workflow with FC to retrieve the token of the user
    const request = qs.stringify({
        'redirect_uri': urlServer + '/redirectFCToken?keyID=' + keyID,
        'code': auth_code,
        client_id,
        client_secret,
        'grant_type': 'authorization_code',
    });
    const config = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    axios.post(FC_URL + '/api/v1/token', request, config).then((response) => {
        let id_token = response.data.id_token;
        jwt.verify(id_token, client_secret, ((err, decoded) => {
            if (err) return res.send(401).send('Unauthorized, token not well signed');
            // Signature id_token with private_key ECDSA
            let return_object = response.data;
            const signed_id_token = secp256k1.sign(id_token, private_key_ECDSA_back);
            return_object.signed_id_token = signed_id_token;
            //return res.redirect(FRONT_URL_REDIRECT + '?access_token=' + body.access_token);
            return res.json(return_object);
        }));
    }).catch((err) => {
        if (err.response) {
            console.error(`Error response from FC: status=${err.response.status}`);
            console.error(err.response.data);
        }
        else console.error(err);
        return res.status(500).send("An error occured!");
    });
});

/*app.get('/CallBackFCToken', (req, res) => {
    return res.send('Redirect after call of FC token');
});*/

app.listen(port, () => console.log(`FC svc listening on port ${port}`))

