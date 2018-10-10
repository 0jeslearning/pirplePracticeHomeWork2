/*
 *
 * SVM
 *Helpers for varous tasks
 *For Online Pizza Order Delivery System
 *
 */
//Dependencies

//Container for all the helpers
var helpers = {};

//Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(str) {
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e) {
    return {};
  }
};


//Export the module
module.exports = helpers;
