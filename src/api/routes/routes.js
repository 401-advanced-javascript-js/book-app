'use strict';

const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

const dbModelFinder = require('../../middleware/db-model-finder.js');

const getBooksFromDB = require('./handlers/getBooksFromDB.js');
const searchPage = require('./handlers/searchPage.js');
const getSingleBook = require('./handlers/getSingleBook.js');
const searchAPI = require('./handlers/searchAPI.js');
const addBook = require('./handlers/addBook.js');
const updateBook = require('./handlers/updateBook.js');
const deleteBook = require('./handlers/deleteBook.js');


// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
router.use(express.urlencoded({extended: true}));
router.use(express.static('../public'));

// Allows use of PUT and DELETE 
router.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// set request.db to correct database model
router.use(dbModelFinder);

// get all books from DB
router.get('/', getBooksFromDB);

// render new search page
router.get('/search', searchPage);

// get single book details
router.get('/books/details/:book_id', getSingleBook);

// search for book using API
router.post('/searches/new', searchAPI);

// add book to DB
router.post('/add', addBook);

// update book information in DB
router.put('/update/:book_id', updateBook);

// delete book from DB
router.delete('/delete/:book_id', deleteBook);

// catch all route
// router.get('/*', notFound);

module.exports = router;