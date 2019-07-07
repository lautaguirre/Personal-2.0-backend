const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  content: [{
    type: {
      type: String,
      required: true,
      enum: ['image', 'icon'],
    },
    description: {
      type: String,
      required: true,
      maxLength: 128,
    },
    asset: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;