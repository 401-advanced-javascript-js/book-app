'use strict';

module.exports = (req, res, next) => {
    req.db.get(req.params.id)
};