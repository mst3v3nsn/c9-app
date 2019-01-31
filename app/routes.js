sync = require('sync');
var path = require('path'), fs = require('fs');
var killCont = require('./killContainer.js').stopCont;
var dockerexec = require('./dockerController.js').dockerexec;
var running = require('./checkPod.js').check;

module.exports = function (app, passport, server) {
    function loggedIn(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    app.get('/', function (request, response) {
        response.redirect('/login');
    });

    app.get('/cloud9', loggedIn, function (request, response) {
        response.render('../views/user.html', {
            user: request.user
        });
    });

    app.get('/loading', loggedIn, function (request, response) {
        dockerexec(request);
        response.redirect('/checkingContainer');
    });

    app.get('/pleaseWait', loggedIn, function (request, response) {
        response.render('pleasewait.html', {
            user: request.user
        });
    });

    app.get('/contentCreating', loggedIn, function (request, response) {
            response.redirect('/checkingContainer');
        });


    app.get('/checkingContainer', loggedIn, function(request, response){
        running(request).then(function(result) {
            console.log(result)
            if ( result === true ) {
                response.redirect('/pleaseWait');
            }
            else {
                response.render('checking.html');
            }
        });
    });

    app.get('/logout', loggedIn, function (request, response) {
        console.log("user " + request.user.user.username + " logged out!")
        killCont(request);
        request.logout();
        response.redirect('/');
    });

    app.get('/login', function (request, response) {
        response.render('login.html', {message: request.flash('error')});
    });

    app.post('/login', passport.authenticate('ldapauth', {
        successRedirect: '/loading',
        failureRedirect: '/',
        failureFlash: true
    }));

// support for extra authentication methods

// GET /auth/facebook
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Facebook authentication will involve
// redirecting the user to facebook.com. After authorization, Facebook will
// redirect the user back to this application at /auth/facebook/callback
    app.get('/auth/facebook',
        passport.authenticate('facebook', {scope: 'email'}));

// GET /auth/facebook/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/about',
            failureRedirect: '/login'
        }));


// GET /auth/twitter
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Twitter authentication will involve redirecting
// the user to twitter.com. After authorization, the Twitter will redirect
// the user back to this application at /auth/twitter/callback
    app.get('/auth/twitter',
        passport.authenticate('twitter'));

// GET /auth/twitter/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/about',
            failureRedirect: '/login'
        }));


// GET /auth/google
// Use passport.authenticate() as route middleware to authenticate the
// request. The first step in Google authentication will involve
// redirecting the user to google.com. After authorization, Google
// will redirect the user back to this application at /auth/google/callback
    app.get('/auth/google',
        passport.authenticate('google', {scope: ['profile', 'email']}));

// GET /auth/google/callback
// Use passport.authenticate() as route middleware to authenticate the
// request. If authentication fails, the user will be redirected back to the
// login page. Otherwise, the primary route function function will be called,
// which, in this example, will redirect the user to the home page.
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/about',
            failureRedirect: '/login'
        }));


    var io = require('socket.io').listen(server);

    var usernames = {};

    io.sockets.on('connection', function (socket) {

        socket.on('adduser', function (username) {
            socket.username = username;
            usernames[username] = username;
            io.sockets.emit('updateusers', usernames);
        });

        socket.on('disconnect', function () {
            delete usernames[socket.username];
            io.sockets.emit('updateusers', usernames);
            socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        });
    });

};

function auth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}
