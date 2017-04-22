let User=require("../models/user.js").User;
let UserDetails = require("../models/user.js").UserDetails;
let companyDetails =require("../models/user.js").CompanyDetails;
let businessDetails = require("../models/user.js").BusinessDetails;
let PromiseLib = require('bluebird');
let jwt = require('jsonwebtoken');
module.exports={
    findUser:function(email){
       return User.findOne({ 'local.email' :  email },{__v:0}) 
    },
    findUserById(_id){
        return User.findOne({'_id':_id},{__v:0});
    },
    saveUser:function(obj){
        let newUser=new User();
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
            {new:true,projection:{"__v":0}});
    },
    updateUser(userId,detailsId){
        return User.findByIdAndUpdate({'_id':userId},
        {$set:{'details':detailsId}},
        {new:true,projection:{"__v":0,_id:0}});
    },
    saveDetails(obj){
        console.log(obj);
        return PromiseLib.coroutine(function*(){
            let data;
            if(obj.optradio)
                data= yield this.saveCompanydetails(obj.companyDetails);
            else data=yield this.saveBusinessdetails(obj.businessDetails);
            console.log("data",data);
            let userdetails = yield this.saveUserDetails(obj,user._id,data._id);
            console.log("details",userdetails);
            let updatedUser = yield this.updateUser(obj._id,userdetails._id);
            console.log("User",updatedUser);
            return userdetails;
        }).apply(this);
        
    },
    saveCompanydetails(obj){
        let company= new companyDetails();
        company['company_name'] = obj.name;
        company.designation = obj.designation;
        company.address = obj.address;
        return company.save();
    },
    saveBusinessdetails(obj){
        let business = new businessDetails();
        business['business_name']=obj.name;
        business.tel = obj.tel;
        business.address = obj.address;
        return business.save();
    },
    saveUserDetails(obj,userid,workid){
        let userdetail = new UserDetails();
        userdetail.user = userid;
        userdetail.gender = obj.personalDetails.gender;
        userdetail['user_type']= obj.personalDetails['user_type'];
        userdetail.address = obj.personalDetails.address;
        (obj.optradio)?userdetail.CompanyDetails = workid :userdetail.BusinessDetails =workid;
        return userdetail.save();
    }
}