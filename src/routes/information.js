const express = require('express');
const About = require('../models/about');
const Language = require('../models/language');
const Portfolio = require('../models/portfolio');
const Skill = require('../models/skill');
const mongoose = require('mongoose');
const multer = require('multer');

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
    return res.status(500).send({ error: 'Missing ID' });
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
    return res.status(500).send({ error: 'Missing ID' });
  }

  try {
    const result = await About.updateOne({ 'items._id': _id }, { 'items.$': { ...req.body, _id }}, { runValidators: true });

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

router.delete('/languages/:_id', async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(500).send({ error: 'Missing ID' });
  }

  try {
    const result = await Language.findByIdAndDelete(_id);

    return res.send(result);
  } catch(e) {
    return res.status(500).send({ error: 'Error deleting language' });
  }
});

router.patch('/languages/:_id', async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(500).send({ error: 'Missing ID' });
  }

  try {
    const result = await Language.findByIdAndUpdate(_id, req.body, { runValidators: true });

    return res.send(result);
  } catch(e) {
    return res.status(500).send({ error: 'Error editing language' });
  }
});

router.post('/languages', async (req, res) => {
  const language = new Language(req.body);

  try  {
    await language.save();

    return res.send(language);
  } catch(e) {
    return res.status(500).send({ error: 'Error creating language' });
  }
});

router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.find({});

    return res.send({ portfolio });
  } catch(e) {
    return res.status(500).send({ error: 'Error retrieving portfolio' });
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

router.delete('/skills/:_id', async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(500).send({ error: 'Missing ID' });
  }

  try {
    const result = await Skill.updateOne({ 'content._id': _id }, { $pull: { content: { _id }} });

    return res.send(result);
  } catch(e) {
    return res.status(500).send({ error: 'Error deleting Skill' });
  }
});

const uploadSkill = multer({
  limits: {
    fileSize: 10000,
  },
  fileFilter(req, file, cb) {
    if (file.mimetype !== 'image/svg+xml') {
      return cb(new Error('File must be a SVG file'));
    }

    cb(undefined, true);
  },
});
router.patch('/skills/:_id', uploadSkill.single('asset'), async (req, res) => {
  const { _id } = req.params;
  const { type, asset } = req.body;

  if (!_id) {
    return res.status(500).send({ error: 'Missing ID' });
  }

  let formattedAsset;
  if (type === 'image') {
    if (req.file) {
      formattedAsset = req.file.buffer.toString('base64');
    } else if (asset) {
      formattedAsset = asset.data;
    } else {
      return res.status(500).send({ error: 'Missing File' });
    }
  } else if (type === 'icon'){
    formattedAsset = asset;
  } else {
    return res.status(500).send({ error: 'Incorrect image type' });
  }

  try {
    await Skill.updateOne({ 'content._id': _id }, { 'content.$': { ...req.body, asset: formattedAsset, _id }}, { runValidators: true });

    return res.send({ ...req.body, asset: formattedAsset, _id });
  } catch(e) {
    console.log(e.message)
    return res.status(500).send({ error: 'Error editing skill' });
  }
});

router.post('/skills', uploadSkill.single('asset'), async (req, res) => {
  const { groupId, type, asset, description } = req.body;

  if (!groupId) {
    return res.status(400).send({ error: 'Missing group ID' });
  }

  const _id = new mongoose.Types.ObjectId();

  let formattedAsset;
  if (type === 'image') {
    if (req.file) {
      formattedAsset = req.file.buffer.toString('base64');
    } else if (asset) {
      formattedAsset = asset.data;
    } else {
      return res.status(500).send({ error: 'Missing File' });
    }
  } else if (type === 'icon'){
    formattedAsset = asset;
  } else {
    return res.status(500).send({ error: 'Incorrect image type' });
  }

  try  {
    await Skill.updateOne({ _id: groupId }, { $push: { content: { ...req.body, asset: formattedAsset, _id } }}, { runValidators: true });

    return res.send({ _id, description, type, asset: formattedAsset });
  } catch(e) {
    return res.status(500).send({ error: 'Error creating skill' });
  }
});

module.exports = router;
