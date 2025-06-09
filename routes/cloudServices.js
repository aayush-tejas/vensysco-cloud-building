const express = require('express');
const { body, validationResult } = require('express-validator');
const CloudService = require('../models/CloudService');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = express.Router();

// Get all cloud service configurations for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const configurations = await CloudService.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      configurations
    });
  } catch (error) {
    console.error('Get cloud services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new cloud service configuration
router.post('/', [
  auth,
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
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

    const { email, configuration } = req.body;

    const cloudService = new CloudService({
      user: req.user.userId,
      email,
      configuration,
      estimatedCost: calculateTotalCost(configuration)
    });

    await cloudService.save();

    // Send email with configuration
    await sendConfigurationEmail(email, configuration, cloudService._id);

    res.status(201).json({
      success: true,
      message: 'Configuration saved and email sent successfully',
      configurationId: cloudService._id
    });

  } catch (error) {
    console.error('Create cloud service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single cloud service configuration
router.get('/:id', auth, async (req, res) => {
  try {
    const configuration = await CloudService.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    res.json({
      success: true,
      configuration
    });

  } catch (error) {
    console.error('Get cloud service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete cloud service configuration
router.delete('/:id', auth, async (req, res) => {
  try {
    const configuration = await CloudService.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    res.json({
      success: true,
      message: 'Configuration deleted successfully'
    });

  } catch (error) {
    console.error('Delete cloud service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Calculate total cost from configuration
function calculateTotalCost(config) {
  let totalCost = 0;

  // Compute costs
  if (config.compute) {
    let computeCost = 0;
    switch (config.compute.machineSize) {
      case 'small': computeCost = 20; break;
      case 'medium': computeCost = 80; break;
      case 'large': computeCost = 200; break;
      case 'xlarge': computeCost = 400; break;
      case 'custom': 
        computeCost = (config.compute.customVcpu * 5) + (config.compute.customMemory * 0.5);
        break;
    }

    // Instance type multiplier
    switch (config.compute.instanceType) {
      case 'compute-optimized': computeCost *= 1.3; break;
      case 'memory-optimized': computeCost *= 1.2; break;
      case 'gpu-optimized': computeCost *= 2.5; break;
    }

    // Additional costs
    const bootDiskCost = config.compute.bootDiskSize * 0.1;
    const ipCost = (config.compute.ipv4 ? 5 : 0) + (config.compute.ipv6 ? 2 : 0);
    
    let instanceCost = (computeCost + bootDiskCost + ipCost) * config.compute.instanceCount;
    
    // Commitment discount
    switch (config.compute.committedUsage) {
      case '1-year': instanceCost *= 0.7; break;
      case '3-year': instanceCost *= 0.5; break;
    }

    totalCost += instanceCost;
  }

  // Storage costs
  if (config.storage) {
    let storageCost = 0;
    
    if (config.storage.blockStorage) {
      let blockRate = 0;
      switch (config.storage.blockType) {
        case 'ssd': blockRate = 0.1; break;
        case 'hdd': blockRate = 0.05; break;
        case 'nvme': blockRate = 0.15; break;
      }
      storageCost += config.storage.blockSize * blockRate;
    }

    if (config.storage.objectStorage) {
      storageCost += config.storage.objectSize * 0.03;
    }

    if (config.storage.archiveStorage) {
      storageCost += config.storage.archiveSize * 0.01;
    }

    totalCost += storageCost;
  }

  // Network costs
  if (config.network) {
    let networkCost = 0;
    networkCost += (config.network.externalTx || 0) * 0.1;
    networkCost += (config.network.externalRx || 0) * 0.05;
    
    if (config.network.loadBalancer === 'yes') networkCost += 25;
    if (config.network.highAvailability === 'yes') networkCost += 50;
    
    totalCost += networkCost;
  }

  // Database costs
  if (config.db && config.db.nodes > 0) {
    let dbCost = 0;
    const baseNodeCost = config.db.machineType === 'large' ? 100 : 
                        config.db.machineType === 'medium' ? 50 : 25;
    
    dbCost = baseNodeCost * config.db.nodes;
    dbCost += (config.db.storageSize || 0) * (config.db.storageUnit === 'TB' ? 10 : 0.1);
    
    totalCost += dbCost;
  }

  // Kubernetes costs
  if (config.kubernetes && config.kubernetes.clusterCount > 0) {
    totalCost += config.kubernetes.clusterCount * 75; // $75 per cluster
  }

  // Firewall costs
  if (config.firewall) {
    let fwCost = (config.firewall.instances || 0) * 30;
    fwCost += (config.firewall.waf || 0) * 20;
    fwCost += (config.firewall.ips || 0) * 25;
    totalCost += fwCost;
  }

  // Metrics costs
  if (config.metrics) {
    totalCost += (config.metrics.metricCount || 0) * 0.5;
  }

  // API costs
  if (config.api) {
    const apiCost = ((config.api.metricRequests || 0) + 
                    (config.api.requested || 0) + 
                    (config.api.otherApiRequests || 0)) * 0.001;
    totalCost += apiCost;
  }

  // Antivirus costs
  if (config.antivirus && config.antivirus.enabled === 'yes') {
    totalCost += (config.antivirus.instances || 0) * 15;
  }

  return Math.round(totalCost * 100) / 100; // Round to 2 decimal places
}

// Send configuration email
async function sendConfigurationEmail(email, configuration, configId) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const emailContent = generateEmailContent(configuration, configId);

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Vensysco Cloud Configuration',
      html: emailContent
    });

  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
}

// Generate email content
function generateEmailContent(config, configId) {
  const totalCost = calculateTotalCost(config);
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Your Vensysco Cloud Configuration</h2>
      <p>Thank you for using our cloud services configurator. Here's your configuration summary:</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Configuration ID: ${configId}</h3>
        <p><strong>Estimated Monthly Cost: $${totalCost}</strong></p>
      </div>

      <div style="margin: 20px 0;">
        <h4>Compute Configuration:</h4>
        <ul>
          <li>Instance Type: ${config.compute?.instanceType || 'Not configured'}</li>
          <li>Machine Size: ${config.compute?.machineSize || 'Not configured'}</li>
          <li>Instance Count: ${config.compute?.instanceCount || 0}</li>
          <li>Location: ${config.compute?.location || 'Not specified'}</li>
        </ul>
      </div>

      <div style="margin: 20px 0;">
        <h4>Storage Configuration:</h4>
        <ul>
          <li>Block Storage: ${config.storage?.blockStorage ? 'Enabled' : 'Disabled'}</li>
          <li>Object Storage: ${config.storage?.objectStorage ? 'Enabled' : 'Disabled'}</li>
          <li>Archive Storage: ${config.storage?.archiveStorage ? 'Enabled' : 'Disabled'}</li>
        </ul>
      </div>

      <p style="margin-top: 30px;">
        To proceed with this configuration or make changes, please contact our sales team at 
        <a href="mailto:sales@vensysco.com">sales@vensysco.com</a> or call 1122334455.
      </p>

      <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
        This is an automated email from Vensysco Cloud. Please do not reply to this email.
      </p>
    </div>
  `;
}

module.exports = router;