const express = require('express');
const Joi = require('joi');
const router = express.Router();

const { FC_URL, client_id, urlServer } = require('../config').config;
const StateService = require('../services/State');

const schemaQuery = Joi.object({
  nonce: Joi.string().required().regex(/^0x[a-fA-F0-9]{40}$/)
});

// Redirect with the right datas,
// Needed datas : 
// response_type=code
// client_id=CLIENT_ID
// redirect_uri=<THIS_SERVER_URL>/redirectFCToken
// scope=<SCOPES> // openid%20profile%20email 
// state=<STATE> // A generer aleatoirement, le stocker ici, puis vérifier que celui ci correspond bien au retour de l'appel, enmpeche l'exploitation d'une faille CSRF
// nonce=<NONCE> // To retrieve from request, is equal to the user identity's address
router.get('/', (req, res, next) => {
  Joi.validate(req.query, schemaQuery, (err, { nonce }) => {
    if(err) return next(err);
    const generatedState = StateService.randomValueHex(16);
    const keyID = StateService.randomValueHex(16);
    StateService.setState(keyID, generatedState);
    let buildRedirectURL = `${FC_URL}/api/v1/authorize?response_type=code`;
    buildRedirectURL += `&client_id=${client_id}`;
    buildRedirectURL += `&redirect_uri=${encodeURIComponent(`${urlServer}/redirectFCToken?keyID=${keyID}`)}`;
    buildRedirectURL += `&scope=${encodeURIComponent("openid profile email")}`;
    buildRedirectURL += `&state=${generatedState}`;
    buildRedirectURL += `&nonce=${nonce.toLowerCase()}`;
    console.log(buildRedirectURL);
    return res.json({
      url: buildRedirectURL
    });
  });
});

module.exports = router;