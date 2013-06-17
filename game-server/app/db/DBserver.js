/**
 * Created with JetBrains WebStorm.
 * User: youxiachai
 * Date: 13-6-16
 * Time: 下午2:40
 * To change this template use File | Settings | File Templates.
 */

var redis = require("redis"),
    client = redis.createClient();

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

//client.set("tom", "password", redis.print);
//
//client.get("tom1", function(err, reply) {
//    // reply is null when the key is missing
//    if(err){
//        console.log(err);
//        return;
//    }
//    console.log(reply);
//});

var encrypt = require('../libs/utils');


var isExist = function(username, cb){
    console.log(username);
    client.get(username, function(err, value){
        if(err){
            console.log(err);
            return cb(err, value);
        }
        if(!value){
            return cb(null, false);
        }else{
            return cb(null, true);
        }
    });
};

var signIn = function(username, password, cb){
    client.get(username, function(err, value){
        if(err){
            console.log("err" + err);
            return cb(err, false);
        }
        if(encrypt.md5(password) == value){
            return cb(null, true);
        }else{
            return cb(null, false);
        }
    });
};

var signUp = function(username, password, cb){
//    if(!findUserName(username)){
//        client.set(username, encrypt.md5(password), redis.print);
//        return cb(true);
//    }else{
//        return cb(false);
//    }

    isExist(username, function(err, value){
       if(err){
           return cb(err, value);
       }

       if(!value){
           client.set(username, encrypt.md5(password), redis.print);
           return cb(null, value);
       }else{
            return cb(null, value);
       }
    });
}

exports.checkUserName = isExist;

exports.signIn = signIn;

exports.signUp = signUp;





