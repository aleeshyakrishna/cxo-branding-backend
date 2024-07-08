var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')

const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const googleAuthRouter = require('./routes/googleAuth')
var multer = require('multer')
const fileUpload = require("express-fileupload");

// const session = require("express-session");
// const passport = require("passport");
// const OAuth2Strategy = require("passport-google-oauth2").Strategy;
// const {googleLogin} = require("./model/userModel")
// const clientid =
//   "605780761256-f5r78mdnrt7hfgnre9o0mgnocscn4no7.apps.googleusercontent.com";
// const clientsecret = "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";

var app = express();
// app.use(cors());

app.use(
  cors({
    origin: ["http://localhost:3000","https://cxo-branding-jet.vercel.app"], // Allow requests from this origin
    methods: ["GET", "POST"], // Allow only GET and POST requests
    allowedHeaders: ["Content-Type", "Authorization"], // Allow only specific headers
    credentials: true, // Allow credentials to be sent with the request
  })
);
 
// databse connection
const db = require("./config/connection");
const { access } = require('fs');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.options("*", cors());


app.use("/", usersRouter);
app.use('/admin', adminRouter);
app.use('/auth/google', googleAuthRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
