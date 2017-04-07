var express = require("express");
var app = express();
require('dotenv').config();
var mongoose = require("mongoose");
mongoose.Promise=require('bluebird');
var passport = require("passport");
var flash = require("connect-flash");
var cookieParser=require("cookie-parser");
var bodyParser=require("body-parser");
var morgan = require("morgan");
var session = require("express-session");

var configDB=require("./config/database.js");
console.log(configDB.url);
mongoose.connect(configDB.url, (conn)=>{
  // console.log('connection', conn)
}); 
// mongoose.connection.on('connected',(con)=>{
//   console.log(' close',con);
// });
mongoose.connection.once('open', function() {
  // Wait for the database connection to establish, then start the app.      
  console.log("Connected to database")     
                
});

mongoose.connection.on('error',(err)=>{
  console.log('error',err);
});
// connect to our database
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
// app.use(passport.session());
// app.use(flash());
require("./config/passport.js")(passport);
require('./app/routes.js')(app,passport);

app.listen(process.env.port,"localhost",()=>{
    console.log("Server running on port:",process.env.port);
})