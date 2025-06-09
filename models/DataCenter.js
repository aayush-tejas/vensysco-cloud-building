const mongoose = require('mongoose');

const DataCenterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['modular', 'traditional']
  },
  racks: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  power: {
    type: Number,
    required: true,
    min: 10,
    max: 1000
  },
  cooling: {
    type: String,
    required: true,
    enum: ['standard', 'liquid', 'hybrid']
  },
  redundancy: {
    type: String,
    required: true,
    enum: ['n', 'n+1', '2n', '2n+1']
  },
  security: {
    type: String,
    required: true,
    enum: ['basic', 'standard', 'high']
  },
  remoteMonitoring: {
    type: Boolean,
    default: false
  },
  onSiteSupport: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  },
  estimatedCost: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Datacenter', DataCenterSchema);