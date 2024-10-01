const express=require("express");
const router =express.Router();
const userRouter = require("./user");

router.use('/user', userRouter);



router.get('/', (req, res) => {
    res.send('Get all users');
});


module.exports = router; 