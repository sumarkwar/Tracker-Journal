const Journal = require('../models/Journal');

const addEntry = async (req, res) => {
  try {
    const entry = await Journal.create({
      user: req.user.id,
      ...req.body
    });
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEntries = async (req, res) => {
  try {
    const entries = await Journal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEntry = async (req, res) => {
  try {
    const entry = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEntry = async (req, res) => {
  try {
    await Journal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addEntry, getEntries, updateEntry, deleteEntry };