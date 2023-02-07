const express=require("express");
const { register } = require("../controller/user");
const { activateAccount } = require("../controller/user");
const { login } = require("../controller/user");

const router=express.Router();

router.post('/register',register)
router.post('/activate',activateAccount)
router.post('/login',login)

module.exports=router;