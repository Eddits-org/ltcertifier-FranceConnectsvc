const axios = require('axios');
const base64url = require('base64url');
const qs = require('querystring');
const jwt = require('jsonwebtoken');
const express = require('express');
const Joi = require('joi');
const Boom = require('boom');
const router = express.Router();

const { fcURL, urlServer, client_id, client_secret, frontUrlRedirect, overrideRedirect } = require('../config').config;
const StateService = require('../services/State');
const ECDSAService = require('../services/ECDSA');

const schemaQuery = Joi.object({
  code: Joi.string().required(),
  state: Joi.string().required().length(16),
  keyID: Joi.string().required().length(16)
});

const decodeJWT = (encoded) => {
  const [header, payload, sign] = encoded.split('.');
  return base64url.decode(payload);
}

router.get('/', (req, res, next) => {
  Joi.validate(req.query, schemaQuery, (err, { keyID, state, code } ) => {
    if(err) return next(err);    
    if(!StateService.hasState(keyID))
      return next(Boom.badRequest('NO key ID found with one given'));
    const objectStore = StateService.getState(keyID);
    if (state !== objectStore.state)
      return next(Boom.badRequest('Invalid state'));
    StateService.deleteState(keyID);

    const request = qs.stringify({
      'redirect_uri': `${urlServer}/redirectFCToken?keyID=${keyID}`,
      code,
      client_id,
      client_secret,
      'grant_type': 'authorization_code',
    });
    const config = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    axios.post(`${fcURL}/api/v1/token`, request, config).then((response) => {
      const id_token = response.data.id_token;
      jwt.verify(id_token, client_secret, ((err) => {
        if(err) return next(Boom.unauthorized('Invalid id_token signature'));
        // Decode JWT
        const decoded = decodeJWT(id_token);
        // Signature id_token with private_key ECDSA
        const sig = ECDSAService.sign(decoded);
        // Build response
        const response = {
          jwt: decoded,
          signature: {
            r: `0x${sig.signature.slice(0, 32).toString('hex')}`,
            s: `0x${sig.signature.slice(32, 64).toString('hex')}`,
            v: sig.recovery + 27
          }
        };
        // Encode response as Base64
        const encodedResponse = base64url.encode(JSON.stringify(response), 'utf8');
        // Build redirection URL
        const redirectUrl = `${overrideRedirect && objectStore.redirectUrl ? objectStore.redirectUrl : frontUrlRedirect}#fcResponse=${encodedResponse}`;
        return res.redirect(redirectUrl);
      }));
    }).catch((err) => {
        return next(err);
    });
  });
});

module.exports = router;