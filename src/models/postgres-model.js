'use strict';

const client = require('../../index.js');

class PostgresModel {
    construct(client) {
        this.client = client;
    }

    get(id) {

    }

    post(values) {
        
    }

    put(values) {

    }

    delete(id) {
        let sql = `DELETE FROM books WHERE  id=$1`;
        
    }
}