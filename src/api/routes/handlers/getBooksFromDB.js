'use strict';

module.exports = (req, res) => {
  req.db.get()
    .then((result) => {
      res.render('pages/index', { sqlResults : result });
    })
    .catch(error => console.error('can\'t get books')); // TODO:
};
