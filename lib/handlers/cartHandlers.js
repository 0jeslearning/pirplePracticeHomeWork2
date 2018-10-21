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
var _manageSession = require('./manageSession');

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
//Right now this will only save cart to .data/cart/cartId.json
//In order to process/charge card customer must retrieve cartId using:
//post to /order path from there the saved cart will become an order
//Currently the only required data is listed below with no optional data
//This may change 
//Required data: itemNumber,quantity
//Optional data: none
cartHandlers._cart.post = function(data,callback) {

  //SVM this here for now to see if there is a smarter way to place order
  //var placeOrder = typeof(data.payload.placeOrder) == 'boolean'
                            //&& data.payload.placeOrder == true
                            //? true : false;
                            
  var itemNumber = typeof(data.payload.itemNumber) == 'string'
                          && data.payload.itemNumber.trim().length > 0 
                          ? data.payload.itemNumber.trim() : false;

  var quantity = typeof(data.payload.quantity) == 'number'
                          && data.payload.quantity > 0 
                          && data.payload.quantity < 100000 
                          ? data.payload.quantity : false;

  //If itemNumber and quantity have been entered continue to process cart
  if(itemNumber && quantity) {

    //Confirm that this session has not expired based on time token was created (1 hour)
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    //Lookup the user data and capture users phone for verification in order to proceed
    _data.read('tokens',token,function(err,tokenData) {
      if(!err && tokenData) {
        var userPhone = tokenData.phone;

        //Verify that the given token is valid and belongs to the user shopping
        _tokenVerify.tokenVerify(token,userPhone,function(tokenIsValid) {
          if(tokenIsValid) {

            //Temporary menu variable pizza is currently hard coded
            //Check quantity of itemNumber and multiply price to get total
            //@TODO
            //Have to implement a smarter way to gather menu JSON objects
            var menuType = 'pizza';
            _data.read('menu',menuType,function(err,menuData) {
              if(!err && menuData) {
                  //Replacing decimal point in price in order to preserve trailing zeros if any
                  //Necessary for stripe, stripes methods are that the last two digits are always cents
                  var itemPrice = menuData[itemNumber].price.replace('.','');
                  var itemsTotal = itemPrice * quantity;

            //Lookup the user data based on users phone (userPhone) captured from token verification
            //Add cartId to users data, counting maximum number of carts (5)
            _data.read('users',userPhone,function(err,userData) {
            if(!err && userData) {
               var userSession = Object.prototype.toString.call(userSession) == "[object Array]" 
                             ? userData.session : userData.session || [];

              //Verify that the user has less than max number of carts permitted (5)
              if(userSession.length < config.maxCarts) {

                //Create a random id for the session to be applied to an order
                //relating to the users shopping cart
                var sessionId = helpers.createRandomString(20);

                //Create cart object to save to cart as cartId.json
                var cartObject = {
                  'cartId' : sessionId,
                  'userPhone' : userPhone,
                  'emailAddress' : userData.emailAddress,
                  'product' : menuData[itemNumber].product,
                  'price' : menuData[itemNumber].price,
                  'quantity' : quantity,
                  'total' : itemsTotal,
                }

                //Save the cart object
                _data.create('cart',sessionId,cartObject,function(err) {
                  if(!err) {
                    //Add the session id to the userData object
                    userData.session = userSession
                    userData.session.push(sessionId);

                    //Save the new user data
                    _data.update('users',userPhone,userData,function(err) {
                      if(!err) {
                        callback(200,cartObject);
                      } else {
                        callback(500,{'Error' : 'Could not update the user with a new cart'});
                      }
                    });
                  } else {
                    callback(500,{'Error' : 'Could not create the new cart'});
                  }
                });
                
              } else {
                callback(400,{'Error' : 'The user already has the maximum number of carts ('+config.maxCarts+')'});
              }

            } else {
              callback(403);
            }

            });


          } else {
            callback(400,{'Error' : 'Something went wrong opening '+menuType+' menu or '+menuType+ ' menu does not exist'});
          };
        });
            

      //Token data goes here
      } else {
        callback(403,{'Error' : 'Token has expired or not in headers (_cart.post)'});
      }
    });


    } else {
      callback(403, {'Error' : 'Token may have expired or does not exist.Cannot continue until you log in.'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required inputs, or inputs are invalid. Valid inputs are: itemNumber, quantity'}); 
  } 

};


//Cart - get
//Required data : cartId
//Optional data: none
//Get for cartHandlers._cart
cartHandlers._cart.get = function(data,callback) {
  //Check that the id is valid captured from url as ?cart=cartId
  var cartId = typeof(data.queryStringObject.cart) == 'string'
                      && data.queryStringObject.cart.trim().length == 20
                      ? data.queryStringObject.cart.trim() : false;
  if(cartId) {

    //Lookup the cart information
    _data.read('cart',cartId,function(err,cartData){
      if(!err && cartData) {

    //Get the token from the headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    //Verify that the given token is valid and belongs to the user created the cart
    _tokenVerify.tokenVerify(token,cartData.userPhone,function(tokenIsValid) {
      if(tokenIsValid) {
        //Return the cart data
        callback(200,cartData);
      } else {
        callback(403, {'Error' : 'Getting something about an invalid token'});
      }
    });

      } else {
        callback(404);
      }

    });

  } else {
    callback(400,{'Error' : 'Missing required field.Need cart number to proceeed'});
  }
};


//Put for cartHandlers._cart
cartHandlers._cart.put = function(data,callback) {
};


//Delete for cartHandlers._cart
cartHandlers._cart.delete = function(data,callback) {

  //Check that the cartId is valid
  //Set to cartId to be sure the user wants to delete the cart
  var cartId = typeof(data.queryStringObject.cartId) == 'string'
                      && data.queryStringObject.cartId.trim().length == 20
                      ? data.queryStringObject.cartId.trim() : false;

  if(cartId) {
    _data.read('cart',cartId,function(err,cartData) {
      if(!err && cartData) {
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    //Verify that the given token is valid for the phone number
    _tokenVerify.tokenVerify(token,cartData.userPhone,function(tokenIsValid) {
      if(tokenIsValid) {
   
        //Delete the cart data
        _data.delete('cart',cartId,function(err) {
          if(!err) {

            //Delete the session id in the user object (ie ./data/users/{phoneId}.json) relating to the cart data
            _manageSession.manageSession(cartData,cartId,function(err,sessionMessage) {
              callback(err,sessionMessage);
            });
        
          } else {
            callback(500,{'Error' : 'Could not delete the cart data'}); }
        });

      } else {
        callback(403,{'Error' : 'Missing required token in header, or token is invalid'});
      }
    });

      } else {
        callback(400,{'Error' : 'The specified cart ID does not exist'});
      }

    });
    
  } else {
    callback(400,{'Error' : 'Query is missing or incorrect should be: cart?cartId=\{cartId\}'});
  }

};    


module.exports = cartHandlers;
