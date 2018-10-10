/*
 *
 * SVM
 * For Online Pizza Order Delivery
 * Handler for tokens
 * tokenHandlers.js
 *
 */


var tokenHandlers = {};

//Tokens
tokenHandlers.tokens = function(data,callback) {
  var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
      tokenHandlers._tokens[data.method](data,callback);
    } else {
      callback(405);
    }
};

//Container for all tokens methods
tokenHandlers._tokens = {};


//Post method for tokenHandlers._tokens.post
tokenHandlers._tokens.post = function(data,callback) {
};


//Get method for tokenHandlers._tokens.get
tokenHandlers._tokens.get = function(data,callback) {
};


//Get method for tokenHandlers._tokens.put
tokenHandlers._tokens.put = function(data,callback) {
};


//Get method for tokenHandlers._tokens.delete
tokenHandlers._tokens.delete = function(data,callback) {
};


module.exports = tokenHandlers;
