const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  extractedText: { type: String, required: true },
  analysis: { type: Object }, // AI ka response yaha store hoga
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);