var mongoose = require("mongoose");
var bycrypt = require("bcrypt-nodejs");

var userSchema= mongoose.Schema({
    local:{
        username:String,
        email:String,
        password:String,
        token:String,
        active:Boolean,
        otp: {type:Number,default:0},
        mobile:String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

userSchema.methods.generateHash=function(password){
    return bycrypt.hashSync(password,bycrypt.genSaltSync(8),null);
};
userSchema.methods.validPassword=function(password){
    console.log("In validPassword");
    console.log(password,this.local.password);
    //console.log();
    return bycrypt.compareSync(password,this.local.password);
}
module.exports=mongoose.model('user',userSchema);