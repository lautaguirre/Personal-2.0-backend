const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 120,
  },
  percentage: {
    type: Number,
    default: 0,
    max: 100,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    maxlength: 120,
  },
}, {
  timestamps: true,
});

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
