const express = require('express');
const About = require('../models/about');
const Language = require('../models/language');
const Portfolio = require('../models/portfolio');
const Skill = require('../models/skill');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/about', async (req, res) => {
  try {
    const about = await About.find({});

    return res.send({ about });
  } catch(e) {
    return res.status(500).send({ error: 'Error retrieving information' });
  }
});

router.delete('/about/:_id', async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    res.status(500).send({ error: 'Missing ID' });
  }

  try {
    const result = await About.updateOne({ 'items._id': _id }, { $pull: { items: { _id }} });

    return res.send(result);
  } catch(e) {
    return res.status(500).send({ error: 'Error deleting information' });
  }
});

router.patch('/about/:_id', async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    res.status(500).send({ error: 'Missing ID' });
  }

  try {
    const result = await About.updateOne({ 'items._id': _id }, { 'items.$': { ...req.body, _id }}, { runValidators:true });

    return res.send(result);
  } catch(e) {
    return res.status(500).send({ error: 'Error editing information' });
  }
});

router.post('/about', async (req, res) => {
  const { payload, groupId } = req.body;

  if (!groupId) {
    return res.status(400).send({ error: 'Missing group ID' });
  }

  const _id = new mongoose.Types.ObjectId();

  try  {
    await About.updateOne({ _id: groupId }, { $push: { items: { ...payload, _id } }}, { runValidators: true });

    return res.send({ ...payload, _id });
  } catch(e) {
    console.log(e.message);
    return res.status(500).send({ error: 'Error creating information' });
  }
});

router.get('/languages', async (req, res) => {
  try {
    const languages = await Language.find({});

    return res.send({ languages });
  } catch(e) {
    return res.status(500).send({ error: 'Error retrieving information' });
  }
});

router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.find({});

    return res.send({ portfolio });
  } catch(e) {
    return res.status(500).send({ error: 'Error retrieving information' });
  }
});

router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find({});

    return res.send({ skills });
  } catch(e) {
    return res.status(500).send({ error: 'Error retrieving information' });
  }
});

module.exports = router;
