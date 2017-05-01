const jwtConfig =require('./jwt');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const auth = require('../app/helpers/authOperations');
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeader();
jwtOptions.secretOrKey = jwtConfig.jwtSecret;

const strategy = new JWTStrategy(jwtOptions,(payload,next)=>{
    console.log("Received data",payload);
    user = auth.findUser(payload.id);
    user.then((data)=>next(null,data,"User find")).catch(err=>next(err,null,err.message))

})
module.exports=function(passport){
    passport.use(strategy);    
}