/*
 *
 *Create and export configuration variables
 *For Online Pizza Order Delivery
 *
 */

//Container for all the environments
var environments = {};

//Staging (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'hashingSecret' : 'thisIsASecret',
  'maxCarts' : 5,
  'stripeAPI' : 'https://api.stripe.com',
  'mailgunAPI' : 'https://api.mailgun.net/v3'
};


//Production environment
environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'hashingSecret' : 'thisIsASecret',
  'maxCarts' : 5,
  'stripeAPI' : 'https://api.stripe.com',
  'mailgunAPI' : 'https://api.mailgun.net/v3'
};


//Determine which environment should be exported
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string'
                                  ? process.env.NODE_ENV.toLowerCase() : '';

//Check that the current environment is one of the environments above
//If not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' 
                                  ? environments[currentEnvironment] : environments.staging;


//Export the module
module.exports = environmentToExport;
