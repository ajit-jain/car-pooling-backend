
const authController = require("../controllers/authController"); 
var router=require('express').Router();
var isAuthenticated = require('../middleWares/is-authenticated');
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
    router.post('/details',isAuthenticated,authController.saveDetails);
    router.get('/getUser',isAuthenticated,authController.getUser);
    return router;
}