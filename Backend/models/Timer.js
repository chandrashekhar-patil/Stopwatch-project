import mongoose from 'mongoose';

const timerSchema = new mongoose.Schema({
  title: String,
  description: String,
  elapsed: { type: Number, default: 0 },
  isRunning: { type: Boolean, default: false },
  startTime: Date,
  sessionId: String,
});

export const Timer = mongoose.model('Timer', timerSchema);