const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  times: [{ type: String }],
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  reminderEnabled: { type: Boolean, default: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);