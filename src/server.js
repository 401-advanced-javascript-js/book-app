'use strict';

// SERVER CONFIGURATION
require('dotenv').config();

const express = require('express');
const app = express();
const methodOverride = require('method-override');
const routes = require('./api/routes/routes.js');

// Use EJS for embedding JS in html
app.set('view engine', 'ejs');

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(routes);

const start = (port) => {
  app.listen(port, () => console.log(`Book app listening on ${port}`));
};

module.exports = { start };