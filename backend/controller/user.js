const { validateEmail, validateLength, validateUsername } = require('../helpers/Validations');
const User=require('../models/User')
const bcrypt=require('bcrypt');
const { genegateToken } = require('../helpers/token');
const { sendVerificationEmail } = require('../helpers/mailer');
const jwt =require('jsonwebtoken');
const { findOne } = require('../models/User');
exports.register= async (req,res)=>{
try {
    const{
        first_name,
        last_name,
        email,
        username,
        password,
        bYear,
        bMonth,
        bDay,
        gender
      }=req.body

    if(!validateEmail(email)){
    return res.status(400).json({
        message:'Invalid email address'
    })
    }
    const check =await User.findOne({email})
    if(check){
        return res.status(400).json({
            message:"The email address already exists, try a different email address"
        })
    }
    
    if(!validateLength(first_name,3,30)){
        return res.status(400).json({
            message:"first_name must between 3 and 30 characters."
        })
    }
    if(!validateLength(last_name,3,30)){
        return res.status(400).json({
            message:"last_name must between 3 and 30 characters."
        })
    }
    if(!validateLength(password,6,40)){
        return res.status(400).json({
            message:"password must be atleast 6 characters."
        })
    }
    const cryptedPassword=await bcrypt.hash(password,12);
    let tempUsername=first_name+last_name;
    let newUsername=await validateUsername(tempUsername)
    const user=await new User({
        first_name,
        last_name,
        email,
        username:newUsername,
        password:cryptedPassword,
        bYear,
        bMonth,
        bDay,
        gender
    }).save();
    const emailVerificationToken=genegateToken({id:user._id.toString()},'30m')
    const url=`${process.env.BASE_URL}/activate/${emailVerificationToken}`
    sendVerificationEmail(user.email,user.first_name,url)
    const token=genegateToken({id:user._id.toString()},'7d')
    res.send({
        id:user._id,
        username:user.username,
        picture:user.picture,
        first_name:user.first_name,
        last_name:user.last_name,
        token:token,
        verified:user.verified,
        message:'Register success ! please activate your email to start'
    })
        
    
    
} catch (error) {
    res.status(500).json({message:error.message})
}

}

exports.activateAccount=async (req,res)=>{
    const {token}=req.body
    const user=jwt.verify(token,process.env.TOKEN_SECRET)
    const check=await User.findById(user.id)
    if(check.verified==true){
     return  res.status(400).json({message:'this email is already activated'})
    }else{
        await User.findByIdAndUpdate(user.id,{verified:true})
        return res.status(200).json('Account  has been activated successfully')
    }

}
exports.login=async(req,res)=>{
try {
const {email,password}=req.body;
const user=await User.findOne({email})
    if(!user){
        return res.status(400).json('the email address is not connected an account')
    }
    const check=await bcrypt.compare(password,user.password);
    if(!check){
        return res.status(400).json({message:"invalid  credentials. Please try again."})
    }
    const token=genegateToken({id:user._id.toString()},'7d')
    res.send({
        id:user._id,
        username:user.username,
        picture:user.picture,
        first_name:user.first_name,
        last_name:user.last_name,
        token:token,
        verified:user.verified,
        message:'Login success ! LGTM'
    })
} catch (error) {
    return res.status(500).json({message:error.message})
}
}