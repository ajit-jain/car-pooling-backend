var User=require("../models/user.js");
var jwt = require('jsonwebtoken');
module.exports={
    findUser:function(email){
       return User.findOne({ 'local.email' :  email },{_id:0,__v:0}) 
    },
    saveUser:function(obj){
        var newUser=new User();
        newUser.local.email = obj.email;
        newUser.local.username = obj.username;
        newUser.local.mobile=obj.mobile;
        newUser.local.password = newUser.generateHash(obj.password);
        newUser.local.token = jwt.sign({id:obj.email},"iloveprogramming");
        newUser.local.active = false;
        return newUser.save();
    },
    updateOtpOfUser(obj){
        console.log(obj);
        return User.findOneAndUpdate({'local.email':obj.email},{$set:{'local.otp':obj.otp}},
        {new:true,projection:{"local.token":1,_id:0}});
    },
    updateStatus(obj){
        return User.findOneAndUpdate({'local.email':obj.email},{$set:{'local.active':true}},
        {new:true,projection:{"_id":0,"__v":0}});
    },
    genNewTokenAndUpdateUser(user){
        return User.findOneAndUpdate({'local.email':user.local.email},
            {$set:{'local.token':jwt.sign({id:user.local.email},"iloveprogramming")}},
            {new:true,projection:{"_id":0,"__v":0}});
    }
        
}