const db=require("../models/connection")

function validateDelearData(req,res,next){
    try{
        let emailid=req.body.emailid;
        db.get("select userid from delear where emailid=?",[emailid],(err,result)=>{
            if(err){
                console.log(err);
                throw Error(err)
            }
            else if(! result){
                next()
            }
            else{
                return res.status(400).json({status:false,msg:"Emailid Aleredy Register..."})
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error...."})
    }
}

module.exports=validateDelearData;