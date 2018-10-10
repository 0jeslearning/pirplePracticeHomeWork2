
/*
 *
 * SVM
 * userHandlers.js
 * Handler file for users
 *
 */



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
userHandlers._users.post = function(data,callback) {
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
