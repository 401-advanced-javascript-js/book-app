'use strict';

module.exports = (req, res, next) => {
    req.db = require(`../models/${process.env.DB}-model.js`);
    next();
};