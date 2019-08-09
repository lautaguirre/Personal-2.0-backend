const express = require('express');
const About = require('../models/about');
const Language = require('../models/language');
const Portfolio = require('../models/portfolio');
const Skill = require('../models/skill');
const mongoose = require('mongoose');
const multer = require('multer');
const Datauri = require('datauri');
const path = require('path');
const cloudinary = require('cloudinary');
const { auth, isAdmin } = require('../middleware/auth');

const dUri = new Datauri();
const router = express.Router();

// ABOUT
router.get('/about', async (req, res) => {
  try {
    const about = await About.find({});

    return res.send({ about });
  } catch(e) {
    return res.status(500).send({ error: 'Error retrieving information' });
  }
});

router.delete('/about/:_id', [auth, isAdmin], async (req, res) => {
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

router.patch('/about/:_id', [auth, isAdmin], async (req, res) => {
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

router.post('/about', [auth, isAdmin], async (req, res) => {
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

// LANGUAGES
router.get('/languages', async (req, res) => {
  try {
    const languages = await Language.find({});

    return res.send({ languages });
  } catch(e) {
    return res.status(500).send({ error: 'Error retrieving information' });
  }
});

router.delete('/languages/:_id', [auth, isAdmin], async (req, res) => {
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

router.patch('/languages/:_id', [auth, isAdmin], async (req, res) => {
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

router.post('/languages', [auth, isAdmin], async (req, res) => {
  const language = new Language(req.body);

  try  {
    await language.save();

    return res.send(language);
  } catch(e) {
    return res.status(500).send({ error: 'Error creating language' });
  }
});

// PORTFOLIO
router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.find({});

    return res.send({ portfolio });
  } catch(e) {
    return res.status(500).send({ error: 'Error retrieving portfolio' });
  }
});

router.delete('/portfolio/:_id', [auth, isAdmin], async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(500).send({ error: 'Missing ID' });
  }

  try {
    const result = await Portfolio.findByIdAndDelete(_id);

    return res.send(result);
  } catch(e) {
    return res.status(500).send({ error: 'Error deleting portfolio' });
  }
});

const uploadPortfolio = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (file.mimetype !== 'image/png') {
      return cb(new Error('File must be a PNG file'));
    }

    cb(undefined, true);
  },
});
router.patch('/portfolio/:_id', [auth, isAdmin], uploadPortfolio.array('images'), async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(500).send({ error: 'Missing ID' });
  }

  try {
    let originalImages = [];
    if (req.body.images) {
      originalImages = Array.isArray(req.body.images) ? req.body.images : [ req.body.images ];
    }

    let imageLinks = [ ...originalImages ];
    for (const file of req.files) {
      const dataUri = dUri.format(path.extname(file.originalname).toString(), file.buffer);

      const fileResponse = await cloudinary.v2.uploader.upload(dataUri.content, { folder: 'personalV2' });

      imageLinks.push(fileResponse.url);
    }

    const result = await Portfolio.findByIdAndUpdate(_id, { ...req.body, images: imageLinks }, { runValidators: true, new: true });

    return res.send(result);
  } catch(e) {
    return res.status(500).send({ error: 'Error editing portfolio' });
  }
});

router.post('/portfolio', [auth, isAdmin], uploadPortfolio.array('images'), async (req, res) => {
  let imageLinks = [];
  for (const file of req.files) {
    const dataUri = dUri.format(path.extname(file.originalname).toString(), file.buffer);

    const fileResponse = await cloudinary.v2.uploader.upload(dataUri.content, { folder: 'personalV2' });

    imageLinks.push(fileResponse.url);
  }

  const portfolio = new Portfolio({ ...req.body, images: imageLinks });

  try  {
    await portfolio.save();

    return res.send(portfolio);
  } catch(e) {
    return res.status(500).send({ error: 'Error creating portfolio' });
  }
});

// SKILLS
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find({});

    return res.send({ skills });
  } catch(e) {
    return res.status(500).send({ error: 'Error retrieving information' });
  }
});

router.delete('/skills/:_id', [auth, isAdmin], async (req, res) => {
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
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (file.mimetype !== 'image/svg+xml') {
      return cb(new Error('File must be a SVG file'));
    }

    cb(undefined, true);
  },
});
router.patch('/skills/:_id', [auth, isAdmin], uploadSkill.single('asset'), async (req, res) => {
  const { _id } = req.params;
  const { type, asset } = req.body;

  if (!_id) {
    return res.status(500).send({ error: 'Missing ID' });
  }

  try {
    let formattedAsset;
    if (type === 'image') {
      if (req.file) {
        const dataUri = dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

        const fileResponse = await cloudinary.v2.uploader.upload(dataUri.content, { folder: 'personalV2' });

        formattedAsset = fileResponse.url;
      } else if (asset) {
        formattedAsset = asset;
      } else {
        return res.status(500).send({ error: 'Missing File' });
      }
    } else if (type === 'icon'){
      if (asset) {
        formattedAsset = asset;
      } else {
        return res.status(500).send({ error: 'Missing Icon' });
      }
    } else {
      return res.status(500).send({ error: 'Missing Asset' });
    }

    const result = await Skill.findOneAndUpdate({ 'content._id': _id }, { 'content.$': { ...req.body, asset: formattedAsset, _id }}, { runValidators: true, new: true });

    const contentElement = result.content.find(skill => skill._id.toString() === _id);

    return res.send(contentElement);
  } catch(e) {
    return res.status(500).send({ error: 'Error editing skill' });
  }
});

router.post('/skills', [auth, isAdmin], uploadSkill.single('asset'), async (req, res) => {
  const { groupId, type, asset, description } = req.body;

  if (!groupId) {
    return res.status(400).send({ error: 'Missing group ID' });
  }

  const _id = new mongoose.Types.ObjectId();

  try  {
    let formattedAsset;
    if (type === 'image') {
      if (req.file) {
        const dataUri = dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

        const fileResponse = await cloudinary.v2.uploader.upload(dataUri.content, { folder: 'personalV2' });

        formattedAsset = fileResponse.url;
      } else if (asset) {
        formattedAsset = asset;
      } else {
        return res.status(500).send({ error: 'Missing File' });
      }
    } else if (type === 'icon'){
      if (asset) {
        formattedAsset = asset;
      } else {
        return res.status(500).send({ error: 'Missing Icon' });
      }
    } else {
      return res.status(500).send({ error: 'Missing Asset' });
    }

    const result = await Skill.findOneAndUpdate({ _id: groupId }, { $push: { content: { ...req.body, asset: formattedAsset, _id } }}, { runValidators: true, new: true });

    const contentElement = result.content.find(skill => skill._id.toString() === _id.toString());

    return res.send(contentElement);
  } catch(e) {
    return res.status(500).send({ error: 'Error creating skill' });
  }
});

module.exports = router;
