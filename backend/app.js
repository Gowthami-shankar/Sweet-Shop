const express = require('express');
const app = express();

// 1. Static Middleware (To handle static file requests first, preventing the crash)
app.use(express.static('public'));

// 2. JSON Parser Middleware (To parse the request body for POST/PUT)
app.use(express.json());

// 3. Root Route (Optional)
app.get('/', (req, res) => res.send('API Running'));

// 4. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sweets', require('./routes/sweets'));

// Export the application instance
module.exports = app;
