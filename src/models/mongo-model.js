'use strict';

/**
 * Mongo Model
 * @module models/mongo-model
 */

require('dotenv').config();
const mongoose = require('mongoose');

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
};

mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

// Mongo Model for others to build off of
class MongoModel {
  constructor(schema) {
    this.schema = schema;
  }

  /**
   * Calls Mongoose's .findByID() to get data with passed id or all data if no id given
   * then reformats the data to what
   * @param {string} _id
   */
  get(_id) {
    let queryObject = _id ? { _id } : {};

    return this.schema.find(queryObject).then((result) => {
      // console.log(formattedResult);
      let formattedResult = { rows: result, rowCount: result.length };
      return new Promise((resolve) => resolve(formattedResult));
    });
  }

  /**
   * Calls Mongoose's .save() to add data
   * Returns results of request
   *
   * @param {Object} record
   */
  post(record) {
    let book = {
      author: record[0],
      title: record[1],
      isbn: record[2],
      image_url: record[3],
      description: record[4],
      bookshelf: record[5] === '' ? 'Not Shelved' : record[5],
    };
    let newRecord = new this.schema(book);
    return newRecord.save().then((data) => {
      data.id = data._id;
      return { rows: [data] };
    });
  }

  /**
   * Update book data using .findByIdAndUpdate
   * Returns data as { rows: [data] }
   * @param {Object} record, array
   */
  put(record) {
    let book = {
      author: record[1],
      title: record[0],
      isbn: record[2],
      image_url: record[3],
      description: record[4],
      bookshelf: record[5] === '' ? 'Not Shelved' : record[5],
      id: record[6],
    };
    return this.schema.findByIdAndUpdate(book.id, book, { new: true })
      .then((data) => {
        return { rows: [data] };
      });
  }

  /**
   * Deletes book data from database using .findByIdAndDelete
   * Returns promise 
   * @param {String} _id 
   */
  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }
}

const bookSchema = require('../models/book/book-schema.js');

class Book extends MongoModel {}

module.exports = new Book(bookSchema);
