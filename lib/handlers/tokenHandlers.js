/*
 *
 * SVM
 * For Online Pizza Order Delivery
 * Handler for tokens
 * tokenHandlers.js
 *
 */
//Dependencies
var _data = require('../data');
var helpers = require('../helpers');


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
//Tokens - post
//Required data: phone, password
//Optional data: none
//handlers._tokens.post = function(data,callback) {
tokenHandlers._tokens.post = function(data,callback) {
  var phone = typeof(data.payload.phone) == 'string'
                          && data.payload.phone.trim().length == 10 
                          ? data.payload.phone.trim() : false;

  var password = typeof(data.payload.password) == 'string'
                          && data.payload.password.trim().length > 0
                          ? data.payload.password.trim() : false;

  //SVM
  console.log('\n\ndata in tokenHandlers.js: ',data);

  if(phone && password) {
    //Look up the user who matches that phone number
    _data.read('users',phone,function(err,userData) {
      if(!err && userData) {
        //Hash the sent password and compare it to the password stored in the user object
        var hashedPassword = helpers.hash(password);
        if(hashedPassword == userData.hashedPassword) {
          //If valid create a new token with a random name.
          //Set expiration date 1 hour in the future 
          var tokenId = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenObject = {
            'phone' : phone,
            'emailAddress' : userData.emailAddress,
            'id' : tokenId,
            'expires' : expires
          };

          //Store the token
          _data.create('tokens',tokenId,tokenObject,function(err){
          if(!err) {
            callback(200,tokenObject);
          } else {
            callback(500,{'Error' : 'Could not create the new token. Check of .data/tokens directory exists'});
          }
          });
        } else {
          callback(400,{'Error' : 'Password did not match the specified user\'s stored password'});
        }
      } else {
        callback(400,{'Error' : 'Could not find the specified user'});
      }
    });
   
  } else {
    callback(400,{'Error' : 'Missing required fields(s), could not create token'});
  }

};


//Get method for tokenHandlers._tokens.get
tokenHandlers._tokens.get = function(data,callback) {
};


//Put method for tokenHandlers._tokens
tokenHandlers._tokens.put = function(data,callback) {
};


//Delete method for tokenHandlers._tokens
//Tokens - delete
tokenHandlers._tokens.delete = function(data,callback) {
  //Check that the token id is valid
  var id = typeof(data.queryStringObject.id) == 'string'
                      && data.queryStringObject.id.trim().length == 20
                      ? data.queryStringObject.id.trim() : false;
  if(id) {
    //Look up user
    _data.read('tokens',id,function(err,data) {
      if(!err && data) {
        _data.delete('tokens',id,function(err) {
          if(!err && data) {
            callback(200,{'Message' : 'You have been logged out'})
          } else {
            callback(500,{'Error' : 'Could not delete the specified token'});
          }
        });
    } else {
      callback(400,{'Error' : 'Could not find specified token'});
    }
    });
  } else {
    callback(400,{'Error' : 'Missing required field'});
  }
};


module.exports = tokenHandlers;
