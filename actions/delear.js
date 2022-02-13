const express=require("express")
const router=express.Router()
const db=require("../models/connection")
const verifyToken=require("../middleWare/verifyToken")

router.get("/getdetails",verifyToken,(req,res)=>{
    try{
        let userid=req.user.userid
        let username=req.user.username
        db.get(`select * from ${username} where userid=${userid}`,(err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                result.password="******"
                return res.status(200).json({status:true,data:result})
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error...."});
    }
})

router.get("/alldriver",verifyToken,(req,res)=>{
    try{
        let userid=req.user.userid
        db.all(`select userid,name,age,emailid,contactnumber,vechilenumber,model,transportername,experience,capacity from driver where userid in (select userid from routes where city in (select city from delear where userid=${userid}))`,(err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                return res.status(200).json({status:true,data:result})
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error...."});
    } 
})

router.get("/driver/route",verifyToken,(req,res)=>{
    try{
        let statefrom=req.query.statefrom
        let cityfrom=req.query.cityfrom
        let stateto=req.query.stateto
        let cityto=req.query.cityto
        db.all(`select distinct userid,name,age,emailid,contactnumber,vechilenumber,model,transportername,experience,capacity from driver where userid in (select userid from routes where (city='${cityto}' and state='${stateto}') or (city='${cityfrom}' and state='${statefrom}'))`,(err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                return res.status(200).json({status:true,data:result})
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error...."});
    } 
})

router.post("/book/driver",verifyToken,(req,res)=>{
    try{
        let statefrom=req.body.statefrom
        let cityfrom=req.body.cityfrom
        let stateto=req.body.stateto
        let cityto=req.body.cityto
        let driverid=req.body.driverid
        let userid=req.user.userid
        db.run("insert into booking (driverid,delearid,cityfrom,statefrom,cityto,stateto) values(?,?,?,?,?,?)",[driverid,userid,cityfrom,statefrom,cityto,stateto],(err,result)=>{
            if(err){
                console.log(err)
                throw Error(err)
            }
            else{
                return res.status(200).json({status:true})
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error...."});
    }  
})

router.get("/show/book",verifyToken,(req,res)=>{
    try{
        let userid=req.user.userid
        db.all(`select b.*,d.* from booking b, driver d where d.userid=b.driverid and b.delearid=${userid}`,(err,result)=>{
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
        return res.status(500).json({status:false,msg:"Server Error...."});
    }  
})

router.delete("/delete/book/:id",verifyToken,(req,res)=>{
    try{
        let id=req.params.id
        let userid=req.user.userid
        db.run("delete from booking where bookingid=? and (driverid=? or delearid=?)",[id,userid,userid],(err,result)=>{
            if(err){
                console.log(err)
                throw Error(err)
            }
            else{
                return res.status(200).json({status:true})
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error...."});
    }
})

module.exports=router;