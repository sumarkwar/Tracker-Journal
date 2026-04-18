const Fitness = require('../models/Fitness');

const addFitness = async (req, res) => {
  try {
    const fitness = await Fitness.create({
      user: req.user.id,
      ...req.body
    });
    res.status(201).json(fitness);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFitness = async (req, res) => {
  try {
    const records = await Fitness.find({ user: req.user.id }).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFitness = async (req, res) => {
  try {
    const fitness = await Fitness.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(fitness);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addFitness, getFitness, updateFitness };