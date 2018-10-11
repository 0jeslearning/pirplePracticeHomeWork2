
/*
 *
 * SVM
 * userHandlers.js
 * Handler file for users
 *
 */

var _data = require('../data');
var helpers = require('../helpers');



var userHandlers = {};


//Users
userHandlers.users = function(data,callback) {
  var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
      userHandlers._users[data.method](data,callback);
    } else {
      callback(405);
    }
};


userHandlers._users = {};

//Post for userHandlers._user for user data
//Users - post
//Required data: firstName,lastName,phone,password,tosAgreement
//Optional data: none
//handlers._users.post = function(data,callback){
userHandlers._users.post = function(data,callback) {
  //Check that all required fields are filled out
  var firstName = typeof(data.payload.firstName) == 'string'
                          && data.payload.firstName.trim().length > 0
                          ? data.payload.firstName.trim() : false;

  var lastName = typeof(data.payload.lastName) == 'string'
                          && data.payload.lastName.trim().length > 0
                          ? data.payload.lastName.trim() : false;

  var streetNumber = typeof(data.payload.streetNumber) == 'string'
                          && data.payload.streetNumber.trim().length > 0
                          ? data.payload.streetNumber.trim() : false;

  var streetName = typeof(data.payload.streetName) == 'string'
                          && data.payload.streetName.trim().length > 0
                          ? data.payload.streetName.trim() : false;

  var phone = typeof(data.payload.phone) == 'string'
                          && data.payload.phone.trim().length == 10 
                          ? data.payload.phone.trim() : false;

  var password = typeof(data.payload.password) == 'string'
                          && data.payload.password.trim().length > 0
                          ? data.payload.password.trim() : false;

  var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean'
                          && data.payload.tosAgreement == true
                          ? true : false;

  if(firstName && lastName && streetNumber && streetName && phone && password && tosAgreement) {
    //Make sure that the user doesnt already exist
    _data.read('users',phone,function(err,data){
      if(err) {
       //Hash the password
       var hashedPassword = helpers.hash(password); 

       //Create user object
       if(hashedPassword) {

       //Create the user object
       var userObject = {
        'firstName' : firstName,
        'lastName' : lastName,
        'streetNumber' : streetNumber,
        'streetName' : streetName,
        'phone' : phone,
        'hashedPassword' : hashedPassword,
        'tosAgreement' : true
       };

       //Store the user
       _data.create('users',phone,userObject,function(err) {
          if(!err) {
            callback(200);
          } else {
            console.log(err);
            callback(500,{'Error' : 'Could not create the new user. Directory ./data/users may not exist'}); 
          }
       });
       
       } else {
          callback(500,{'Error' : 'Could not hash the user\'s password'});
       }

      } else {
        //User already exists
        callback(400,{'Error' : 'A user with that phone number already exists'});
      };
    });

    } else {
      callback(400,{'Error' : 'Missing required fields'})
    }
};


//userHandlers._user.get for user
userHandlers._users.get = function(data,callback) {
};


//userHandlers._user.put for user
userHandlers._users.put = function(data,callback) {
};


//userHandlers._user.delete for user
userHandlers._users.delete = function(data,callback) {
};




module.exports = userHandlers;
