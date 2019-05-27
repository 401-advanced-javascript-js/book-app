'use strict';

/**
 * Mongo Model
 * @module models/mongo-model
 */

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
    let queryObject = _id ? {_id} : {};
    return this.schema.find(queryObject).then(result => {
      let formattedResult = { rows: result, rowCoutn: result.length };
      return new Promise(resolve => resolve(formattedResult));
    });
  }

  /**
     * Calls Mongoose's .save() to add data
     * Returns results of request
     * 
     * @param {Object} record 
     */
  post(record) {
    // let newRecord = new this.schema(record);
    // return newRecord.save();
  }


  put(_id, record) {
    // return this.schema.findByIdAndUpdate(_id, record, {new : true});
  }

  delete(_id) {
    // return this.schema.findByIdAndDelete(_id);
  }
}

module.exports = MongoModel;