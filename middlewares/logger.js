const moment = require('moment');

module.exports = (req, res, next) => {
  const reqDate = moment().format('DD/MM/YYYY HH:mm:ss');
  console.log(`[${reqDate}] ${req.method} ${req.path}`);
  return next();
};