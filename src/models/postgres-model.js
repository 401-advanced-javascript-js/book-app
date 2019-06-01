'use strict';

const pg = require('pg');
// create client connection to database
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', (err) => console.error(err));

class PostgresModel {
  construct() {}

  /**
   * Get book by id or all books from database
   *
   * @param {string} id
   */
  get(id) {
    let sql;
    if (id) {
      sql = `SELECT * FROM books WHERE id=${id};`;
    } else {
      sql = `SELECT * FROM books;`;
    }
    return client.query(sql);
  }

  /**
   * Add book to database
   * @param {Object} values
   */
  post(values) {
    let sql = `INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
    return client.query(sql, values);
  }

  put(values) {
    let sql = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7 RETURNING *`;
    return client.query(sql, values);
  }

  delete(id) {
    let sql = `DELETE FROM books WHERE  id=${id}`;
    return client.query(sql);
  }
}

module.exports = new PostgresModel(client);
