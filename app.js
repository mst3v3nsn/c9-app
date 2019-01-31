var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('dotenv').config();

var port = process.env.APP_PORT;

var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');
var session = require('express-session');
fs = require('fs');

var http = require('http');
var server = http.createServer(app);

var mongoose = require('mongoose');
var MongoDBStore = require('connect-mongo')(session);
mongoose.Promise = global.Promise;
var configDB     = require('./config/database.js');

var opts = { replicaSet: process.env.REPLICA, ha: true, useNewUrlParser: true };

mongoose.connect(configDB.url, opts);
var monConn = new MongoDBStore({
    mongooseConnection: mongoose.connection,
    collection: 'session'
});

require('./config/passport')(passport);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('status', __dirname + '/status');
app.engine('html', require('ejs').renderFile);
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: {maxAge: 1000 * 60 * 60},
    store: monConn
}));

app.use(bodyParser.urlencoded({
    uploadDir: '/images',
    extended: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport, server);

server.listen(port);

console.log('\nCloud9 Server Starting up...');
console.log('Listening  to  port ' + port);
