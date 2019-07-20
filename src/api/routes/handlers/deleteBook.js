'use strict';

module.exports = (req, res) => {
  return req.db.delete(req.params.book_id)
    .then(res.redirect('/'))
    .catch(err => handleError(err, '', gifs.noresponse, res));
};

const gifs = {
  moveAlong: 'https://media.giphy.com/media/10RgsuetO4uDkY/giphy.gif',
  superRare: 'https://media.giphy.com/media/1HH6lJOzOXAY/giphy.gif',
  smh: 'https://media.giphy.com/media/kPu4Q1oYpmj3gopFZy/giphy.gif',
  hiding: 'https://media.giphy.com/media/B37cYPCruqwwg/giphy.gif',
  noresponse: 'https://media.giphy.com/media/R55sOeBR22ogg/giphy.gif',
  thereWasTime: 'https://media.giphy.com/media/13ZvdTQADxhvZm/giphy.gif',
};

function handleError(error, errorMessage, errorGif, res) {
  console.error(error);
  if (res) {
    res.render('pages/error', {
      status: error.status,
      message: errorMessage,
      gif: errorGif,
    });
  }
}