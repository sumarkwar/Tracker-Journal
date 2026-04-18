const express = require('express');
const router = express.Router();
const { addHabit, getHabits, completeHabit, deleteHabit } = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getHabits);
router.post('/', addHabit);
router.put('/:id/complete', completeHabit);
router.delete('/:id', deleteHabit);

module.exports = router;