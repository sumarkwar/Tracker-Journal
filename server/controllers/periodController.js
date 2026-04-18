const Period = require('../models/Period');

const addPeriod = async (req, res) => {
  try {
    const period = await Period.create({
      user: req.user.id,
      ...req.body
    });
    res.status(201).json(period);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPeriods = async (req, res) => {
  try {
    const periods = await Period.find({ user: req.user.id }).sort({ startDate: -1 });
    const last = periods[0];
    let nextPrediction = null;
    if (last) {
      const next = new Date(last.startDate);
      next.setDate(next.getDate() + (last.cycleLength || 28));
      nextPrediction = next;
    }
    res.json({ periods, nextPrediction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePeriod = async (req, res) => {
  try {
    const period = await Period.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(period);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addPeriod, getPeriods, updatePeriod };