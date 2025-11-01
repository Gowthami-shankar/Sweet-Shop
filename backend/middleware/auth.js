const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
    // Look for the Authorization header (standard Bearer token format)
    const authHeader = req.header('Authorization');

    // 1. Check if the header is missing or not in Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 2. Extract the token string (removes "Bearer ")
    const token = authHeader.split(' ')[1]; 
    
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach the ENTIRE decoded payload (which contains the userId and role)
        // This is crucial for the 'admin' middleware to work correctly.
        req.user = decoded; 
        
        next();
    } catch (err) {
        // Token is malformed or expired
        res.status(401).json({ message: 'Token is not valid' });
    }
}

// Admin middleware remains the same, but now it references the correct req.user
function admin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        // This is the role failure check. It must be 403.
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
}

module.exports = { auth, admin };