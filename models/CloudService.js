const mongoose = require('mongoose');

const CloudServiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  configuration: {
    compute: {
      instanceType: String,
      os: String,
      machineSize: String,
      customVcpu: Number,
      customMemory: Number,
      bootDiskSize: Number,
      location: String,
      instanceCount: Number,
      ipv4: Boolean,
      ipv6: Boolean,
      committedUsage: String
    },
    storage: {
      blockStorage: Boolean,
      blockType: String,
      blockSize: Number,
      objectStorage: Boolean,
      objectSize: Number,
      archiveStorage: Boolean,
      archiveSize: Number,
      backupFrequency: String,
      snapshotPolicy: String
    },
    network: {
      externalTx: Number,
      externalRx: Number,
      highAvailability: String,
      dhcp: String,
      loadBalancer: String,
      nat: String,
      routing: String,
      bgpRouting: String,
      firewallRules: String,
      l2vpn: String,
      ipv4Count: Number
    },
    kubernetes: {
      description: String,
      clusterCount: Number,
      region: String
    },
    db: {
      dbList: String,
      nodes: Number,
      machineType: String,
      storageSize: Number,
      storageUnit: String,
      pricing: String
    },
    firewall: {
      instances: Number,
      waf: Number,
      ips: Number,
      ipsec: String,
      sslVpn: String,
      l2vpn: String,
      ddos: String,
      iam: String
    },
    metrics: {
      metricCount: Number
    },
    api: {
      metricRequests: Number,
      requested: Number,
      otherApiRequests: Number
    },
    antivirus: {
      enabled: String,
      instances: Number,
      machineFamily: String,
      machineType: String,
      location: String,
      ipv6Count: Number,
      ipv4Count: Number
    }
  },
  estimatedCost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'deployed'],
    default: 'submitted'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
CloudServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CloudService', CloudServiceSchema);