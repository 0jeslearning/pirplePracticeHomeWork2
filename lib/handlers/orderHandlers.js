/*
 *
 *SVM
 *Handler for orders
 *Online Pizza Order Delivery
 *File: lib/handlers/orderHandlers.js
 *
 */
 

 var orderHandlers = {};


//Order
orderHandlers.orders = function(data,callback) {
  var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
      orderHandlers._order[data.method](data,callback);
    } else {
      callback(405);
    }
};


//Container for all the orderHandlers methods
orderHandlers._order = {};


//Post for orderHandlers._order
orderHandlers._order.post = function(data,callback) {
};


//Get for orderHandlers._order
orderHandlers._order.get = function(data,callback) {
};


//Put for orderHandlers._order
orderHandlers._order.put = function(data,callback) {
};


//Delete for orderHandlers._order
orderHandlers._order.delete = function(data,callback) {
};


module.exports = orderHandlers;
