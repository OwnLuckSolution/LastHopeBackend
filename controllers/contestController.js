const Contest = require("../models/Contest");

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
    const id = req.params.id; // Assuming contestId is passed in the request parameters
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

      if (!updatedContest) {
        return res.status(404).send("Contest not found");
      }

      res.status(200).json(updatedContest);
    } catch (error) {
      res.status(500).send("Error editing contest");
    }
  },
};

module.exports = contestController;
