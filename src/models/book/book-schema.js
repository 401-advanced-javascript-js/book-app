'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const book = mongoose.Schema({
  // _id: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  isbn: { type: String, required: true },
  image_url: { type: String, required: true },
  description: { type: String, required: true },
  bookshelf: { type: String, default: 'Not Shelved' },
});

module.exports = mongoose.model('book', book);