var express = require('express');
var app = express();
var http = require('http');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var users = [
    { id: 1, username: 'tom', password: '123456', email: 'bob@example.com' }
    , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    console.log("serializeUser" + user);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        console.log("deserializeUser" + user);
        done(err, user);
    });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            findByUsername(username, function(err, user) {
                if (err) { return done(err); }
                if (!user) {
                    console.log('Unknown user ' + username);
                    return done(null, false, { message: 'Unknown user ' + username }); }
                if (user.password !== password) {
                    console.log('Invalid password');
                    return done(null, false, { message: 'Invalid password' }); }
                return done(null, user, {message: 'all right'});
            });
        });
    }
));


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
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
   // app.use(flash());
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());


    //set router
    app.use(app.router);

});

app.configure('development', function () {
    console.log("development");
    app.use(express.static(__dirname + '/'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    var oneYear = 31557600000;
    console.log("production");
    app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
    app.use(express.errorHandler());
});
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

//passworpart
//app.post('/signin',passport.authenticate('local',  { failureRedirect: '/', failureFlash: true, successFlash: true } ),
//    function (req, res) {
//        console.log(req.flash('success'));
//        res.render('dashboard', {user: req.user});
//});

app.post('/signin',passport.authenticate('local',  { failureRedirect: '/', successRedirect: '/dashboard', failureFlash: true, successFlash: true } ));

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
    console.log('Express server listening on port ' + app.get('port') + "\n" + process.env.NODE_ENV);
   // console.log(process.env);
});

