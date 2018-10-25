/*
 *
 *SVM
 *Handler for orders
 *Online Pizza Order Delivery
 *File: lib/handlers/orderHandlers.js
 *
 */

//Dependencies
var _tokenVerify = require('./tokenVerify');
var _manageSession = require('./manageSession');
var _data = require('../data');
var _helpers = require('../helpers');


//Object to export will be populated according to the method that comes
//in with the request
var orderHandlers = {};

//Order
//Constructing methods checker for when an http(s) request comes in
orderHandlers.order = function(data,callback) {
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

  //Capturing cartId from url query (orders?cart={cart_object})
  var cartId = typeof(data.queryStringObject.cart) == 'string'
                      && data.queryStringObject.cart.trim().length == 20
                      ? data.queryStringObject.cart.trim() : false;

  if(cartId) {

    //Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    //Lookup the user data
    _data.read('tokens',token,function(err,tokenData) {
      if(!err && tokenData) {
        //Verify that the given token is valid and belongs to the user shopping
        var userPhone = tokenData.phone;
        _tokenVerify.tokenVerify(token,userPhone,function(tokenIsValid) {
          if(tokenIsValid) {
            //If token is valid check if this order/cart has already been processed
            //Check for existence of cartId.json in .data/order/
            _data.read('order',cartId,function(err,orderData){
            if(!orderData) {
            //If order has  not already been processed, find the cartId.json file in .data/cart/
            _data.read('cart',cartId,function(err,cartData){
              if(cartData) {
                cartData.orderId = cartData.cartId;
                //Getting order total, item description and email
                //Constructing object and sending to helper to charge
                var cObject = {
                  'emailAddress' : tokenData.emailAddress,
                  'description' : cartData.product,
                  'amount' : cartData.total.toString()
                };
                _helpers.stripeCharge(cObject,function(err, cData) {
                  //If stripeCharge returns status succeeded append transaction id to cartData object
                  //Save cartData order to ./data/order as cartId.json 
                  if(cData.status == 'succeeded') {
                    cartData.transactionId = cData.id  ;
                    delete cartData.cartId;

                    //SVM
                    //console.log('\n\nIn lib/handlers/orderHandlers');
                    //console.log('cData.source is: ',cData.source);
                    //console.log('cData.source.brand is: ',cData.source.brand);
                    //console.log('cData.source.last4: ',cData.source.last4);

                    _data.create('order',cartId,cartData,function(err) {
                      if(!err) {
                        //Delete the cartId.json file in .data/cart/ to prevent duplicate orders
                        var re = /(\d+)(\d)(\d)/;
                        _data.delete('cart',cartId,function(err) {
                          var mailObject = {
                            'userEmail' : cObject.emailAddress,
                            'orderId' : cartId,
                            'amount' : cObject.amount.replace(re,'$1.$2$3')
                          };
                          _helpers.mailgunEmail(mailObject,function(err,data){
                            //console.log('_helpers.mailgunEmail err and data is: ', err, data);
                            console.log('_helpers.mailgunEmail err and data is: ', err);
                          });
                          //Delete the session id in the user object (ie ./data/users/{phoneId}.json)
                          //relating to the cart data
                          _manageSession.manageSession(cartData,cartId,function(err,sessionMessage) {
                          //callback(err,sessionMessage);
                          console.log(err,sessionMessage);
                          });
        
                         });

                        } else {
                          console.log(err);
                        }
                      });

                    //Customer only gets this message
                    callback(200,{'Message' : cData.status});
                  } else {
                    callback(400,{'Error' : 'Failed to charge card, message returned is: '+err.type+' failing parameter is: '+err.param});
                    console.log('\n\nIn orderHandlers charge process broke check helpers.stripeCharge\n');
                    console.log('Error in handlers orderHandlers is: ',err);
                  }
                });

              } else {
                callback(400,{'Error' : 'Something wrong with cartData.Message seems to be: ',err});
              }

            });

            } else {
              callback(400,{'Error' : 'This order may have already been processed'}); 
            }
            });

          } else {
            callback(403,{'Error' : 'Token seems to have expired or does not exist'});
          }
        });

    } else {
      callback(403, {'Error' : 'Token may have expired or does not exist.Cannot continue until you log in.'});
      }

    });

  } else {
    callback(403,{'Error' : 'Cart ID query missing should be: /order?cart=\{cart_id\}'});
  }

};



//Checks - get
//Required data : id
//Optional data: none
//Get for orderHandlers._order
orderHandlers._order.get = function(data,callback) {
  //Check that the orderId is valid
  var orderId = typeof(data.queryStringObject.orderId) == 'string'
                      && data.queryStringObject.orderId.trim().length == 20
                      ? data.queryStringObject.orderId.trim() : false;

  if(orderId) {
    //Lookup the order
    _data.read('order',orderId,function(err,orderData){
      if(!err && orderData) {

    //Get the token from the headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    //Verify that the given token is valid and belongs to the user created the order
    _tokenVerify.tokenVerify(token,orderData.userPhone,function(tokenIsValid) {
      if(tokenIsValid) {
        //Return the order data
        callback(200,orderData);
      } else {
        callback(403, {'Error' : 'Getting something about an invalid token'});
      }
    });

      } else {
        callback(400, {'Error' : 'Seems this order may not exist or cannot be retrieved'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required field \(order/orderId?=\{order_id\}\)'});
  }
};


//Put for orderHandlers._order
orderHandlers._order.put = function(data,callback) {
};


//Delete for orderHandlers._order
orderHandlers._order.delete = function(data,callback) {
};


module.exports = orderHandlers;
