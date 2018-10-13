/*
 *
 * SVM
 * lib/data.js
 * Online Pizza Ordering Delivery
 *
 */


//Dependencies
var fs = require('fs');
var path = require('path');
var helpers = require('./helpers');

//Container for module to be exported
var lib = {};

//Base directory of data folder
lib.baseDir = path.join(__dirname,'/../.data/');


//Write data to a file
lib.create = function(dir,file,data,callback) {
    //Open file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor) {
            //Convert data to string
            var stringData = JSON.stringify(data);

            //Write to file and close it
            fs.writeFile(fileDescriptor,stringData,function(err) {
                if(!err) {
                    fs.close(fileDescriptor,function(err) {
                        if(!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('Could not create new file, it may already exist');
        }
    });

};


var encodingObject = {'encoding': 'utf8'};

//Read data from file
lib.read = function(dir,file,callback) {
    fs.readFile(lib.baseDir+dir+'/'+file+'.json',encodingObject,function(err,data){
      if(!err && data) {
        var parsedData = helpers.parseJsonToObject(data);
        callback(false,parsedData);
      } else {
        callback(err,data);
      }
    });

};


//Delete file from given directory
lib.delete = function(dir,file,callback) {
  fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err) {
    if(!err) {
      callback(false);
        } else {
          callback('Error deleting file');
        } 
    });
};


//Update file
lib.update = function(dir,file,data,callback) {
    //Open file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        if(!err && fileDescriptor) {
            var stringData = JSON.stringify(data);

            //Truncate file
            fs.truncate(fileDescriptor,function(err) {
             if(!err) {

              fs.writeFile(fileDescriptor,stringData,function(err) {
               if(!err) {
                 fs.close(fileDescriptor,function(err) {

                 if(!err) {
                  callback(false);
                     } else {
                       callback('Error closing existing file');
                     }
                   });

                  } else {
                    callback('Error writing to existing file');
                  }
              });

                 } else {
                    callback('Error truncating file');
                 }
                });

        } else {
            callback('Could not open file for updating, it may not exist yet');
        }

    });

};



module.exports = lib;
