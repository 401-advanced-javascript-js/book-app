'use strict';

const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const dbModelFinder = require('../../middleware/db-model-finder.js');


router.use(dbModelFinder);

// ROUTES

// get routes (send information out)
router.get('/', getBooksFromDatabase);

router.get('/search', (req, res) => {
  res.render('pages/searches/new');
});

router.get('/books/details/:book_id', (req, res) => {
  return req.db.get(req.params.book_id)
    .then((sqlResult) => {
      if (!sqlResult.rowCount) handleError({ status: 404 }, 'No good, the book went up in smoke', gifs.hiding, res);

      res.render('pages/books/show', { book: sqlResult.rows[0] });
    })
    .catch((error) => console.error(error));
});

// post routes (take information in and do things with that information)
router.post('/searches/new', getBookDataFromApi);
router.post('/add', addBook);

// put routes, update information in our database
router.put('/update/:book_id', (req, res) => {
  let { title, author, isbn, image_url, description, bookshelf } = req.body;
  let values = [title, author, isbn, image_url, description, bookshelf, req.params.book_id];

  req.db.put(values)
    .then((sqlReturn) => {
      res.render('pages/books/show', { book: sqlReturn.rows[0] });
    })
    .catch((err) => handleError(err, `Something went wrong and we couldn't update the book`, gifs.superRare, res));
});

// delete route, remove information from our database
router.delete('/delete/:book_id', deleteBook);

router.get('/*', (req, res) => {
  handleError({ status: 404 }, 'Nothing here... ¯¯\\_(ツ)_/¯', gifs.moveAlong, res);
});

module.exports = router;

// HELPER FUNCTIONS ------------------------------------------------------

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

function addBook(req, res) {
  let { title, author, isbn, image_url, description, bookshelf } = req.body;
  let values = [author, title, isbn, image_url, description, bookshelf];

  return req.db.post(values)
    .then((sqlReturn) => res.render('pages/books/show', { book: sqlReturn.rows[0] }))
    .catch((err) => handleError(err, 'Failed to save book.', gifs.hiding, res));
}

function deleteBook(req, res) {
  return req.db.delete(req.params.book_id)
    .then(res.redirect('/'))
    .catch((err) => handleError(err, '', gifs.noresponse, res));
}

function getBooksFromDatabase(req, res) {
  return req.db.get()
    .then((sqlResult) => {
      res.render('pages/index', { sqlResults: sqlResult });
    })
    .catch((error) => handleError(error, 'Database hiding :(', gifs.hiding, res));
}

/**
 * Gets book data for passed in request and renders to page
 *
 * @param {object} req express.js request
 * @param {object} res express.js response
 */
function getBookDataFromApi(req, res) {
  // TODO: explain how this query is structured
  const searchTerm = `${req.body.search[1]}:${req.body.search[0]}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=+in${searchTerm}`;

  superagent
    .get(url)
    .then((apiData) => {
      if (apiData.body.totalItems === 0) {
        handleError({ status: 404 }, `You found something Google doesn't know!!`, gifs.superRare, res);
      } else {
        let resultBooks = apiData.body.items.map((bookData) => new Book(bookData.volumeInfo));

        res.render('pages/searches/show', { searchResults: resultBooks });
      }
    })
    .catch((error) => handleError(error, `Google won't talk to us :(`, gifs.noresponse, res));
}

// Constructors -----------------------------------------------------------

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
