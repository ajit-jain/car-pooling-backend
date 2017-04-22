
const authController = require("../controllers/authController"); 
var router=require('express').Router();
var isAuthenticated = require('../middleWares/is-authenticated.js');
module.exports=function(passport){
    router.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });
    router.get('/login', function(req, res) {
        res.render('login.ejs', 'loginMessage'); 
    });
    router.get('/signup', function(req, res) {
        res.render('signup.ejs', 'signupMessage');
    });
    router.post('/login',authController.loginController);
    router.post('/signup',authController.signupController);
    router.post('/verify',authController.verifyUser);
    router.post('/details',authController.saveDetails);
    router.get('/profile',isAuthenticated);
    router.post('/getUser',authController.getUser);
    return router;
}