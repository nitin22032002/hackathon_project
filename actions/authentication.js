//module import
const express=require("express")
const router=express.Router()
const db=require("../models/connection")
const bycrypt=require("bcryptjs")
const validateDelearData=require("../middleWare/validateDelearData")
const validateDriverData=require("../middleWare/validateDriverData")
const verifyOtp=require("../middleWare/verifyOtp")
const verifyUser=require("../middleWare/verifyUser")
const general=require("../middleWare/general")
//******************* */

router.post("/add/driver",validateDriverData,(req,res,next)=>{
    try{
        //extract data from url
        let {name,age,emailid,contact,vechilenumber,model,capacity,transportername,experience,password}=req.body
        let datetime=new Date().toDateString()
        let salt=bycrypt.genSaltSync();
        password=bycrypt.hashSync(password,salt);
        db.run("insert into driver (name,age,emailid,contactnumber,vechilenumber,model,transportername,experience,capacity,password,datetime) values(?,?,?,?,?,?,?,?,?,?,?)",[name,age,emailid,contact,vechilenumber,model,transportername,experience,capacity,password,datetime],function(err,result){
            if(err){
                console.log(err)
                return res.status(500).json({status:false,msg:"Server Error...."})
            }
            else{
                addRoutes(req.body.routes,this.lastID)
                let token=general.generateToken({id:this.lastID,user:"driver"})
                return res.status(200).json({status:true,token:token})
            }
        })
    }
    catch(e){
        console.log(e)
        return res.status(500).json({status:false,msg:"Server Error...."})
    }
})

router.post("/add/delear",validateDelearData,(req,res,next)=>{
    try{
        //extract data from url
        let {name,emailid,contact,materialtype,weight,quantity,city,state,password}=req.body
        let salt=bycrypt.genSaltSync();
        let datetime=new Date().toDateString()
        password=bycrypt.hashSync(password,salt);
        db.run("insert into delear (name,emailid,contactnumber,weight,password,quantity,datetime,materialtype,state,city) values(?,?,?,?,?,?,?,?,?,?)",[name,emailid,contact,weight,password,quantity,datetime,materialtype,state,city],function(err,result){
            if(err){
                console.log(err)
                return res.status(500).json({status:false,msg:"Server Error...."})
            }
            else{
                let token=general.generateToken({id:this.lastID,user:"delear"})
                return res.status(200).json({status:true,token:token})
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error...."})
    }
})

router.post("/verifydelear/username",(req,res)=>{
    try{
        let {username,password}=req.body
        db.get("select userid,password from delear where emailid=?",[username],(err,result)=>{
        
            if(err){
                console.log(err)
                throw Error(err);
            }
            else if(!result){
                return res.status(401).json({status:false,msg:"Invalid Userid or Password"})
            }
            else{
                if(bycrypt.compare(password,result.password)){
                    let token=general.generateToken({id:result.userid,user:"delear"})
                    return res.status(200).json({status:true,token})
                }
                else{
                    return res.status(401).json({status:false,msg:"Invalid Userid or Password"})
                }
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error....."})
    }
})

router.post("/verifydriver/username",(req,res)=>{
    try{
        let {username,password}=req.body
        db.get("select userid,password from driver where emailid=?",[username],(err,result)=>{
            if(err){
                console.log(err)
                throw Error(err);
            }
            else if(!result){
                return res.status(401).json({status:false,msg:"Invalid Userid or Password"})
            }
            else{
                if(bycrypt.compare(password,result.password)){
                    let token=general.generateToken({id:result.userid,user:"driver"})
                    return res.status(200).json({status:true,token})
                }
                else{
                    return res.status(401).json({status:false,msg:"Invalid Userid or Password"})
                }
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error....."})
    }
})

router.post("/verifydelear/otp",verifyOtp,(req,res)=>{
    try{
        let username=req.user.username
        db.get("select userid from delear where emailid=?",[username],(err,result)=>{
            if(err){
                console.log(err)
                throw Error(err);
            }
            else{
                    let token=general.generateToken({id:result.userid,user:"delear"})
                    return res.status(200).json({status:true,token})
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error....."})
    }
})

router.post("/verifydelear/otp",verifyOtp,(req,res)=>{
    try{
        let username=req.user.username
        db.get("select userid from driver where emailid=?",[username],(err,result)=>{
            if(err){
                console.log(err)
                throw Error(err);
            }
            else{
                    let token=general.generateToken({id:result.userid,user:"driver"})
                    return res.status(200).json({status:true,token})
            }
        })
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error....."})
    }
})

router.get("/sendotp",verifyUser,(req,res)=>{
    try{
          let emailid=req.query.emailid
          let otp=999+parseInt(Math.random()*10);
          let status=general.sendOtp(otp,emailid);
          if(status){
              let token=general.generateToken({otp,emailid});
              return res.status(200).json({status,token})
          }
          else{
              return res.status(500).json({status,msg:"Server Error....."})
          }
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error....."})
    }
})

function addRoutes(routes,userid){
    let state=routes.state
    let city=routes.city
    for(let i=0;i<state.length;i++){
        if(state[i] && city[i]){
            db.run("insert into routes (userid,state,city) values(?,?,?)",[userid,state[i],city[i]],(err,result)=>{
                if(err){
                    console.log(err)
                }
            })
        }
    }
}



module.exports=router;