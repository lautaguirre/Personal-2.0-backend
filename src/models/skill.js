const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  content: [{
    type: {
      type: String,
    },
    description: {
      type: String,
    },
    asset: {
      type: String,
    },
  }],
}, {
  timestamps: true,
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;