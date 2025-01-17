// const express = require("express")
// const router = express.Router()
// // const {
// //   login,
// //   signup,
// // } = require("../controllers/authController")

// // const { auth } = require("../middlewares/auth")

// // Route for user login
// // router.post("/login", login)

// // Route for user signup
// // router.post("/signup", signup)

// module.exports = router

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // User model import
const { body, validationResult } = require('express-validator');

// POST: /signup - Register a new user
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['patient', 'doctor', 'insurance', 'admin']).withMessage('Invalid role'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('dob').notEmpty().withMessage('Date of birth is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, fullName, phone, dob, address } = req.body;

    try {
      // Check if email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Create a new user
      const user = new User({
        email,
        password,
        role,
        fullName,
        phone,
        dob,
        address,
      });

      // Save the new user to the database
      await user.save();

      // Generate JWT token
      const token = user.generateAuthToken();

      res.status(201).json({
        message: 'User registered successfully',
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

module.exports = router;
