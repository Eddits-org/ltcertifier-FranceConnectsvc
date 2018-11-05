const boom = require('boom');

module.exports = (req, res, next) => next(boom.notFound('Route not found'));
