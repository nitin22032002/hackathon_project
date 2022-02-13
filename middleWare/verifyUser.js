const db=require("../models/connection")

function verifyUser(req,res,next){
    try{
        let emailid=req.query.emailid
        let user=req.query.user
        db.get(`select userid from ${user} where emailid='${emailid}'`,(err,result)=>{
            if(err){
                console.log(err)
                throw Error(err)
            }
            else if(! result){
                return res.status(401).json({status:false,msg:"Invalid Emailid...."})
            }
            else{
                next()
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error....."})
    }
}

module.exports=verifyUser;