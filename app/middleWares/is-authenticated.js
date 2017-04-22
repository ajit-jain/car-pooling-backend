// const jwt = require('jsonwebtoken');
// module.exports=function(req,res,next){
//     let token = req.headers['x-access-token'] || req.query.token || req.body.token;
//     jwt.verify(token,'iloveprogramming',
//     (err,parsedToken)=>{
//         console.log("Parsed Token:",parsedToken);
//         res.end("djfjf");
//     })

// }
const passport  = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const jwtConfig =require('../../config/jwt');
let auth = require('../helpers/authOperations');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
let jwtOptions = {
    jwtFromRequest:ExtractJWT.fromAuthHeader(),
    jwtSecret: jwtConfig.jwtSecret
}

const strategy = new JWTStrategy(jwtOptions,(payload,next)=>{
    console.log("Received data",payload);
    auth.findUserById(payload.id);
})