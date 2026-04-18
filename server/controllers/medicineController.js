const Medicine = require('../models/Medicine');

const addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create({
      user: req.user.id,
      ...req.body
    });
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user.id });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    await Medicine.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    res.json({ message: 'Medicine deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMedicine, getMedicines, updateMedicine, deleteMedicine };