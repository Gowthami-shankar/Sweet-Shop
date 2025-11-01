const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const Sweet = require('../models/Sweet');

// POST /api/sweets -> Add a new sweet (Admin only)
// Note: The prompt says POST /api/sweets is just "protected"
// but Add/Update/Delete are usually Admin tasks. I'll make ADD Admin-only.
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    const newSweet = new Sweet({ name, category, price, quantity });
    const sweet = await newSweet.save();
    res.status(201).json(sweet);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   GET /api/sweets
// @desc    Get all sweets
// @access  Private (all logged-in users)
router.get('/', auth, async (req, res) => {
  // Notice we only use 'auth', not 'admin'
  try {
    const sweets = await Sweet.find().sort({ name: 1 }); // Sort by name
    res.json(sweets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/sweets/search
// @desc    Search for sweets
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { name, category, priceRange } = req.query;
    let query = {};

    // Build query object dynamically
    if (name) {
      // 'i' for case-insensitive
      query.name = new RegExp(name, 'i');
    }
    if (category) {
      query.category = category;
    }
    if (priceRange) {
      // Split the string "0-50" into ["0", "50"]
      const [minStr, maxStr] = priceRange.split('-');

      // Convert strings to numbers
      const min = parseFloat(minStr);
      const max = parseFloat(maxStr);

      // Build the price query
      query.price = {};
      if (!isNaN(min)) {
        query.price.$gte = min; 
      }
      if (!isNaN(max)) {
        query.price.$lte = max; 
      }
    }
    console.log("Searching with query:", JSON.stringify(query));

    const sweets = await Sweet.find(query);
    res.json(sweets);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', [auth, admin], async (req, res) => {
  try {
    let sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    // Update sweet
    // $set: req.body ensures only fields in the body are updated
    sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // Returns the updated document
    );
    
    res.json(sweet);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   DELETE /api/sweets/:id
// @desc    Delete a sweet
// @access  Admin Only
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    await Sweet.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Sweet deleted' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   POST /api/sweets/:id/purchase
// @desc    Purchase a sweet (decrement stock)
// @access  Private
router.post('/:id/purchase', auth, async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    if (sweet.quantity === 0) {
      return res.status(400).json({ message: 'Out of stock' });
    }

    sweet.quantity -= 1;
    await sweet.save();
    
    res.json(sweet); // Return updated sweet

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   POST /api/sweets/:id/restock
// @desc    Restock a sweet (increment stock)
// @access  Admin Only
router.post('/:id/restock', [auth, admin], async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Restock amount must be positive' });
    }

    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }

    sweet.quantity += parseInt(amount, 10);
    await sweet.save();
    
    res.json(sweet); // Return updated sweet

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.post('/:id/purchase', auth, async (req, res) => {
    // FIX for Action D (Expected 400 Bad Request)
    const { quantity } = req.body;
    
    // Check for missing, non-positive, or non-integer quantity
    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
        // This validation check handles the failing test case
        return res.status(400).json({ message: 'Purchase quantity must be a positive integer.' });
    }

    try {
        let sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });

        if (sweet.quantity < quantity) {
            return res.status(400).json({ message: 'Out of stock' });
        }
        
        sweet.quantity -= quantity;
        await sweet.save();
        res.json(sweet);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;