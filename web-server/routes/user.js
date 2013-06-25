/**
 * @author: youxiachai
 * @Date: 13-6-25
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */

var UserModel = require('../model/UserModel');
var redis = require('redis');

var nohm = require('nohm').Nohm;
var redisClient = redis.createClient();

redisClient.on('error', function (err) {
    console.log('error->' + err);
});

redisClient.on('connect', function () {
    console.log("nohm redis connect");
    nohm.setClient(redisClient);

});

var signUpUser = function (req, res) {
    var userName = req.body.username;
    var password = req.body.password;
    var user = new UserModel();
    user.signUp(userName, password, function (err, data) {
        if (err) {
            console.log(err);
            res.render('index', {message: err.saveError });
        } else {
            console.log(data);
            res.render('dashboard', {user: data});
        }
    });
};

exports.signUp = function (req, res) {
    signUpUser(req, res);
};

exports.signIn = function (username, password, cb) {
    var user = new UserModel();
    user.signIn(username, password, cb);
};