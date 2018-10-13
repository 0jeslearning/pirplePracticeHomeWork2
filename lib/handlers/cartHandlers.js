/*
 *
 *SVM
 *Handler for shopping cart
 *Online Pizza Order Delivery
 *File: lib/handlers/cartHandlers.js
 *
 */
 
//Dependencies
var _data = require('../data');
var helpers = require('../helpers');
var config = require('../config');
var _tokenVerify = require('./tokenVerify');


var cartHandlers = {};


//Order
cartHandlers.cart = function(data,callback) {
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
//Cart - post
//Required data: product, price, quantity
//Optional data: none
cartHandlers._cart.post = function(data,callback) {

  if(product && price && quantity && placeOrder) {
    //Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    //Lookup the user data
    _data.read('tokens',token,function(err,tokenData) {
      if(!err && tokenData) {
        var userPhone = tokenData.phone;

        //Verify that the given token is valid and belongs to the user created the check
        _tokenVerify.tokenVerify(token,userPhone,function(tokenIsValid) {
          if(tokenIsValid) {

        //SVM
        //May have to change this to userCartId and userData.cartId
        //Lookup the user data
        _data.read('users',userPhone,function(err,userData){
        if(!err && userData) {
           var userSession = Object.prototype.toString.call(userSession) == "[object Array]" 
                             ? userData.session : userData.session || [];

          //Verify that the user has less than max number of session permitted
          if(userSession.length < config.maxCarts) {

            //Create a random id for the check
            var sessionId = helpers.createRandomString(20);

            //Create cart object to pass to order session
            var cartObject = {
              'id' : sessionId,
              'userPhone' : userPhone,
              'product' : product,
              'price' : price,
              'quantity' : quantity,
              'placeOrder' : placeOrder
            }

            //SVM
            console.log("\n\nIn lib/handlers/cartHandlers.js cartObject: ", cartObject);

            //Save the object
            _data.create('cart',sessionId,cartObject,function(err) {
              if(!err) {
                //Add the check id to the usIrs object
                userData.session = userSession
                userData.session.push(sessionId);

                //Save the new user data
                _data.update('users',userPhone,userData,function(err) {
                  if(!err) {
                    callback(200,cartObject);
                  } else {
                    callback(500,{'Error' : 'Could not update the user with a new check'});
                  }
                });
              } else {
                callback(500,{'Error' : 'Could not create the new check'});
              }
            });

          } else {
            callback(400,{'Error' : 'The user already has the maximum number of carts ('+config.maxCarts+')'});
          }

        } else {
          callback(403);
        }

        });

          //Token data goes here
          } else {
            callback(403, {'Error' : 'Invalid token.'});
          }
        });


      } else {
        callback(403, {'Error' : 'Token may have expired or does not exist.Cannot continue until you log in.'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required inputs, or inputs are invalid. Missing price, quantity or product'}); 
  } 


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
