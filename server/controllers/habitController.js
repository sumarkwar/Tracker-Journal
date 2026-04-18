const Habit = require('../models/Habit');

const addHabit = async (req, res) => {
  try {
    const habit = await Habit.create({
      user: req.user.id,
      ...req.body
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id, active: true });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const alreadyDone = habit.completedDates.some(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });
    if (!alreadyDone) {
      habit.completedDates.push(new Date());
      habit.streak += 1;
      await habit.save();
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteHabit = async (req, res) => {
  try {
    await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { active: false }
    );
    res.json({ message: 'Habit removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addHabit, getHabits, completeHabit, deleteHabit };