/**
 * @author: youxiachai
 * @Date: 13-6-24
 * @version: 1.0
 * To change this template use File | Settings | File Templates.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var userAction = require('./user');
var UserModel = require('../model/UserModel');


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    console.log("serializeUser");
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    var user = new UserModel();
    user.load(id, function (err, user) {
        console.log(user);
        user.id = id;
        done(err, user);
    });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function (username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            userAction.signIn(username, password, function (err, user) {
                if (err) {
                    console.log(err);
                    done(null, false, { message: err });
                } else {
                    console.log(user);
                    done(null, user, {message: 'all right'});
                }
            });

//            findByUsername(username, function(err, user) {
//                    if (err) { return done(err); }
//                    if (!user) {
//                        console.log('Unknown user ' + username);
//                        return done(null, false, { message: 'Unknown user ' + username }); }
//                    if (user.password !== password) {
//                        console.log('Invalid password');
//                        return done(null, false, { message: 'Invalid password' }); }
//                    return done(null, user, {message: 'all right'});
//            });
        });
    }
));
exports.passportInit = function (app) {
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    // app.use(flash());
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
};
exports.passport = passport;