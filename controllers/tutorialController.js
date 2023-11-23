const Tutorial = require("../models/Tutorial");

const tutorialController = {
  async createTutorial(req, res) {
    try {
      const { title, description, imageUrl, url } = req.body;
      const newTutorial = new Tutorial({
        title,
        description,
        imageUrl,
        url,
      });
      const savedTutorial = await newTutorial.save();

      res.status(201).json(savedTutorial);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getTutorial(req, res) {
    try {
      const tutorials = await Tutorial.find();
      res.status(200).json(tutorials);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = tutorialController;
