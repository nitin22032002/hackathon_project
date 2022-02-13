const sqlite=require("sqlite3").verbose()
const db=new sqlite.Database("./transport.db",sqlite.OPEN_READWRITE,(err)=>{
    if(err){
        console.log(err)
    }
    console.log("Connected...")
})

module.exports=db;