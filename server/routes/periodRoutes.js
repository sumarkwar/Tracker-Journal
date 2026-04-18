const express = require('express');
const router = express.Router();
const { addPeriod, getPeriods, updatePeriod } = require('../controllers/periodController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getPeriods);
router.post('/', addPeriod);
router.put('/:id', updatePeriod);

module.exports = router;