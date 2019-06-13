const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/user');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = await user.generateAuthToken();

    return res.send({ user, token })
  } catch(e) {
    return res.status(401).send({ error: 'Error logging in user' })
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);

    await req.user.save();

    return res.send();
  } catch(e) {
    return res.status(500).send({ error: 'Error login out' });
  }
});

// Logout all devices
router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    return res.send();
  } catch(e) {
    return res.status(500).send({ error: 'Error login out' });
  }
});

router.get('/me', auth, (req, res) => {
  return res.send(req.user);
});

router.patch('/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'password', 'email'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid fields' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);

    await req.user.save();

    return res.send(req.user);
  } catch(e) {
    return res.status(500).send({ error: 'Error updating user' });
  }
});



module.exports = router;
