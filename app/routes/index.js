
module.exports= function(app,passport){
    app.use('/',require('./routes-v1')(passport));

    app.use((err,req,res,next)=>{
        console.log(err);
        res.status(500).json("Not found");
    })     
}