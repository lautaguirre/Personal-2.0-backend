const express = require('express');
const About = require('../models/about');
const Language = require('../models/language');
const Portfolio = require('../models/portfolio');
const Skill = require('../models/skill');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/about', async (req, res) => {
  // const result = await About.findOneAndUpdate({ 'content._id': mongoose.ObjectId('5d0586ac884c0d2ae427a565')}, { 'content.$.text': 'nada' });

  try {
    const about = await About.find({});

    res.send({ about });
  } catch(e) {
    res.status(500).send({ error: 'Error retrieving information' });
  }
});

router.delete('/about/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await About.updateOne({ 'items._id': id }, { $pull: { items: { _id: id }} });

    res.send(result);
  } catch(e) {
    res.status(500).send({ error: 'Error deleting information' });
  }
});

router.patch('/about/:id', async (req, res) => {
  // const result = await About.findOneAndUpdate({ 'content._id': mongoose.ObjectId('5d0586ac884c0d2ae427a565')}, { 'content.$.text': 'nada' });
  console.log(req.params.id);
  console.log(req.body);

  res.send();
});

router.post('/about', async (req, res) => {
  // const result = await About.findOneAndUpdate({ 'content._id': mongoose.ObjectId('5d0586ac884c0d2ae427a565')}, { 'content.$.text': 'nada' });
  console.log(req.body);

  res.send({ ...req.body, _id: new mongoose.Types.ObjectId() });
});

router.get('/languages', async (req, res) => {
  try {
    const languages = await Language.find({});

    res.send({ languages });
  } catch(e) {
    res.status(500).send({ error: 'Error retrieving information' });
  }
});

router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.find({});

    res.send({ portfolio });
  } catch(e) {
    res.status(500).send({ error: 'Error retrieving information' });
  }
});

router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find({});

    res.send({ skills });
  } catch(e) {
    res.status(500).send({ error: 'Error retrieving information' });
  }
});

module.exports = router;
