const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/balance", authMiddleware, async (req, res) => {
 try {
  if(!req.userId){
    res.status(411).json({message:"userId is required"});
    return;
  }
  const account = await Account.findOne({ userId: req.userId });

  res.status(200).json({
    balance: account.balance,
  });
 } catch (error) {
  res.status(500).json({message:"Server Error"});
    console.log(error);
 }
});

router.post("/transfer", authMiddleware, async (req, res) => {
 try {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { to, amount } = req.body;

  const senderAccount = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!senderAccount ||  senderAccount.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient Balance",
    });
  }

  const receiverAccount = await Account.findOne({ userId: to }).session(
    session
  );

  if (!receiverAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid Account",
    });
  }

  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  ).session(session);

  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session);
  await session.commitTransaction();
  session.endSession();
  res.status(200).json({
    message: "Transfer Successful",
  });
 } catch (error) {
  res.status(500).json({message:"Server Error"});
    console.log(error);
 }
});

module.exports = router;
