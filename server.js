var express = require("express");
var app = express();
var port = process.env.port || 8000;
var mongoose = require("mongoose");
mongoose.Promise=require('bluebird');
var passport = require("passport");
var flash = require("connect-flash");
var cookieParser=require("cookie-parser");
var bodyParser=require("body-parser");
var morgan = require("morgan");
var session = require("express-session");

var configDB=require("./config/database.js");
mongoose.connect(configDB.url); // connect to our database
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('view engine','ejs');

app.use(session({secret:"myfirstAuthImplemnetation"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require("./config/passport.js")(passport);
require('./app/routes.js')(app,passport);

app.listen(port,"localhost",()=>{
    console.log("Server running on port:",port);
})