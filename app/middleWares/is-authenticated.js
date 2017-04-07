const jwt = require('jsonwebtoken');
module.exports=function(req,res,next){
    let token = req.headers['x-access-token'] || req.query.token || req.body.token;
    jwt.verify(token,'iloveprogramming',
    (err,parsedToken)=>{
        console.log("Parsed Token:",parsedToken);
        res.end("djfjf");
    })

}