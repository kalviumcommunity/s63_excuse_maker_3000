const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;
