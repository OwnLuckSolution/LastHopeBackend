const { Investment, User,Transaction } = require("../models/User");
const jwt = require("jsonwebtoken");

const investmentController = {
  async addInvestment(req, res) {
    try {
      const token = req.headers.authorization;
      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const user = await User.findOne({ email: userEmail }).populate("wallet");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Creating investment");

      const { type, initialAmount } = req.body;

      const newInvestment = new Investment({
        type,
        initialAmount,
        user: user.email,

      });
      const newTransaction = new Transaction({
        amount: initialAmount,
        description: `Investment  type ${type}, Amount ${initialAmount}`,
        username: user.name,
        email: user.email,
        isVerified: true,
        type:"Investment",
        status: "Approved",
      })
      await newTransaction.save();
      await newInvestment.save();

      if (initialAmount > user.wallet.balance) {
        return res.status(400).send("Not sufficient funds");
      } else {
        user.wallet.balance -= initialAmount;
        user.investments.push(newInvestment);
        await user.save();


        res
          .status(201)
          .json({ message: "Investment added successfully", newInvestment });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send("Internal Server Error");
    }
  },
  async calculateInvestment(req, res) {
    try {
      const token = req.headers.authorization;
      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const user = await User.findOne({ email: userEmail }).populate("wallet");
    
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    
      const investments = await Investment.find({ user: userEmail });
    
      function calculateIncome(investments) {
        return investments.map((investment) => {
          let dailyIncome = 0;
          let monthlyIncome = 0;
          const interestRate =
            investment.type === "A"
              ? 0.07
              : investment.type === "B"
              ? 0.025
              : 0;    
          dailyIncome = (investment.initialAmount * interestRate) / 30; // Assuming a 30-day month
          monthlyIncome = investment.initialAmount * interestRate;
    
          return {
            _id: investment._id,
            type: investment.type,
            initialAmount: investment.initialAmount,
            dailyIncome: dailyIncome.toFixed(2),
            monthlyIncome: monthlyIncome.toFixed(2), 
          };
        });
      }
    
      const allInvestments = calculateIncome(investments);
      res.json({ allInvestments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
    
  },
  async withdrawInvestment(req,res){
    const terminate = req.body.terminate;
    const token = req.headers.authorization;
      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const user = await User.findOne({ email: userEmail }).populate("wallet");
    
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    const investmentId = req.params.id;
    const investment = await Investment({_id:investmentId});
    const createdAtDate = new Date(investment.createdAt);
    const oneMonthLater = new Date(createdAtDate.setMonth(createdAtDate.getMonth() + 1));
    const currentDate = new Date();
    if (currentDate > oneMonthLater) {
      user.balance += investment.monthlyIncome;
      investment.monthlyIncome = 0;
      investment.dailyIncome = 0;
      await investment.save();
      await user.save();
      if(terminate==="yes"){
        user.balance += investment.initialAmount;
        await User.findOneAndUpdate(
          { email: userEmail },
          { $pull: { investments: { _id: investmentId } } },
          { new: true }
        );
      }
    }
    
    //console.log(investment);
    //console.log(user.balance);
  },
};

module.exports = investmentController;
