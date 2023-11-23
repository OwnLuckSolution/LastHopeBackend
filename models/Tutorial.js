const mongoose = require('mongoose');
const videoTutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: [{
    type: String,
    required: true,
  }],
  url: {
    type: String,
    required: true,
  },
});
const VideoTutorial = mongoose.model('VideoTutorial', videoTutorialSchema);

module.exports = VideoTutorial;
