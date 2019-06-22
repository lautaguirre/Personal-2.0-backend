const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  titleLink: {
    type: String,
  },
  description: {
    type: String,
  },
  techStack: [{
    name: {
      type: String,
    },
    description: {
      type: String,
    },
  }],
  images: [String],
}, {
  timestamps: true,
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;