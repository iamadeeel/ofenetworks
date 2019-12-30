const logger = require('morgan');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const passport = require("passport");
const favicon = require('serve-favicon');
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const dbconfig = require('./config/database');
const User = require("./models/user");


// database connection
mongoose.connect(dbconfig.database, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!")
});

// middleware to intercept requests for checking authentication
const middleware = require("./middleware");

// all routes of system
const auth = require('./routes/auth');
const index = require('./routes/index');
const b4m_operations = require('./routes/b4m-operations');
const s4m_operations = require('./routes/s4m-operations');

const api_auth = require('./routes/api-v1/api-auth');
const api_index = require('./routes/api-v1/api-io');
const api_others = require('./routes/api-v1/api-others');

// initialising app
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "this is gonna blow your mind",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to pass the user info to all routes
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//favicon
// app.use(favicon(__dirname + '/public/images/favicon.ico'));

// view engine setup and data parsers
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
//todo check if working
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// actual routing of the system
app.use('/api/auth', api_auth);
app.use('/api/get', passport.authenticate('jwt', {session: false}), api_others);
app.use('/api/io/order', passport.authenticate('jwt', {session: false}), api_index);


app.use('/auth', auth);
app.use('/b4m', middleware.isLoggedIn, b4m_operations);
app.use('/s4m', middleware.isLoggedIn, s4m_operations);
app.use('/', middleware.isLoggedIn, index);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('This page does not exist.');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
