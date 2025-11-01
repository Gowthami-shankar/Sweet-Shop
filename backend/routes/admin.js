const express = require('express');
const router = express.Router();

// Import our middleware
const checkAuth = require('../middleware/checkAuth');
const isAdmin = require('../middleware/isAdmin');

// Import the controller logic
const AdminController = require('../controllers/adminController');

// Define the route
// POST /api/admin/create-user
// This route will FIRST run checkAuth, THEN run isAdmin, THEN run the controller.
router.post(
  '/create-user', 
  checkAuth, 
  isAdmin, 
  AdminController.createUser
);

module.exports = router;