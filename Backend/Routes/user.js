require("dotenv").config();
const express = require("express");
const router = express.Router();
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/user");

const signupSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
});

router.post("/signup", async (req, res) => {
  const { success, data, error } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "invalid inputs",
      error: error.errors,
    });
  }

  try {
    const userExist = await User.findOne({
      username: data.username,
    });

    if (userExist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    console.log(hashedPassword);

    const newUser = new User({ ...data, password: hashedPassword });

    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "21d",
    });
    return res.status(200).json({
      message: "user created successfully",
      token: token,
    });
  } catch (e) {
    res.status(500).json({ message: " enternal sever error", error: e });
  }
});

module.exports = router;
