const express = require('express');
const { body, validationResult } = require('express-validator');
const DataCenter = require('../models/DataCenter');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all data centers for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const datacenters = await DataCenter.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      datacenters
    });
  } catch (error) {
    console.error('Get datacenters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new data center
router.post('/', [
  auth,
  body('projectName').trim().isLength({ min: 1 }).withMessage('Project name is required'),
  body('type').isIn(['modular', 'traditional']).withMessage('Invalid data center type'),
  body('racks').isInt({ min: 1, max: 100 }).withMessage('Racks must be between 1 and 100'),
  body('power').isInt({ min: 10, max: 1000 }).withMessage('Power must be between 10 and 1000 kW'),
  body('cooling').isIn(['standard', 'liquid', 'hybrid']).withMessage('Invalid cooling type'),
  body('redundancy').isIn(['n', 'n+1', '2n', '2n+1']).withMessage('Invalid redundancy type'),
  body('security').isIn(['basic', 'standard', 'high']).withMessage('Invalid security level')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      projectName,
      type,
      racks,
      power,
      cooling,
      redundancy,
      security,
      remoteMonitoring,
      onSiteSupport,
      notes,
      estimatedCost
    } = req.body;

    const datacenter = new DataCenter({
      user: req.user.userId,
      projectName,
      type,
      racks,
      power,
      cooling,
      redundancy,
      security,
      remoteMonitoring: remoteMonitoring || false,
      onSiteSupport: onSiteSupport || false,
      notes,
      estimatedCost
    });

    await datacenter.save();

    res.status(201).json({
      success: true,
      message: 'Data center created successfully',
      datacenter
    });

  } catch (error) {
    console.error('Create datacenter error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single data center
router.get('/:id', auth, async (req, res) => {
  try {
    const datacenter = await DataCenter.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!datacenter) {
      return res.status(404).json({
        success: false,
        message: 'Data center not found'
      });
    }

    res.json({
      success: true,
      datacenter
    });

  } catch (error) {
    console.error('Get datacenter error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update data center
router.put('/:id', auth, async (req, res) => {
  try {
    const datacenter = await DataCenter.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!datacenter) {
      return res.status(404).json({
        success: false,
        message: 'Data center not found'
      });
    }

    res.json({
      success: true,
      message: 'Data center updated successfully',
      datacenter
    });

  } catch (error) {
    console.error('Update datacenter error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete data center
router.delete('/:id', auth, async (req, res) => {
  try {
    const datacenter = await DataCenter.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!datacenter) {
      return res.status(404).json({
        success: false,
        message: 'Data center not found'
      });
    }

    res.json({
      success: true,
      message: 'Data center deleted successfully'
    });

  } catch (error) {
    console.error('Delete datacenter error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;