/*
 *
 *SVM
 *Handler for shopping menu
 *Online Pizza Order Delivery
 *File: lib/handlers/menuHandlers.js
 *
 */
 
//Dependencies
var _data = require('../data');


var menuHandlers = {};


//Menu
menuHandlers.menu = function(data,callback) {
  var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
      menuHandlers._menu[data.method](data,callback);
    } else {
      callback(405);
    }
};


//Container for all the menuHandlers methods
menuHandlers._menu = {};


//Post for menuHandlers._menu
menuHandlers._menu.post = function(data,callback) {
};


//Get for menuHandlers._menu
menuHandlers._menu.get = function(data,callback) {
  //Type of menu
  var menu = typeof(data.queryStringObject.menu) == 'string'
                      && data.queryStringObject.menu.trim().length > 0
                      ? data.queryStringObject.menu.trim() : false;

  if(menu) {
    _data.read('menu',menu,function(err,menuData) {
      if(!err && menuData) {
        callback(200,menuData);
      } else {
        callback(404, {'Error' : 'It seems we dont have menu right now. Please check back again soon. Stay delicous'});
      }
  });
    } else {
      callback(404,{'Error' : 'Please enter: ?menu=pizza in query, currently no other menu exists'});
    } 
};


//Put for menuHandlers._menu
menuHandlers._menu.put = function(data,callback) {
};


//Delete for menuHandlers._menu
menuHandlers._menu.delete = function(data,callback) {
};


module.exports = menuHandlers;
