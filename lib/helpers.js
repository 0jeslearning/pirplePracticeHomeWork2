/*
 *
 *SVM
 *Helpers for varous tasks
 *For Online Pizza Order Delivery System
 *
 */
//Dependencies
var config = require('./config');

var crypto = require('crypto');
var https = require('https');
var querystring = require('querystring');


//Container for all the helpers
var helpers = {};


//Create a SHA256 hash
helpers.hash = function(str) {
  if(typeof(str) == 'string' && str.length > 0) {
    var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};


//Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = function(str) {
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e) {
    return {};
  }
};


//Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength) {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength) {
    //Define all the possible chracters that could go in to a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    //Start the final string
    var str = '';
    for(i = 1; i <= strLength; i++) {
      //Get random character from possibleCharacter string
      var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      //Append this character to the final string
      str+=randomCharacter;
    }

    //Return the final string
    return str;
    
  } else {
    return false;
  }

};


//Charging card
//helpers.stripeCharge = function(cardNumber,cardExp_month,cardExp_year,cardCvc,callback) {
helpers.stripeCharge = function(data,callback) {
    console.log('\n\nIn helpers.stripeCharge data is: ',data);

  amount = typeof(data.amount.replace('.','')) == 'string'
                   && data.amount.replace('.','') > 0
                   ? data.amount.replace('.','') : false;
  
  description = typeof(data.description) == 'string'
                         && data.description.trim().length > 0
                         ? data.description: false;

  if(amount && description) {

    var payload = {
      'amount' : amount,
      'currency' : 'usd',
      'source' : 'tok_visa',
      'description' : description+':'+data.emailAddress
    }

  var stringPayload = querystring.stringify(payload);
      
  //Configure the request details
  var  requestDetails = {
    'protocol' : 'https:',
    'hostname' : 'api.stripe.com',
    'method' : 'POST',
    'path' : '/v1/charges',
    'auth' : config.stripe.secretKey+':',
    'headers' : {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' : Buffer.byteLength(stringPayload)
            },
  };

  //Instantiate the request object
  var request = https.request(requestDetails,function(res){

      var responseString = {};
      res.on("data",function(data) {
        responseString = JSON.parse(data);
      });

      res.on("error",function(e) {
        console.log('In res.on e is: ',e);
        callback(e);
      });

      
      res.on("Error",function(e) {
        console.log(e);
        callback(e);
      });

      res.on("end",function(){
        console.log('\n\nIn helpers responseString is: ',responseString);
        if(!responseString.error) { 
          callback(false, responseString);
        } else {
          callback(responseString.error, responseString);
        }
      });

  });


  request.write(stringPayload);
  request.end();

  } else {
    callback(400,{'Error' : 'Something is wrong with amount or description'});
  }

};


//Sending mailgun email
//Right now required elements are:
//userEmail and orderId
//email text is instantiated in var emailText below
helpers.mailgunEmail = function(data,callback) {

  var userEmail =  typeof(data.userEmail) == 'string'
                          && data.userEmail.trim().length > 0
                          ? data.userEmail.trim() : false;

  var orderId = typeof(data.orderId) == 'string'
                       && data.orderId.trim().length > 0
                       ? data.orderId.trim() : false;

  if(userEmail && orderId) {
      console.log('userEmail is: ',userEmail);

  var emailText = 'This is in regards to your order for pizza...it is...delicious';

  //Details of payload to be sent
  var payload = {
      'from' : 'Online Pizza Order <pizzamaster@sandbox79010084e7a64f3d9f3e18cdce51579c.mailgun.org>',
      'to' : userEmail,
      'subject' : 'Re: '+orderId,
      'text' : emailText
    };

  var mailgunPayload = querystring.stringify(payload);

  //Configure the request details
  var  requestDetails = {
    'protocol' : 'https:',
    'hostname' : 'api.mailgun.net',
    'method' : 'POST',
    'path' : '/v3/sandbox79010084e7a64f3d9f3e18cdce51579c.mailgun.org/messages',
    'auth' : 'api:'+config.mailgun.privateKey,
    'headers' : {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' : Buffer.byteLength(mailgunPayload)
            }
  };


  var req = https.request(requestDetails,function(res,callback){
    //Grabbing any messages
    res.on('data',function(data) {
      console.log(data.toString('utf8'));
    });

    res.on('error',function(e) {
      console.log('e is: ',e);
    });

  });

  //Writing message to request
  req.write(mailgunPayload);
  req.end()

  } else {
    callback(400,{'Error' : 'Something went wrong email not sent'});
  }

};


//A basic regexp to validate a format of email address entered
//Copied from here:
//https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
helpers.validateEmail = function(email,callback) {

  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(re.test(email)) {
    callback(true, email);
  } else {
    callback(false, email);
  }

};


//Export the module
module.exports = helpers;
