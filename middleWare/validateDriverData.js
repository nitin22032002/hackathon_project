const db=require("../models/connection")

function validateDriverData(req,res,next){
    try{
        let emailid=req.body.emailid;
        let vechilenumber=req.body.vechilenumber
        db.get("select userid from driver where emailid=? or vechilenumber=?",[emailid,vechilenumber],(err,result)=>{
            if(err){
                console.log(err);
                throw Error(err)
            }
            else if(! result){
                next()
            }
            else{
                return res.status(400).json({status:false,msg:"Emailid or VechileNumber Aleredy Register..."})
            }
        })
    }
    catch(e){
        // console.log(e)
        return res.status(500).json({status:false,msg:"Server Error...."})
    }
}

module.exports=validateDriverData;