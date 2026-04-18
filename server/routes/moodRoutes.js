const express = require('express');
const router = express.Router();
const { addMood, getMoods } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getMoods);
router.post('/', addMood);

module.exports = router;