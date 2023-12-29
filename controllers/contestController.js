const Contest = require("../models/Contest");
const jwt = require("jsonwebtoken");
const {User,Transaction,Wallet} = require("../models/User");
const  mongoose  = require('mongoose');

const contestController = {
  async createContest(req, res) {
    const {
      name,
      firstPrize,
      secondPrize,
      thirdPrize,
      images,
      description,
      price,
    } = req.body;

    try {
      const newContest = new Contest({
        name,
        firstPrize,
        secondPrize,
        thirdPrize,
        images,
        description,
        price,
      });
      const savedContest = await newContest.save();
      res.status(201).json(savedContest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async endContest(req, res) {
    const contestId = req.params.id;

    try {
      const contest = await Contest.findById(contestId);

      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      const updatedContest = await Contest.findByIdAndUpdate(
        contestId,
        { isLive: false },
        { new: true }
      );

      if (!updatedContest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      // Fisher-Yates shuffle algorithm//net sey chaapa hai
      const participants = updatedContest.participants;
      for (let i = participants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participants[i], participants[j]] = [participants[j], participants[i]];
      }

      const firstWinner = participants[0];
      const secondWinner = participants[1];
      const thirdWinner = participants[2];

      updatedContest.firstPrize = firstWinner;
      updatedContest.secondPrize = secondWinner;
      updatedContest.thirdPrize = thirdWinner;

      await updatedContest.save();

      res.json(updatedContest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async deleteContest(req, res) {
    const contestId = req.params.id;
    try {
      const removedContest = await Contest.findOneAndDelete({ _id: contestId });
      if (!removedContest) {
        return res.status(404).json({ message: "Contest not found" });
      }
      res.json({ message: "Contest deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async unLiveContest(req, res) {
    const contestId = req.params.id;
    try {
      const updatedContest = await Contest.findOneAndUpdate(
        { _id: contestId },
        { isLive: false },
        { new: true }
      );
      if (!updatedContest) {
        return res.status(404).json({ message: "Contest not found" });
      }
      res.json({
        message: "Contest is no longer live",
        contest: updatedContest,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async getContest(req, res) {
    const allProducts = await Contest.find();
    res.send(allProducts);
  },
  async editContest(req, res) {
    console.log("editing products");
    const id = req.params.id;
    console.log(id);
    const {
      name,
      isLive,
      firstPrize,
      secondPrize,
      thirdPrize,
      images,
      description,
      price,
      winner1,
      winner2,
      winner3,
    } = req.body; 

    try {
      const updatedContest = await Contest.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
            isLive,
            firstPrize,
            secondPrize,
            thirdPrize,
            images,
            description,
            price,
            winner1,
            winner2,
            winner3,
          },
        },
        { new: true }
      );
      const winner_1 = await User.findOne({ id: winner1 });
      const winner_2 = await User.findOne({ id: winner2 });
      const winner_3 = await User.findOne({ id: winner3 });


      if (!updatedContest) {
        return res.status(404).send("Contest not found");
      }

      res.status(200).json(updatedContest,winner_1,winner_2,winner_3);
    } catch (error) {
      res.status(500).send("Error editing contest");
    }
  },
  async buyContest(req, res) {
    console.log("buying contest");
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Token not provided" });
    }

    try {
        const decoded = await jwt.verify(token, "lottery-app");
        const userEmail = decoded.email;

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const contestId = req.params.id;
        const contest = await Contest.findById(contestId);

        if (!contest) {
            return res.status(404).json({ error: "Contest not found" });
        }

        const quantityToPurchase = req.body.quantity;
        const totalPrice = quantityToPurchase * contest.price;

        if (user.wallet.balance < totalPrice) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        user.wallet.balance -= totalPrice;
        
        const transaction = new Transaction({
            amount: totalPrice,
            description: contest,
            username: user.name,
            email: user.email,
            type: 'Contest',
            paymentMehtod: 'Wallet',
        });
        console.log(user._id);
        const participant ={
          user: user.email,
          quantity: quantityToPurchase
        };
        
        contest.participants.push(participant);
        await user.save();
        await transaction.save();
        await contest.save();

        return res.status(200).json({ message: "Contest entries purchased successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
},
};

module.exports = contestController;
