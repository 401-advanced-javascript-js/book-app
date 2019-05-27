'use strict';

const express = require('express');
const app = express();

const routes = require('./api/routes/routes.js');

app.set('view engine', 'ejs');

app.use('/docs', express.static('../docs'));

app.use(routes);

/**
 * Start application on passed in port
 * @param {Number} port 
 */
function start(port = process.env.PORT) {
  app.listen(port, () => console.log('Book app listening on ${port}'));
}

module.exports = {app, start};

