'use strict';

const superagent = require('superagent');

/**
 * Gets book data for passed in request and renders to page
 *
 * @param {object} req express.js request
 * @param {object} res express.js response
 */
module.exports = (req, res) => {
  const searchTerm = `${req.body.search[1]}:${req.body.search[0]}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=+in${searchTerm}`;

  superagent.get(url)
    .then((apiData) => {
      if (apiData.body.totalItems === 0) {
        handleError({ status: 404 }, `You found something Google doesn't know!!`, gifs.superRare, res);
      } else {
        let resultBooks = apiData.body.items.map((bookData) => new Book(bookData.volumeInfo));

        res.render('pages/searches/show', { searchResults: resultBooks });
      }
    })
    .catch((error) => handleError(error, `Google won't talk to us :(`, gifs.noresponse, res));
};

// Object constructor
function Book(data) {
  this.author = data.authors ? data.authors.join(', ') : 'No known author(s)';
  this.title = data.title || 'No Title';
  this.isbn = data.industryIdentifiers
    ? `${data.industryIdentifiers[0].type}: ${data.industryIdentifiers[0].identifier}`
    : null;
  this.image_url =
    data.imageLinks && data.imageLinks.thumbnail
      ? data.imageLinks.thumbnail.replace('http://', 'https://')
      : 'https://unmpress.com/sites/default/files/default_images/no_image_book.jpg';
  this.description = data.description || 'No description available.';
  this.bookshelf = data.bookshelf && data.bookshelf !== '' ? data.bookshelf : 'Not Shelved';
}


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