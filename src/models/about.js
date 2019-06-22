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
      maxlength: 256,
    },
    itemText: {
      type: String,
      required: true,
      maxlength: 256,
    },
  }],
}, {
  timestamps: true,
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;
