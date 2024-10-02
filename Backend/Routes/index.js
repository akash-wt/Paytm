const express=require("express");
const router =express.Router();
const userRouter = require("./user");
const balanceRouter =require("./account")

router.use('/user', userRouter);
router.use('/account', balanceRouter);



router.get('/', (req, res) => {
    res.send('Get all users');
});


module.exports = router; 