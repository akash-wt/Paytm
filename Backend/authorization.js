require("dotenv").config();
const jwt = require("jsonwebtoken");


const authMiddleware=(req,res,next)=>{
     const authHeader=req.headers.authorization;

     if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({ message: "Unauthorized"})

     }

     const token =authHeader.split(" "[1]);
     try{
         const decode=jwt.verify(token,process.env.JWT_SECRET);

         if(decode.userId){
            req.userId=decode.userId;
         next();
         }
     }
     catch(e){
      console.error("Token verification failed:", e); 
        return res.status(403).json({ message: "Invalid token"})

     }
}

module.exports=authMiddleware;