const otpSender=require('./helpers/nexmoProvider');
const PromiseLib = require('bluebird');
const auth = require('./helpers/authOperations');
const authController = require("./controllers/authController"); 
module.exports=function(app,passport){
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });


    app.post('/login',authController.loginController);
    app.post('/signup',authController.signupController);
    app.post('/verify',authController.verifyUser);
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email','public_profile']}));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

        // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // =====================================
    // LOGOUT ==============================
    // =====================================

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.use((err,req,res,next)=>{
        console.log(err);
        res.status(500).json("Not found");
    })
}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("In Logged In ");
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
        console.log("logged in");
         return next();
    }
       

    // if they aren't redirect them to the home page
    res.redirect('/');
}