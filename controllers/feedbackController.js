const Feedback = require("../models/Feedback");
const jwt = require("jsonwebtoken");


const feedbackController = {
  async createFeedback(req, res) {
    try {
      const token = req.headers.authorization;
      if(!token){
        console.log("No token provided in request");
      }
      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const { body } = req.body;
      const newFeedback = await Feedback.create({
        email: userEmail,
        body: body,
      });
      res
        .status(201)
        .json({
          message: "Feedback created successfully",
          feedback: newFeedback,
        });
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ error: "Failed to create feedback" });
    }
  },
  async getFeedback(req, res) {
    try {
     const allFeedback = await Feedback.find();
      res.status(200).json(allFeedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ error: 'Failed to fetch feedback' });
    }
  },
};

module.exports = feedbackController;
