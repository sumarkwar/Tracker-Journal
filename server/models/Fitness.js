const mongoose = require('mongoose');

const FitnessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: { type: Date, default: Date.now },
  steps: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  weight: { type: Number },
  workout: {
    type: { type: String },
    duration: { type: Number },
    calories: { type: Number }
  },
  sleep: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Fitness', FitnessSchema);