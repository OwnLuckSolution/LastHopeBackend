const { User, Wallet, Transaction } = require("../models/User");
const jwt = require("jsonwebtoken");


const transactionController = {
  
  async deposit(req, res) {
    try {
      const token = req.headers.authorization;
      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const user = await User.findOne({ email: userEmail }).populate("wallet");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { amount } = req.body;
  
      const newTransaction = new Transaction({
        amount: amount,
        description: "Deposit",
        email: user.email,
        username: user.name,
        isVerified: true,
        type: "Transaction",
        status: "Approved",
        paymentMehtod: "Cash idk"
      });
      newTransaction.save();
  
      user.wallet.balance += parseInt(amount);
      user.wallet.transactions.push(newTransaction);
      await user.save();
  
      res.status(200).json({ message: "Deposit request initiated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error initiating deposit" });
    }
  },
  
  async withdraw(req, res) {
    try {
      const token = req.headers.authorization;
      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const user = await User.findOne({ email: userEmail }).populate("wallet");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { amount } = req.body;
  
      if (user.wallet.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
  
      const newTransaction = new Transaction({
        amount: amount,
        description: "Withdrawal",
        email: user.email,
        username: user.name,
        isVerified : false,
        type: "Transaction",
        status: "Unverified",
        paymentMehtod: "Cash idk"
      });
      newTransaction.save();
  
      user.wallet.balance -= parseInt(amount);
      user.wallet.transactions.push(newTransaction);
      await user.save();
  
      res.status(200).json({ message: "Withdrawal request initiated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error initiating withdrawal" });
    }
  },
  //could be restructured for products approval
  async getAllTransactions(req,res){
    console.log("getting transactions");
    const transactions = await Transaction.find();
    res.json(transactions);
  },
  //could be restructured for products approval
  async approveTransactions(req,res){
    const transactionId = req.params.id;
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      transaction.isVerfied = true;
      await transaction.save();

      return res.status(200).json({ message: "Transaction approved successfully" });
  },
  async getUserTransactions(req, res) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ error: "Token not provided" });
      }
  
      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const user = await User.findOne({ email: userEmail });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const userTransactions = await Transaction.find({ email: user.email });
  
      return res.status(200).json(userTransactions);
    } catch (error) {
      console.error("Error occurred:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
  ,
};

module.exports = transactionController;
