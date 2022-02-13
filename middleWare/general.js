const jwt=require("jsonwebtoken")
const keys=require("./keys")
const email=require('nodemailer')
const EMAIL_ID=keys.emailid
const PASSWORD=keys.password
const connection=email.createTransport({
    service:'gmail',
    auth:{
        user:EMAIL_ID,
        pass:PASSWORD
    }
})
const mailOptions=(emailid,subject,body)=>{
    return({
        from:EMAIL_ID,
        to:emailid,
        subject:subject,
        html:`<h3>${body}</h3>`
    })
}

function generateToken(data){
    let token=jwt.sign(data,keys.secret_key);
    return token;
}

function sendOtp(otp,emailid){
    let body=`Your Otp For Verification In Transport Services ${otp}`
    let subject="Otp For Verification"
    connection.sendMail(mailOptions(emailid,subject,body),(error,info)=>{
        if(error){
            console.log(error)
            return false
        }
        else{
            return true
        }
    })
}

module.exports={generateToken,sendOtp};