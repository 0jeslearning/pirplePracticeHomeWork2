/*
 *
 * SVM
 * This is a session manager to delete sessions from .data/user/phoneNumber.json
 * Necessary across a few handlers
 *
 */

//Dependencies
var _data = require('../data');

//Container to hold functions for export
var lib = {};

//lib.manageSession = function(userData, callback) {
lib.manageSession = function(cartData, cartId, callback) {

//Look up user
  _data.read('users',cartData.userPhone,function(err,userData) {
    if(!err && userData) {
    //Checking if userData.session (cartId) exists
    var userCart = typeof(userData.session) == 'object'
                            && userData.session instanceof Array
                            ? userData.session : [];
        
    //Remove the deleted cart from their list of carts
    var cartPosition = userCart.indexOf(cartId);
      if(cartPosition > -1) {
        userCart.splice(cartPosition,1);
        //Re-save the users data
        _data.update('users',cartData.userPhone,userData,function(err) {
          if(!err) {
            callback(200,{'Message' : 'Cart successfully deleted'});
          } else {
            callback(500,{'Error' : 'Could not delete the specified user'});
          }
        });

      } else {
        callback(500,{'Error' : 'Could not find the cart on the user\'s object, so could not remove the cartId'});
      }

    } else {
      callback(500,{'Error' : 'Could not find user who created the cart. So could not remove the cartId from list of carts in user object'});
    }
  });

};

module.exports = lib;
