var express = require('express');
var app = express();
var http = require('http');
app.configure(function(){
  app.set('port', process.env.PORT || 3001);
    app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

});

app.configure('development', function(){
    console.log("development");
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
    console.log("production");
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});


//passworpart
app.post('/signin', function(req, res){
   var username = req.body.username;
    var password = req.body.password;
    var rember = req.body.remember;

    res.send({name:username,password: password, rember: rember});
});

app.get('/', function(req, res){
    res.render('dashboard');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port') +"\n" + process.env.NODE_ENV);
});

