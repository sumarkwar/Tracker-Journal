const express = require('express');
const router = express.Router();
const { addEntry, getEntries, updateEntry, deleteEntry } = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getEntries);
router.post('/', addEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;