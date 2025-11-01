const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ensure the router can parse JSON bodies
router.use(express.json());
require('dotenv').config(); 

// POST /api/auth/register
router.post('/register', async (req, res) => {

    if (!req.body) {
        return res.status(400).send('Registration failed: Request body is empty.');
    }

    // CRITICAL FIX: Ensure all fields are destructured here, including 'email'.
    const { username, email, password, role } = req.body; 

    try {
        // Check for required fields
        if (!username || !password || !email) {
            // This is the error message the test received:
            return res.status(400).json({ message: 'Username, email, and password are required.' }); 
        }

        // --- FIX FOR DUPLICATE REGISTRATION CHECK ---
        let user = await User.findOne({ email }); // Check if email already exists
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        
        // Hash password is handled in the User model's pre-save hook
        user = new User({ username, email, password, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).send('Server error');
    }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
    
    if (!req.body) {
        return res.status(400).send('Login failed: Request body is empty.');
    }

    // Find by email (as your tests and application should be using email)
    const { email, password } = req.body; 
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // This is the message the failing test received:
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // This is the message the failing test received:
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
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
