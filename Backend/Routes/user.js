require("dotenv").config();
const express = require("express");
const router = express.Router();
const z = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Models/user");
const Account = require("../Models/Balence");
const authMiddleware = require("../authorization");



const signupSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
});

// signup
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
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser = new User({ ...data, password: hashedPassword });

    await newUser.save();

    await Account.create({
      userId: newUser._id,
      balance: 10000,
    });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "21d",
    });

    return res.status(200).json({
      message: "user created successfully",
      token: token,
    });
  } catch (e) {
    res.status(500).json({ message: " Internal sever error", error: e });
  }
});

// signin

const signInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

router.post("/signin", async (req, res) => {
  const { success, data, error } = signInSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "invalid inputs",
      error: error.errors,
    });
  }
  const user = await User.findOne({ username: data.username });
  if (!user) {
    return res.status(404).json({
      message: "user not found ",
    });
  }

  const rightPassword = await bcrypt.compare(data.password, user.password);
  if (!rightPassword) {
    console.log("password ", rightPassword);
    return res.status(401).json({
      message: "wrong password",
    });
  }

  if (rightPassword) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "21d",
    });

    return res.status(200).json({
      message: "signin successfully",
      token: token,
    });
  }

  res.status(409).json({
    message: "Error while logging in",
  });
});

// update
const updateSchema = z.object({
  password: z.string().min(6).optional(),
  lastName: z.string().optional(),
  firstName: z.string().optional(),
});
router.post("/update", authMiddleware, async (req, res) => {
  const { success, data, error } = updateSchema.safeParse(req.body);
  console.log(data);

  if (!success) {
    return res.status(400).json({
      message: "invalid inputs",
      error: error.errors,
    });
  }

  const saltRounds = 10;
  if (data.password) {
    data.password = await bcrypt.hash(data.password, saltRounds);
  }

  const user = await User.findByIdAndUpdate(req.userId, data);
  console.log(user);

  res.json({
    message: "updated successfully",
  });
});


// bulk 


router.get("/bulk", authMiddleware, async (req, res) => {
  const filter= req.query.filter || " ";
  try {
    let users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
            $options: "i",
          },
        },
        {
          lastName: {
            $regex: filter,
            $options: "i",
          },
        },
        {
          username: {
            $regex: filter,
            $options: "i",
          },
        },
      ],
    });

    console.log(users);

    return res.status(200).json({
      users: users.map((user) => ({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      })),
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: " Error while fetching data", error: e });
  }
});

module.exports = router;
