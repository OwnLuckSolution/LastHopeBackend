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
  async deleteTutorial (req, res) {
    const { id } = req.params;
  
    try {
      const deletedTutorial = await Tutorial.findByIdAndDelete(id);
  
      if (!deletedTutorial) {
        return res.status(404).json({ message: 'Tutorial not found' });
      }
  
      return res.status(200).json({ message: 'Tutorial deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete tutorial', error: error.message });
    }
  },
};

module.exports = tutorialController;
