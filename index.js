'use strict';

require('dotenv').config();

// Connect to appropriate database
(process.env.DB === 'mongo' ? connectToMongo : connectToPG);

/**
 * Connects to MongoDB instance
 */
function connectToMongo() {
  const mongoose = require('mongoose');
  const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
  };
  mongoose.connect(process.env.MONGO_URI, mongooseOptions);
}

/**
 * Connects to PostgreSQL instance
 */
function connectToPG() {
  const pg = require('pg');
  const client = new pg.Client(process.env.DB_URL);
  client.connect();
  client.on('error', err => console.error(err));
}

require('./src/server.js').start(process.env.PORT);