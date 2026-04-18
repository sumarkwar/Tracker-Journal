const express = require('express');
const router = express.Router();
const { addFitness, getFitness, updateFitness } = require('../controllers/fitnessController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getFitness);
router.post('/', addFitness);
router.put('/:id', updateFitness);

module.exports = router;