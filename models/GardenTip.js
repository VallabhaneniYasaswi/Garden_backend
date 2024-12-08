const mongoose = require('mongoose');

const gardenTipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🌱'
  },
  details: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GardenTip', gardenTipSchema); 