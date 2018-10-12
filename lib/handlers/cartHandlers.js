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
//Required data: protocol, url, method, successCodes, timeoutSeconds
//Optional data: none
cartHandlers._cart.post = function(data,callback) {

  var protocol = typeof(data.payload.protocol) == 'string'
                          && ['https','http'].indexOf(data.payload.protocol) > -1 
                          ? data.payload.protocol : false;

  var url = typeof(data.payload.url) == 'string'
                          && data.payload.url.trim().length > 0 
                          ? data.payload.url.trim() : false;

  var method = typeof(data.payload.method) == 'string'
                          && ['post','get','put','delete'].indexOf(data.payload.method) > -1 
                          ? data.payload.method : false;

  var successCodes = typeof(data.payload.successCodes) == 'object'
                          && data.payload.successCodes instanceof Array
                          && data.payload.successCodes.length > 0 
                          ? data.payload.successCodes : false;

  var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number'
                          && data.payload.timeoutSeconds % 1 == 0
                          && data.payload.timeoutSeconds >= 1
                          && data.payload.timeoutSeconds <= 5
                          ? data.payload.timeoutSeconds : false;

  if(protocol && url && method && successCodes && timeoutSeconds) {
    //Get token from headers
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    //Lookup the user data
    _data.read('tokens',token,function(err,tokenData) {
      if(!err && tokenData) {
        var userPhone = tokenData.phone;

        //Verify that the given token is valid and belongs to the user created the check
        _tokenVerify.tokenVerify(token,userPhone,function(tokenIsValid) {
          if(tokenIsValid) {

        //Lookup the user data
        _data.read('users',userPhone,function(err,userData){
        if(!err && userData) {
           var userChecks = Object.prototype.toString.call(userChecks) == "[object Array]" 
                             ? userData.checks : userData.checks || [];

          //Verify that the user has less than max number of checks permitted
          if(userChecks.length < config.maxChecks) {
            //Create a random id for the check
            var checkId = helpers.createRandomString(20);

            //Create the check object and include the users phone
            var checkObject = {
              'id' : checkId,
              'userPhone' : userPhone,
              'protocol' : protocol,
              'url' : url,
              'method' : method,
              'successCodes' : successCodes,
              'timeoutSeconds' : timeoutSeconds
            };
            
            //Save the object
            _data.create('checks',checkId,checkObject,function(err) {
              if(!err) {
                //Add the check id to the users object
                userData.checks = userChecks;
                userData.checks.push(checkId);

                //Save the new user data
                _data.update('users',userPhone,userData,function(err) {
                  if(!err) {
                    callback(200,checkObject);
                    
                  } else {
                    callback(500,{'Error' : 'Could not update the user with a new check'});
                  }
                });
              } else {
                callback(500,{'Error' : 'Could not create the new check'});
              }
            });

          } else {
            callback(400,{'Error' : 'The user already has the maximum number of checks ('+config.maxChecks+')'});
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
        callback(403, {'Error' : 'Forbidden. Check if token exists'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required inputs, or inputs are invalid'}); 
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
