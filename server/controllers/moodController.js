const Mood = require('../models/Mood');

const addMood = async (req, res) => {
  try {
    const mood = await Mood.create({
      user: req.user.id,
      ...req.body
    });
    res.status(201).json(mood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user.id }).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMood, getMoods };