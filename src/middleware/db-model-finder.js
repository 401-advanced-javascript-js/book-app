'use strict';

module.exports = (req, res, next) => {
  req.db = require(`../models/${process.env.DB}-model.js`);
  // console.log('db-model-finder.js');
  // console.log(req.db.get());
  next();
};