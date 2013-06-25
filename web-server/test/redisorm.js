/**
 * @author: youxiachai
 * @Date: 13-6-24
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */
var redis = require('redis');
var nohm = require('nohm').Nohm;
var uuid = require('uuid');

var redisClient = redis.createClient();

var UserModel = require('../model/UserModel');

var cryptoUtils = require('popularcrypto');
function saveUser(user, username, password, accessToken) {
    user.p('username', username);
    user.p('password', password);
    user.p('accessToken', accessToken);
    user.save(function (err) {
        if (err) {
            console.log(user.errors);
        } else {
            console.log(user);
        }
    });
}

function createUser() {
    //创建100个用户
    for (var i = 0; i < 100; i++) {
        var user = new UserModel();
        saveUser(user, 'tom' + i, 'password' + i, uuid.v1());
    }
}

function testSaveSameUser() {
    var user = new UserModel();
    user.p('username', 'tome4');
    user.p('password', '123456');
    user.p('accessToken', uuid.v1());
    user.save(function (err) {
        if (err) {
            console.log(user.errors);
        } else {
            console.log(user);
        }
    });
}

function testFindAndLoad(username) {
    UserModel.findAndLoad({username: username}, function (err, ids) {
        if (err) {
            console.log('error->' + err);
        } else {
            // console.log(ids);
//            if (!ids.length) {
//                cb(null, data[0]);
//            }
            console.log(ids[0].allProperties());
            //  console.log(ids.length);
        }

    });
}

function testFindUser(username) {
    UserModel.find({username: username}, function (err, ids) {
        if (err) {
            console.log('error-->' + err);
        } else {
            console.log(ids);
            var user = new UserModel();
            user.load(ids, function (err, pro) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(pro);
                }
            });
        }
    });
}


function testFindUserById(id) {
    var user = new UserModel();
    user.load(id, function (err, properties) {
        if (err) {
            console.log(err);
            // err may be a redis error or "not found" if the id was not found in the db.
        } else {
            properties.id = id;
            console.log(properties);
            // you could use this.allProperties() instead, which also gives you the 'id' property
        }
    });
}

var testSignIn = function () {
    var user = new UserModel();
    // a9f4c42732d3b50675a8d3c67d8b7275
    //tome11111
    // 2988c1e4a3665e2fe815ee396279998c
    //e10adc3949ba59abbe56e057f20f883e
    user.signIn('tome3', 'e10adc3949ba59abbe56e057f20f883e', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            console.log(data.accessToken);
        }
    });
};

var testSignUP = function () {
    var user = new UserModel();
    // a9f4c42732d3b50675a8d3c67d8b7275
    //tome11111
    // 2988c1e4a3665e2fe815ee396279998c
    //e10adc3949ba59abbe56e057f20f883e
//    user.signUp('tome104', 'e10adc3949ba59abbe56e057f20f883e', 'tome102g.com', function (err, data) {
//        if (err) {
//            console.log(err);
//        } else {
//            console.log(data);
//            console.log(data);
//        }
//    });

    testFindUserById(100000);
};


redisClient.on("connect", function () {
    nohm.setClient(redisClient);
    console.log("Nohm Connected to Redis Client");
    //createUser();
    // testSaveSameUser();
//    testFindUser('tome2222');
    // testFindAndLoad('tomsse2');
    // testFindAndLoad('tome4');
    //testSignIn();

    testFindUserById(100);
});



