const passport = require('passport');
module.exports=function(req,res,next){
    console.log("Entered");
    passport.authenticate('jwt',{session:false},(err,user,info)=>{
        console.log(err,user,info.message);
        if(!!user){
            req.user = user;
            next();
        }
        else  res.status(200).json({success:false,data:null,message:"UnAuthorized Access"});
    })(req,res,next);
}