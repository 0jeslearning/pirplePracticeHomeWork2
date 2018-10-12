/*
 *
 *SVM
 *Handler for shopping cart
 *Online Pizza Order Delivery
 *File: lib/handlers/cartHandlers.js
 *
 */
 

 var cartHandlers = {};


//Order
cartHandlers.carts = function(data,callback) {
  var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
      cartHandlers._cart[data.method](data,callback);
    } else {
      callback(405);
    }
};


//Container for all the cartHandlers methods
cartHandlers._cart = {};


//Post for cartHandlers._cart
cartHandlers._cart.post = function(data,callback) {
};


//Get for cartHandlers._cart
cartHandlers._cart.get = function(data,callback) {
};


//Put for cartHandlers._cart
cartHandlers._cart.put = function(data,callback) {
};


//Delete for cartHandlers._cart
cartHandlers._cart.delete = function(data,callback) {
};


module.exports = cartHandlers;
