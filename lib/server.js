
/*
 * SVM
 * Server related tasks
 * server.js
 * For Online Pizza Order Delivery
 *
 */

//Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var handlers = require('./handlers/handlers');
var helpers = require('./helpers');
var path = require('path');


//Instantiate server module object
var server = {};


//Instantiate the HTTP server
//server.httpServer = http.createServer(function(req,res) {
server.httpServer = http.createServer(function(req,res) {
  server.unifiedServer(req,res);
});


//All the server logic for http and https belong to here
server.unifiedServer = function(req,res) {

  //Get URL and parse it
  var parsedUrl = url.parse(req.url,true);

  //Get path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  //Get the query string as an object
  var queryStringObject = parsedUrl.query;

  //Get headers as an object
  var headers = req.headers;

  //Get the HTTP method
  var method = req.method.toLowerCase();

  //Get payload if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data',function(data){
    buffer += decoder.write(data);
  });
  req.on('end',function(){
    buffer += decoder.end();

    //Choose handler that this request goes to
    var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined'
                                ? server.router[trimmedPath] : handlers.notFound;

    //Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : helpers.parseJsonToObject(buffer)
    };

    //Route the request to the handler specified in the server.router
    chosenHandler(data,function(statusCode,payload) {
      //Use the status code called back by the handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      
      //Use the payload called back by the handler
      //or default to and empty object
      payload = typeof(payload) == 'object' ? payload : {};

      var payLoadString = JSON.stringify(payload);

      //Return response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payLoadString);

      //SVM
      //Log the requested path
      console.log('\n\nReturning statusCode is: ',statusCode);
      console.log('payLoadString is: ',payLoadString);
      console.log('Message End in lib/server.js\n\n');

    });

  //SVM
  //console.log('In lib/server.js data is: ', data);

  });


  //SVM
  //Log the request path
  /*
  console.log('\nQueryStringObject is: ',queryStringObject,
                '\ntrimmedPath is: '+trimmedPath+ 
                '\nrequest received with these headers',headers,
                '\nrequest received with this buffer',buffer,
                '\nusing this method: '+method);
                */
 


};


//Define a request router
server.router = {
  'ping' : handlers.ping,
  'cart' : handlers.cart,
  'menu' : handlers.menu,
  'order' : handlers.order,
  'checks' : handlers.checks,
  'tokens' : handlers.tokens,
  'users' : handlers.users,
};


//Init script
server.init = function() {
  //Start the server, listen on port 3000
  //server.httpServer.listen(config.httpPort,function() {
  server.httpServer.listen(config.httpPort,function() {
  console.log('\x1b[31m%s\x1b[0m',"The server is listening on port: "+config.httpPort);
  });
}


//Export the module
module.exports = server;
