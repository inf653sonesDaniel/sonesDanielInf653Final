const mongoose = require('mongoose');

// Schema
const stateSchema = new mongoose.Schema({
  stateCode: {
    type: String,
    required: true,
    unique: true,
  },
  funfacts: [String],
});

// Model
const State = mongoose.model('State', stateSchema);

// Export model
module.exports = State;