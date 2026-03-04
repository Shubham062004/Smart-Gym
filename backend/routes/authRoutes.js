const express = require('express');
const { signup, login, getProfile, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/profile', protect, getProfile);

module.exports = router;
