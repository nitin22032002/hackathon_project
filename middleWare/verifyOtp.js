const jwt=require("jsonwebtoken")
const keys=require("./keys")

function verifyOtp(req,res,next){
    try{
        let token=JSON.parse(req.headers.token);
        let data=jwt.verify(token,keys.secret_key)
        if(data){
            let otp=req.body.otp
            if(otp==data.otp){
                req["user"]={"username":data.emailid}
                next()
            }
            else{

                return res.status(401).json({status:false,msg:"Invalid Otp"})
            }
        }
        else{
            return res.status(401).json({status:false,msg:"Invalid Otp...."})
        }
    }
    catch(e){
        return res.status(500).json({status:false,msg:"Server Error....."})
    }
}

module.exports=verifyOtp;