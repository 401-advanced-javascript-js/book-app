'use strict';

const express = require('express');
const router = express.Router();

const dbModelFinder = require('../../middleware/db-model-finder.js');

const addBook = require('./handlers/addBook.js');
const getBooksFromDB = require('./handlers/getBooksFromDB.js');
const getSingleBook = require('./handlers/getSingleBook.js');
const searchPage = require('./handlers/searchPage.js');
const searchAPI = require('./handlers/searchAPI.js');
const deleteBook = require('./handlers/deleteBook.js');
const updateBook = require('./handlers/updateBook.js');
const catchAll = require('./handlers/catchAll.js');

router.use(dbModelFinder);

// ROUTES

router.post('/add', addBook);
router.get('/', getBooksFromDB);
router.get('/books/details/:book_id', getSingleBook);
router.get('/search', searchPage);
router.post('/searches/new', searchAPI);
router.put('/update/:book_id', updateBook);
router.delete('/delete/:book_id', deleteBook);

router.get('*', catchAll);

module.exports = router;