const { validateEmail, validateLength, validateUsername } = require('../helpers/Validations');
const User=require('../models/User')
const bcrypt=require('bcrypt');
const { genegateToken } = require('../helpers/token');
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
    console.log(emailVerificationToken)
    res.json(user)
        
    
    
} catch (error) {
    res.status(500).json({message:error.message})
}

}