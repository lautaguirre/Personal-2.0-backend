const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  percentage: {
    type: Number,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
