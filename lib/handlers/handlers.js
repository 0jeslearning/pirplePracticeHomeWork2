/*
 *
 * SVM
 *Request handlers
 *For Online Pizza Order Delivery
 *File: lib/handlers/handlers.js
 *
 */

//Dependencies
var config = require('../config');
var userHandlers = require('./userHandlers');
var tokenHandlers = require('./tokenHandlers');


//Define the handlers
var handlers = {};


//For users
handlers.users = userHandlers.users;


//For tokens
handlers.tokens = tokenHandlers.tokens;

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
