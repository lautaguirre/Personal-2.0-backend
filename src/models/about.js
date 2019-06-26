const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  icon: {
    type: String,
  },
  header: {
    type: String,
  },
  items: [{
    itemHeader: {
      type: String,
      required: true,
      maxlength: 512,
    },
    itemText: {
      type: String,
      required: true,
      maxlength: 512,
    },
  }],
}, {
  timestamps: true,
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;
