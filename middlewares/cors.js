const cors = require('cors');

const { corsAllowedOrigins } = require('../config').config;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (corsAllowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('CORS.NOT.ALLOWED'))
    }
  }
};

module.exports = cors(corsOptions);