const express = require('express');
const About = require('../models/about');
const Language = require('../models/language');
const Portfolio = require('../models/portfolio');
const Skill = require('../models/skill');

const router = express.Router();

router.get('/about', async (req, res) => {
  // const result = await About.findOneAndUpdate({ 'content._id': mongoose.ObjectId('5d0586ac884c0d2ae427a565')}, { 'content.$.text': 'nada' });

  try {
    const about = await About.find({});

    res.send({ about });
  } catch(e) {
    res.status.send({ error:  'Error retrieving information' });
  }
});

router.get('/languages', async (req, res) => {
  try {
    const languages = await Language.find({});

    res.send({ languages });
  } catch(e) {
    res.status.send({ error:  'Error retrieving information' });
  }
});

router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.find({});

    res.send({ portfolio });
  } catch(e) {
    res.status.send({ error:  'Error retrieving information' });
  }
});

router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find({});

    res.send({ skills });
  } catch(e) {
    res.status.send({ error:  'Error retrieving information' });
  }
});

module.exports = router;
