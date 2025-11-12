const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userMessage: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  intent: {
    type: String
  },
  confidence: {
    type: Number
  },
  channel: {
    type: String,
    enum: ['web', 'voice'],
    default: 'web'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Index for faster queries
chatLogSchema.index({ sessionId: 1, timestamp: -1 });

module.exports = mongoose.model('ChatLog', chatLogSchema);
