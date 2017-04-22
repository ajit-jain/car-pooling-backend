let mongoose = require("mongoose");
let bycrypt = require("bcrypt-nodejs");
let Schema = mongoose.Schema;
let userSchema= Schema({
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
    },
    details:{type:Schema.Types.ObjectId,ref:'Userdetail'}
});
let CompanySchema = Schema({
    company_name:String,
    designation : String,
    address : String
});
let BusinessSchema = Schema({
    business_name:String,
    tel : String,
    address : String
});
let CompanyDetail =mongoose.model('CompanyDetail',CompanySchema);
let BusinessDetail =  mongoose.model('BusinessDetail',BusinessSchema);
let Userdetail = Schema({
    user:{type:Schema.Types.ObjectId,ref:'user'},
    gender : {
            type:String,
            enum:['Male','Female','Trans'],
            default:'Male'    
        },
    user_type:{
            type:String,
            enum:['pooler','seeker','both'],
            default:'pooler'    
        },
    address:{type:String},
    CompanyDetails: {type:Object,ref:'CompanyDetail'},
    BusinessDetails : {type:Object,ref:'BusinessDetail'}

    
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
module.exports={
    User : mongoose.model('user',userSchema),
    UserDetails : mongoose.model('Userdetail',Userdetail),
    CompanyDetails:CompanyDetail,
    BusinessDetails:BusinessDetail
};