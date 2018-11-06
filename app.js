const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Request logger
app.use(require('./middlewares/logger'));

// CORS middleware
app.use(require('./middlewares/cors'));

// Routes
app.use('/getFCToken', require('./routes/buildUrl'));
app.use('/redirectFCToken', require('./routes/receiveToken'));

// Middlewares
app.use(require('./middlewares/notFound'));
app.use(require('./middlewares/error'));

app.listen(port, () => console.log(`FC svc listening on port ${port}`))
