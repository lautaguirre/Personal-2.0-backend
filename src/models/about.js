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
    },
    itemText: {
      type: String,
    },
  }],
}, {
  timestamps: true,
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;
