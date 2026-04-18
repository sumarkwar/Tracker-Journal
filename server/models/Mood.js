const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: { type: Date, default: Date.now },
  mood: {
    type: String,
    enum: ['amazing', 'good', 'okay', 'bad', 'terrible'],
    required: true
  },
  note: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Mood', MoodSchema);