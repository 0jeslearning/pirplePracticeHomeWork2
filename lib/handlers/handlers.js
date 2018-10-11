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
var _userHandlers = require('./userHandlers');
var _tokenHandlers = require('./tokenHandlers');
var _orderHandlers = require('./orderHandlers');


//Define the handlers
var handlers = {};


//For users
handlers.users = _userHandlers.users;

//For tokens
handlers.tokens = _tokenHandlers.tokens;

//For orders
handlers.orders = _orderHandlers.tokens;

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
