/*
 *
 * SVM
 * index.js for Online Pizza Order Delivery software
 *
 */

//Dependencies
var server = require('./lib/server');

//Declare the app
var app = {};


//Init function
app.init = function() {
  //Start the server
  server.init();

  //SVM
  console.log('In index.js starting server.init');

}


//Execute
app.init();


//Export the app
module.exports = app;
