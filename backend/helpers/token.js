const jwt =require('jsonwebtoken')
exports.genegateToken=(payload,expired)=>{
   return jwt.sign(payload,process.env.TOKEN_SECRET,{
    expiresIn:expired
   }) 
}