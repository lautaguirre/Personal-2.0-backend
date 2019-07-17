const mongoose = require('mongoose');
const validator = require('validator');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 120,
    trim: true,
  },
  titleLink: {
    type: String,
    required: true,
    maxlength: 120,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isURL(value)) throw new Error('URL is invalid');
    }
  },
  description: {
    type: String,
    required: true,
    maxlength: 1024,
    trim: true,
  },
  techStack: {
    type: [String],
    maxlength: 120,
    trim: true,
  },
  images: [String],
}, {
  timestamps: true,
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
