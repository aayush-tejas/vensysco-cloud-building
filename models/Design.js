const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  type: String,
  racks: Number,
  power: Number,
  cooling: String,
  redundancy: String,
  security: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Design', designSchema);
