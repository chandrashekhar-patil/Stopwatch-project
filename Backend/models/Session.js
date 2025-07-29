import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  _id: String,
  title: { type: String, default: 'Untitled Session' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  timers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Timer' }],
});

export const Session = mongoose.model('Session', sessionSchema);