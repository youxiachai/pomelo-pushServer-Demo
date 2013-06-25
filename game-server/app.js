var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'pushapp');

var UserModel = require('./app/model/UserModel');

var nohm = require('nohm').Nohm;

var redis = require('redis');
var redisClient = redis.createClient();

redisClient.on('connect', function () {
    nohm.setClient(redisClient);
});

/**
 *
 * @param msg
 * @param session
 * @param next
 */
var authFilter = function (msg, session, next) {
    console.log('filterBefore');
    if (msg.role === 'server') {
        var user = new UserModel();
        user.load(msg.userId, function (err, data) {
            if (err) {
                var error = new Error(err + '');
                console.log(err);
                next(error);
            } else {

                if (data.password === (msg.password)) {
                    console.log('password -> ok');
                    next();
                } else {
                    console.log('invalid password');
                    next(new Error('invalid password'));
                }
            }
        });
    } else {
        next();
    }


};

var errorHandler = function (err, msg, resp, session, next) {
    console.log('errorHandler');
    console.log(msg);
    console.log(resp);
    console.log(err);
    msg.users = [];
    msg.msg = ' ' + err;
    next(err, msg);
};


// 支持 socket.io
app.configure('production|development', 'sio-connector', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.sioconnector
        });
});

//支持 websocket 和 socket
app.configure('production|development', 'hybrid-connector', function () {
    app.set('connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            heartbeat: 1000,
            useDict: true,
            useProtobuf: true

        });
    app.set('errorHandler', errorHandler);
    app.before(authFilter);
});

// start app
app.start();

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
