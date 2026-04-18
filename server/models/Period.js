const mongoose = require('mongoose');

const PeriodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  cycleLength: { type: Number, default: 28 },
  periodLength: { type: Number, default: 5 },
  symptoms: [{ type: String }],
  mood: { type: String },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Period', PeriodSchema);