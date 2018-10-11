/*
 *
 *SVM
 *Token verify
 *Online Pizza Order Delivery
 *
 */

//Dependencies
var _data = require('../data');

var lib = {};


//Verify if a given id is currently valid for a given user
//lib._tokens.verifyToken = function(id,phone,callback) {
lib.tokenVerify = function(id,phone,callback) {
  //Lookup the token
  _data.read('tokens',id,function(err,tokenData) {
  if(!err && tokenData) {
    //Check that the token is for the given user and has not expired
    if(tokenData.phone == phone && tokenData.expires > Date.now()) {
      callback(true);
    } else {
      callback(false);
    }
  } else {
    callback(false);
  }
  });
};


module.exports = lib;
