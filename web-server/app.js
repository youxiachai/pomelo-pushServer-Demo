var express = require('express');
var app = express();
var http = require('http');
var auth = require('./routes/auth');
var passport = auth.passport;

//configure all env
app.configure(function () {
    //set views
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('port', process.env.PORT || 3001);
    app.use(express.logger('dev'));
    // cookie support
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    //session support
    app.use(express.session({ secret: 'keyboard cat' }));

    auth.passportInit(app);


});

app.configure('development', function () {
    console.log("development");
    app.use(express.static(__dirname + '/'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    //set router
    app.use(app.router);
});

app.configure('production', function () {
    var oneYear = 31557600000;
    console.log("production");
    app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
    app.use(express.errorHandler());
    //set router
    app.use(app.router);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


app.post('/signin', passport.authenticate('local', { failureRedirect: '/', successRedirect: '/dashboard', failureFlash: true, successFlash: true }));

var userAction = require('./routes/user');
app.post('/signUp', userAction.signUp);

app.get('/dashboard', ensureAuthenticated, function (req, res) {
    res.render('dashboard', {user: req.user});
});

app.get('/', function (req, res) {

    // flash 使用一次...
    var failureMessage = req.flash('error');
    console.log('failureMessage1-->' + failureMessage);
    res.render('index', {message: failureMessage});
});


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    console.log('env: ' + process.env.NODE_ENV);
});

