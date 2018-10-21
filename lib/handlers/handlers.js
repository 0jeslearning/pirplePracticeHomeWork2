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
var _cartHandlers = require('./cartHandlers');
var _menuHandlers = require('./menuHandlers');
var _orderHandlers = require('./orderHandlers');
var _tokenHandlers = require('./tokenHandlers');
var _userHandlers = require('./userHandlers');


//Define the handlers
var handlers = {};


//For cart
handlers.cart = _cartHandlers.cart;


//For menu
handlers.menu = _menuHandlers.menu;

//For orders
handlers.order = _orderHandlers.order;

//For tokens
handlers.tokens = _tokenHandlers.tokens;

//For users
handlers.users = _userHandlers.users;


//Ping handlers
handlers.ping = function(data,callback) {
  callback(200);
};

//Not found handler
handlers.notFound = function(data,callback) {
  callback(404,{'Error': 'No such path'});
};


//Export the module
module.exports = handlers;
