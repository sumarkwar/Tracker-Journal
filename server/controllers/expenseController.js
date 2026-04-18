const Expense = require('../models/Expense');

const addExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date, note } = req.body;
    const expense = await Expense.create({
      user: req.user.id,
      title, amount, category, type, date, note
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { filter } = req.query;
    let dateFilter = {};
    const now = new Date();

    if (filter === 'day') {
      dateFilter = {
        date: {
          $gte: new Date(now.setHours(0,0,0,0)),
          $lt: new Date(now.setHours(23,59,59,999))
        }
      };
    } else if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { date: { $gte: weekAgo } };
    } else if (filter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { date: { $gte: monthAgo } };
    }

    const expenses = await Expense.find({
      user: req.user.id,
      ...dateFilter
    }).sort({ date: -1 });

    const total = expenses.reduce((sum, e) => {
      return e.type === 'expense' ? sum - e.amount : sum + e.amount;
    }, 0);

    res.json({ expenses, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addExpense, getExpenses, deleteExpense };