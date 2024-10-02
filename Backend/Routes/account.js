require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const User = require("../Models/user");
const Account = require("../Models/Balence");
const authMiddleware = require("../authorization");
const z = require("zod");
const mongoose = require("mongoose");
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });
    return res.status(200).json({
      balance: account.balance,
    });
  } catch (e) {
    return res.status(500).json({
      message: "balance fetching error",
      error: e,
    });
  }
});

// transfer amount

const transferSchema = z.object({
  to: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  amount: z
    .union([z.number(), z.string()])
    .transform((val) => {
      return typeof val === "string" ? parseFloat(val) : val;
    })
    .refine((val) => !isNaN(val) && val >= 1, {
      message: "Amount must be a number greater than or equal to 1.",
    }),
});

router.put("/transfer", authMiddleware, async (req, res) => {
  const { success, data, error } = transferSchema.safeParse(req.body);
  if (!success) {
    console.log("Validation errors:", error);
    return res
      .status(400)
      .json({ message: "input validation error", error: error.errors });
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const fromUser = await Account.findOne({ userId: req.userId }).session(
      session
    );
    const toUser = await Account.findOne({ userId: data.to }).session(session);

    if (!fromUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Sender not found." });
    }
    if (!toUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Receiver not found." });
    }

    if (fromUser.balance < data.amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // Perform the transfer

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -data.amount } },
      { session }
    ),
      await Account.updateOne(
        { userId: data.to },
        { $inc: { balance: data.amount } },
        { session }
      );

    await session.commitTransaction();
    return res.status(200).json({ message: "Transfer successful", data });
  } catch (e) {
    console.error("Error processing transfer:", e);
    await session.abortTransaction();
    return res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  } finally {
    session.endSession();
  }
});

router.post("/transfer", (req, res) => {});

module.exports = router;
