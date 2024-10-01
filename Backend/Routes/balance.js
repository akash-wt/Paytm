require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const Account = require("../Models/Balence");
const authMiddleware=require("../authorization");

router.get('/balance', authMiddleware, async (req, res) => {
   const account= await Account.findOne({
    userId:req.userId
   })

   
   return res.status(200).json({
    balance: account.balance
   })
});

router.post("/transfer",(req,res)=>{
    
})


module.exports = router;