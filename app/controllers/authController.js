const otpSender=require('../helpers/nexmoProvider');
const PromiseLib = require('bluebird');
const auth = require('../helpers/authOperations');
const passport = require('passport');
module.exports ={
    signupController:function(req,res,next){
        passport.authenticate('local-signup',(err,user,info)=>{
            console.log("After passport", err , user , info);
            if(err)
                res.status(500).json({success:false,message:info});
            else if(!user){
                res.status(200).json({success:false,message:info});
            }
            else{
                // controller
                console.log("User inserted")
                PromiseLib.coroutine(function*(){
                    var otpResult=yield otpSender(req.body.mobile);
                    console.log(otpResult);
                    var  result= yield auth.updateOtpOfUser({email:user.local.email,otp:otpResult.otp});
                    console.log(result);
                    return ({success:true,message:info});
                }).apply(this).then((obj)=>{
                    res.status(200).json(obj);
                }).catch((err)=>{
                    console.log("Error ...",err);
                    res.status(500).json({success:false,message:err.message});
                });
            }
        })(req,res,next);
    },
    verifyUser:function(req,res,next){
        console.log("In verify");
        console.log(req.body.otp);
        if(!req.body.email && !req.body.otp){
            res.status(401).json({success:false,data:null,message:"UnAuthorized Access"});
        }
        PromiseLib.coroutine(function*(){
            var user = yield auth.findUser(req.body.email);
            console.log(user);
            if(user.local.otp == req.body.otp){
                var result= yield auth.updateStatus({email:user.local.email});
                console.log(result);
                return ({token:result.local.token,message:"Successful SignIn"});
            }
            else
                return ({token:null,message:"Wrong Otp"}); 
        }).apply(this).then((obj)=>{
                res.status(200).json(obj);
        }).catch((err)=>{
                res.status(200).json({success:false,message:err.message});
        });
        
    },
    loginController:function(req,res,next){

            
        passport.authenticate('local-login',(err,user,info)=>{
            console.log('After passport',err,user,info);
          //  console.log("User:",user.local.active);
            if(err)
                res.status(500).json({success:false,data:null,"message":info});
            if(!user){
                res.status(200).json({success:false,data:null,"message":info});
            }
            else if(!(user.local.active)){
                PromiseLib.coroutine(function*(){
                    var otpResult=yield otpSender(user.local.mobile);
                    console.log(otpResult);
                    var  result= yield auth.updateOtpOfUser({email:user.local.email,otp:otpResult.otp});
                    return ({success:true,data:{token:null,active:false},message:"verify Number"});
                }).apply(this).then((obj)=>{
                    res.status(200).json(obj);
                }).catch((err)=>{
                    console.log("Error ...",err);
                    res.status(500).json({success:false,data:null,message:err.message});
                });
            }
            else{
                console.log("In Successful Login");
                PromiseLib.coroutine(function*(){
                    console.log("User Before Updation ",user.local.token);
                    var updateduser = yield auth.genNewTokenAndUpdateUser(user);
                    console.log("User After Updation ",updateduser.local.token);
                    return updateduser;
                }).apply(this).then((user)=>{
                   // res.redirect('/profile');
                    res.status(200).json({success:true,data:{token:user.local.token,active:true},message:info});
                })
                
            }
            
            
        })(req,res,next);
    },
}