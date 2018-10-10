/*
 *
 * SVM
 *Request handlers
 *For Online Pizza Order Delivery
 *
 */

//Dependencies
var config = require('../config');


//Define the handlers
var handlers = {};

//Users
handlers.users = function(data,callback) {
  var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
      handlers._users[data.method](data,callback);
    } else {
      callback(405);
    }
};


//Tokens
handlers.tokens = function(data,callback) {
  var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
      handlers._tokens[data.method](data,callback);
    } else {
      callback(405);
    }
};


//Container for all tokens methods
handlers._tokens = {};



//Checks
handlers.checks = function(data,callback) {
  var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
      handlers._checks[data.method](data,callback);
    } else {
      callback(405);
    }
};


//Container for all the checks methods
handlers._checks = {};


//Ping handlers
handlers.ping = function(data,callback) {
  callback(200);
};


//Not found handler
handlers.notFound = function(data,callback) {
  callback(404);
};


//Export the module
module.exports = handlers;
