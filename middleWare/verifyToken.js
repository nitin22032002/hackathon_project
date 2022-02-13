const jwt=require("jsonwebtoken")
const keys=require("./keys")

function verifyToken(req,res,next){
    try{
        let token=req.headers.token;
        let data=jwt.verify(token,keys.secret_key)
        if(data){
            req['user']={"username":data.user,"userid":data.id}
            next()
        }
        else{
            return res.status(401).json({status:false,msg:"Invalid Auth...."})
        }
    }
    catch(e){
        console.log(e)
        return res.status(500).json({status:false,msg:"Server Error....."})
    }
}

module.exports=verifyToken;