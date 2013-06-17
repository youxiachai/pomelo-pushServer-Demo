var pomelo = require('pomelo');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'pushapp');

// 支持 socket.io
app.configure('production|development', 'sio-connector', function(){
	app.set('connectorConfig',
		{
			connector : pomelo.connectors.sioconnector
		});
});

//支持 websocket 和 socket
app.configure('production|development', 'hybrid-connector', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 300,
            useDict: true,
            useProtobuf: true

        });
});

// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
