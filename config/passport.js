var User=require("../app/models/user.js");
var Promise = require('bluebird');
var auth = require("../app/helpers/authOperations");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');
var configAuth = require("./auth.js");
var TwitterStrategy= require('passport-twitter').Strategy;
module.exports=function(passport){
   passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    })
     passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            Promise.coroutine(function*(){
                var user = yield auth.findUser(email);
                if(user){
                    return ({err:null,user:false,msg:"Email already Exists"});
                }
                else{
                    var user=yield auth.saveUser({
                        email:email,
                        password:password,
                        mobile:req.body.mobile,
                        username:req.body.username
                    });
                    return ({err:null,user:user,msg:"successful signup"});

                }
            }).apply(this).then((obj)=>{
                return done(obj.err,obj.user,obj.msg);
            }).catch((err)=>{
                console.log("Error in Passport.js",err);
                done(err);
            })

        });

    }));
    passport.use('local-login',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },function(req, email, password, done) { // callback with email and password from our form

        process.nextTick(function(){
            console.log("Enetred in login");
            Promise.coroutine(function*(){
                var user = yield auth.findUser(email);
                console.log("finded user",user);
                if (!user)
                    return {err:null, user:false, msg:'No user found.'};
                 if(!(user.validPassword(password)))
                     return {err:null, user:false, msg:'Oops! Wrong password.'} // create the loginMessage and save it to session as flashdata
                console.log("dhdhd");
                return {err:null, user:user, msg:"Successfull Login"};
            }).apply(this)
            .then((obj)=>{
                return done(obj.err,obj.user,obj.msg);
            })
            .catch((err)=>{
               return done(err);
            })
        })

    }));

    passport.use(new FacebookStrategy({
        clientID : configAuth.facebookAuth.clientID,
        clientSecret : configAuth.facebookAuth.clientSecret,
        callbackURL  : configAuth.facebookAuth.callbackURL,
        profileFields: configAuth.facebookAuth.profileFields
    },function(token, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'facebook.id':profile.id},function(err, user) {
                
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();
                    console.log(profile);
                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.email  = profile.displayName ;// look at the passport user profile to see how names are returned
                   // newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            })
        })

    }));
    passport.use(new TwitterStrategy(
        configAuth.twitterAuth,
    function(token, tokenSecret, profile, done){
            process.nextTick(function(){
                    console.log(profile);
                    User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err){
                        console.log("Errror:",err);
                        return done(err);
                    }
                        

                    // if the user is found then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser = new User();
                        
                        // set all of the user data that we need
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        // save our user into the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            })            
    }))

}