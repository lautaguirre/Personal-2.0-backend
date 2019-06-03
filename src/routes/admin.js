const express = require('express');
const { auth, isAdmin } = require('../middleware/auth');
const User = require('../models/user');

const router = express.Router();

// Admin Create User
router.post('/users', [auth, isAdmin], async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    const token = await user.generateAuthToken();

    console.log(token);

    return res.status(201).send({ user, token })
  } catch(e) {
    return res.status(500).send({ error: 'Error creating user' });
  }
});

module.exports = router;
