'use strict';

console.log('database-model-finder');

module.exports = (req, res, next) => {
  req.db = require(`../models/${process.env.DB}-model.js`);
  next();
};