const Nexmo=require('nexmo');
const secrets=require('../../config/nexmo');
const nexmo=new Nexmo({  
    apiKey: secrets.apiKey,
    apiSecret: secrets.apiSecret,
},{debug:true});

       ;
module.exports=function otpSender(to){
    return new Promise((resolve,reject)=>{
         const otp = Math.floor(Math.random() * (9999 - 1000)) + 1000;
        nexmo.message.sendSms(917009104362,to,otp,{type:'unicode'},
        (err,responseData)=>{
            if(err){
                console.log("Error",err);
                reject({otp:null,message:"Internal Server Error"});
            }
            else{
                 console.log("Res",responseData);
                resolve({otp:otp,message:"Message Send"});
            }
            
        })
    })
};