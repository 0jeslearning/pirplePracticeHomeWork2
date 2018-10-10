/*
 *
 *SVM
 *Handler for checks
 *Online Pizza Order Delivery
 *File: lib/handlers/checkHandlers.js
 *
 */
 

 var checkHandlers = {};


//Checks
checkHandlers.checks = function(data,callback) {
  var acceptableMethods = ['post','get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1) {
      checkHandlers._checks[data.method](data,callback);
    } else {
      callback(405);
    }
};


//Container for all the checks methods
checkHandlers._checks = {};


//Post for checkHandlers_.checks.
checkHandlers._checks.post = function(data,callback) {
};

//Get for checkHandlers_.checks.
checkHandlers._checks.get = function(data,callback) {
};

//Putt for checkHandlers_.checks.
checkHandlers._checks.put = function(data,callback) {
};

//Delete for checkHandlers_.checks.
checkHandlers._checks.delete = function(data,callback) {
};


module.exports = checkHandlers;
