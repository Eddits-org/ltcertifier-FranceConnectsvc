const boom = require('boom');

module.exports =  (err, req, res, next) => {
  console.error(err);

  err = err.isJoi ? boom.badRequest(err.message, {details: err.details}) : err;
  err = err.isBoom ? err : boom.boomify(err);

  if(err.message === 'CORS.NOT.ALLOWED')
    err = boom.unauthorized('CORS Error', {details: 'Origin is not allowed'});

  const output = err.output || {};
  return res.status(output.statusCode).json(output.payload);
};
