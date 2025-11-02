const Sweet = require('../models/Sweet');

/**
 * @desc    Add a new sweet to inventory
 * @route   POST /api/sweets
 * @access  Admin Only
 */
const addSweet = async (req, res) => {
    // Note: The Admin check is handled by the middleware before this function runs.
    const { name, category, price, quantity } = req.body;

    // Basic Validation
    if (!name || !category || !price || quantity === undefined) {
        return res.status(400).json({ message: "Please provide name, category, price, and quantity." });
    }
    
    try {
        const newSweet = new Sweet({
            name,
            category,
            price: Number(price),
            quantity: Number(quantity),
        });

        const sweet = await newSweet.save();
        res.status(201).json(sweet);

    } catch (error) {
        // Handle duplicate name error (Mongoose unique constraint)
        if (error.code === 11000) {
            return res.status(400).json({ message: "A sweet with this name already exists." });
        }
        console.error('Add Sweet Error:', error.message);
        res.status(500).json({ message: 'Failed to add new sweet to inventory.' });
    }
};

/**
 * @desc    View a list of all available sweets
 * @route   GET /api/sweets
 * @access  Protected
 */
const getSweets = async (req, res) => {
    try {
        const sweets = await Sweet.find({}); 
        res.status(200).json(sweets);
    } catch (error) {
        console.error('Get Sweets Error:', error.message);
        res.status(500).json({ message: 'Failed to fetch sweets.' });
    }
};

/**
 * @desc    Search for sweets by name, category, or price range
 * @route   GET /api/sweets/search
 * @access  Protected
 */
const searchSweets = async (req, res) => {
    const { name, category, priceRange } = req.query;
    const query = {};

    try {
        // 1. Search by Name (case-insensitive regex search)
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        // 2. Search by Category (exact match)
        if (category) {
            query.category = category;
        }

        // 3. Search by Price Range
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);

            if (!isNaN(min) && !isNaN(max)) {
                query.price = { $gte: min, $lte: max };
            } else if (!isNaN(min)) {
                query.price = { $gte: min };
            }
        }

        const sweets = await Sweet.find(query);
        res.status(200).json(sweets);

    } catch (error) {
        console.error('Search Sweets Error:', error.message);
        res.status(500).json({ message: 'Failed to execute search query.' });
    }
};

/**
 * @desc    Update a sweet's details by ID
 * @route   PUT /api/sweets/:id
 * @access  Admin Only (Protected)
 */
const updateSweet = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Optional: Add basic validation to ensure 'price' or 'quantity' are numbers if present
    if (updates.price && isNaN(Number(updates.price))) {
        return res.status(400).json({ message: "Price must be a valid number." });
    }

    try {
        // Use findByIdAndUpdate and return the new document { new: true }
        const sweet = await Sweet.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true } 
        );

        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found.' });
        }

        res.status(200).json(sweet);

    } catch (error) {
        console.error('Update Sweet Error:', error.message);
        res.status(500).json({ message: 'Failed to update sweet details.' });
    }
};

/**
 * @desc    Delete a sweet by ID
 * @route   DELETE /api/sweets/:id
 * @access  Admin Only (Protected)
 */
const deleteSweet = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Sweet.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Sweet not found.' });
        }

        // Success response matching the test expectation
        res.status(200).json({ message: 'Sweet deleted' });

    } catch (error) {
        console.error('Delete Sweet Error:', error.message);
        res.status(500).json({ message: 'Failed to delete sweet.' });
    }
};


module.exports = {
    addSweet,
    getSweets,
    searchSweets,
    updateSweet,
    deleteSweet, 
};
