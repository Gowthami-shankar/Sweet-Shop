const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.use(express.json());
require('dotenv').config();

// ===================== REGISTER =====================
router.post('/register', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Registration failed: Request body is empty.');
  }

  const { username, password, role } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check if username already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User with this username already exists.' });
    }

    // Create new user
    user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).send('Server error');
  }
});

// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Login failed: Request body is empty.');
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
