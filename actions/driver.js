const express=require("express")
const router=express.Router()
const db=require("../models/connection")
const verifyToken=require("../middleWare/verifyToken")

router.get("/show/book",verifyToken,(req,res)=>{
    try{ 
        let userid=req.user.userid
        db.all(`select d.*,b.* from delear d,booking b  where d.userid=b.delearid and b.driverid=${userid}`,(err,result)=>{
            if(err){
                console.log(err)
                throw Error(err)
            }
            else{
                return res.status(200).json({status:true,data:result})
            }
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({status:false,msg:"Server Error...."});
    }  
})

module.exports=router;