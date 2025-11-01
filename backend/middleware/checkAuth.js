const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Get token from header, "Bearer TOKEN_STRING"
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
    
    // Attach user info to the request for other routes to use
    req.userData = { 
        email: decodedToken.email, 
        userId: decodedToken.userId, 
        role: decodedToken.role // Make sure your JWT contains the role!
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed!' });
  }
};