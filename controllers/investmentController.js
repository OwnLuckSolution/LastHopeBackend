const { Investment, User, Transaction } = require("../models/User");
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
        type: "Investment",
        status: "Approved",
      });
      const interestRate =
          newInvestment.type === "A"
            ? 0.07
            : newInvestment.type === "B"
            ? 0.025
            : 0;
      newInvestment.dailyIncome = (initialAmount*interestRate)/30;
      console.log(newInvestment.dailyIncome);

      if (initialAmount > user.wallet.balance) {
        return res.status(400).send("Not sufficient funds");
      } else {
        user.wallet.balance -= initialAmount;
        user.investments.push(newInvestment);
        await user.save();
        await newTransaction.save();
        await newInvestment.save();

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
      const user = await User.findOne({email:userEmail});
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const investments = await Investment.find({ user: userEmail });   
      for (const investment of investments) {
        let dailyIncome = 0;
        let monthIncome = 0;
        const interestRate =
          investment.type === "A"
            ? 0.07
            : investment.type === "B"
            ? 0.025
            : 0;
        monthIncome = investment.initialAmount * interestRate;
        const lastUpdate = new Date(investment.lastUpdate);
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - lastUpdate.getTime();
        const millisecondsInMonth = 1000 * 60 * 60 * 24 * 30.44;
        const millisecondsInDay = 1000*60*60*24;
        const daysPassed = timeDiff/ millisecondsInDay;
        // console.log(daysPassed);
        if(daysPassed >= 1){
          investment.monthIncome += daysPassed * investment.dailyIncome;
          investment.lastUpdate = currentDate;
          await investment.save();
        }
      }
      
      res.json(investments);
     }catch (error) {
      console.error(error);
      
    }
  },
  async withdrawInvestment(req, res) {
    try {
      //check from last withdrawal 
      const terminate = req.body.terminate;
      const token = req.headers.authorization;
      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const user = await User.findOne({ email: userEmail }).populate("wallet");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const investmentId = req.params.id;
      const investment = await Investment.findById(investmentId);
      console.log(investment.createdAt);
      if (investment.isActive != false) {
        const lastWithdrawal = new Date(investment.lastWithdrawal);
        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - lastWithdrawal.getTime();
        const millisecondsInMonth = 1000 * 60 * 60 * 24 * 30.44;
        const monthsPassed = timeDiff / millisecondsInMonth;
        console.log(`user initial balance ${user.wallet.balance}`);
        if (monthsPassed >= 1) {
          user.wallet.balance += investment.monthIncome;
          investment.lastWithdrawal = currentDate;
          console.log(`user balance after month profit ${user.wallet.balance}`);
          if (terminate === "yes") {
            user.wallet.balance = user.wallet.balance + investment.initialAmount;
            console.log(`user balance after terminating ${user.wallet.balance}`);
            investment.isActive = false;
            const newTransaction1 = new Transaction({
              amount: investment.initialAmount,
              description: `Investment  type ${investment.type}, Amount ${investment.initialAmount}`,
              username: user.name,
              email: user.email,
              isVerified: true,
              type: "Investment Cancel",
              status: "Approved",
            });
            await newTransaction1.save();
          }
          const newTransaction2 = new Transaction({
            amount: investment.monthIncome,
            description: `Investment  type ${investment.type}, Amount ${investment.monthIncome}`,
            username: user.name,
            email: user.email,
            isVerified: true,
            type: "Investment Withdraw",
            status: "Approved",
          });
          investment.monthIncome = 0;
          await investment.save();
          await user.save();
          await newTransaction2.save();
          res.send("investment withdrawn successfully");
        } else {
          res.status(400).send({ message:"1 Month has not passed since last withdrawel"});
        }
      } else {
        res.status(400).send({message: "Investment is already inactive"});
      }
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = investmentController;
