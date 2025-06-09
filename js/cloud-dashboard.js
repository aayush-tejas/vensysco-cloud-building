document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const navItems = document.querySelectorAll('.dashboard-nav li');
  const panels = document.querySelectorAll('.panel');
  const emailInput = document.getElementById('user-email');
  const saveBtn = document.getElementById('save-config');
  const exportBtn = document.getElementById('export-config');
  const refreshBtn = document.getElementById('refresh-cost');

  // Configuration state with all new fields
  const config = {
    compute: {
      instanceType: 'general',
      os: 'ubuntu-22',
      machineSize: 'medium',
      customVcpu: 4,
      customMemory: 16,
      bootDiskSize: 50,
      location: 'us-east-1',
      instanceCount: 1,
      ipv4: true,
      ipv6: false,
      committedUsage: 'none'
    },
    storage: {
      blockStorage: true,
      blockType: 'ssd',
      blockSize: 100,
      objectStorage: false,
      objectSize: 100,
      archiveStorage: false,
      archiveSize: 100,
      backupFrequency: 'none',
      snapshotPolicy: 'none'
    },
    network: {
      externalTx: 0,
      externalRx: 0,
      highAvailability: 'no',
      dhcp: 'no',
      loadBalancer: 'no',
      nat: 'no',
      routing: 'no',
      bgpRouting: 'no',
      firewallRules: '',
      l2vpn: '',
      ipv4Count: 0
    },
    kubernetes: {
      description: '',
      clusterCount: 0,
      region: ''
    },
    db: {
      dbList: '',
      nodes: 0,
      machineType: '',
      storageSize: 0,
      storageUnit: 'GB',
      pricing: ''
    },
    firewall: {
      instances: 0,
      waf: 0,
      ips: 0,
      ipsec: 'no',
      sslVpn: 'no',
      l2vpn: 'no',
      ddos: 'no',
      iam: ''
    },
    metrics: {
      metricCount: 0
    },
    api: {
      metricRequests: 0,
      requested: 0,
      otherApiRequests: 0
    },
    antivirus: {
      enabled: 'no',
      instances: 0,
      machineFamily: '',
      machineType: '',
      location: '',
      ipv6Count: 0,
      ipv4Count: 0
    }
  };

  // Set up navigation between panels
  function setupNavigation() {
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        // Update active nav item
        navItems.forEach(navItem => navItem.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding panel
        const section = item.dataset.section;
        panels.forEach(panel => panel.classList.remove('active'));
        document.getElementById(`${section}-panel`).classList.add('active');
      });
    });
  }

  // Set up all form listeners
  function setupFormListeners() {
    // ----- Compute Listeners -----
    document.getElementById('instance-type').addEventListener('change', (e) => {
      config.compute.instanceType = e.target.value;
      updateConfig();
    });
    document.getElementById('operating-system').addEventListener('change', (e) => {
      config.compute.os = e.target.value;
      updateConfig();
    });
    document.getElementById('machine-size').addEventListener('change', (e) => {
      config.compute.machineSize = e.target.value;
      const customFields = document.querySelectorAll('.custom-size');
      customFields.forEach(field => {
        field.style.display = e.target.value === 'custom' ? 'block' : 'none';
      });
      updateConfig();
    });
    document.getElementById('custom-vcpu').addEventListener('input', (e) => {
      config.compute.customVcpu = parseInt(e.target.value);
      document.getElementById('custom-vcpu-value').textContent = e.target.value;
      updateConfig();
    });
    document.getElementById('custom-memory').addEventListener('input', (e) => {
      config.compute.customMemory = parseInt(e.target.value);
      document.getElementById('custom-memory-value').textContent = e.target.value;
      updateConfig();
    });
    document.getElementById('boot-disk-size').addEventListener('input', (e) => {
      config.compute.bootDiskSize = parseInt(e.target.value);
      document.getElementById('boot-disk-value').textContent = e.target.value;
      updateConfig();
    });
    document.getElementById('data-center-location').addEventListener('change', (e) => {
      config.compute.location = e.target.value;
      updateConfig();
    });
    document.getElementById('instance-count').addEventListener('input', (e) => {
      config.compute.instanceCount = parseInt(e.target.value);
      document.getElementById('instance-count-value').textContent = e.target.value;
      updateConfig();
    });
    document.getElementById('enable-ipv4').addEventListener('change', (e) => {
      config.compute.ipv4 = e.target.checked;
      updateConfig();
    });
    document.getElementById('enable-ipv6').addEventListener('change', (e) => {
      config.compute.ipv6 = e.target.checked;
      updateConfig();
    });
    document.getElementById('committed-usage').addEventListener('change', (e) => {
      config.compute.committedUsage = e.target.value;
      updateConfig();
    });

    // ----- Storage Listeners -----
    document.getElementById('enable-block-storage').addEventListener('change', (e) => {
      config.storage.blockStorage = e.target.checked;
      document.querySelectorAll('.block-storage-config').forEach(el => {
        el.style.display = e.target.checked ? 'block' : 'none';
      });
      updateConfig();
    });
    document.getElementById('enable-object-storage').addEventListener('change', (e) => {
      config.storage.objectStorage = e.target.checked;
      document.querySelectorAll('.object-storage-config').forEach(el => {
        el.style.display = e.target.checked ? 'block' : 'none';
      });
      updateConfig();
    });
    document.getElementById('enable-archive-storage').addEventListener('change', (e) => {
      config.storage.archiveStorage = e.target.checked;
      document.querySelectorAll('.archive-storage-config').forEach(el => {
        el.style.display = e.target.checked ? 'block' : 'none';
      });
      updateConfig();
    });
    document.getElementById('block-storage-type').addEventListener('change', (e) => {
      config.storage.blockType = e.target.value;
      updateConfig();
    });
    document.getElementById('block-storage-size').addEventListener('input', (e) => {
      config.storage.blockSize = parseInt(e.target.value);
      document.getElementById('block-storage-value').textContent = e.target.value;
      updateConfig();
    });
    document.getElementById('object-storage-size').addEventListener('input', (e) => {
      config.storage.objectSize = parseInt(e.target.value);
      document.getElementById('object-storage-value').textContent = e.target.value;
      updateConfig();
    });
    document.getElementById('archive-storage-size').addEventListener('input', (e) => {
      config.storage.archiveSize = parseInt(e.target.value);
      document.getElementById('archive-storage-value').textContent = e.target.value;
      updateConfig();
    });
    document.getElementById('backup-frequency').addEventListener('change', (e) => {
      config.storage.backupFrequency = e.target.value;
      updateConfig();
    });
    document.getElementById('snapshot-policy').addEventListener('change', (e) => {
      config.storage.snapshotPolicy = e.target.value;
      updateConfig();
    });

    // ----- Network Listeners -----
    document.getElementById('external-tx').addEventListener('input', (e) => {
      config.network.externalTx = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('external-rx').addEventListener('input', (e) => {
      config.network.externalRx = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('high-availability').addEventListener('change', (e) => {
      config.network.highAvailability = e.target.value;
      updateConfig();
    });
    document.getElementById('dhcp').addEventListener('change', (e) => {
      config.network.dhcp = e.target.value;
      updateConfig();
    });
    document.getElementById('load-balancer').addEventListener('change', (e) => {
      config.network.loadBalancer = e.target.value;
      updateConfig();
    });
    document.getElementById('nat').addEventListener('change', (e) => {
      config.network.nat = e.target.value;
      updateConfig();
    });
    document.getElementById('routing').addEventListener('change', (e) => {
      config.network.routing = e.target.value;
      updateConfig();
    });
    document.getElementById('bgp-routing').addEventListener('change', (e) => {
      config.network.bgpRouting = e.target.value;
      updateConfig();
    });
    document.getElementById('firewall-rules').addEventListener('input', (e) => {
      config.network.firewallRules = e.target.value;
      updateConfig();
    });
    document.getElementById('l2vpn-network').addEventListener('change', (e) => {
      config.network.l2vpn = e.target.value;
      updateConfig();
    });
    document.getElementById('ipv4-count-network').addEventListener('input', (e) => {
      config.network.ipv4Count = parseInt(e.target.value) || 0;
      updateConfig();
    });

    // ----- Kubernetes Listeners -----
    document.getElementById('k8s-description').addEventListener('input', (e) => {
      config.kubernetes.description = e.target.value;
      updateConfig();
    });
    document.getElementById('cluster-count').addEventListener('input', (e) => {
      config.kubernetes.clusterCount = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('k8s-region').addEventListener('change', (e) => {
      config.kubernetes.region = e.target.value;
      updateConfig();
    });

    // ----- DB Listeners -----
    document.getElementById('db-list').addEventListener('change', (e) => {
      config.db.dbList = e.target.value;
      updateConfig();
    });
    document.getElementById('db-nodes').addEventListener('input', (e) => {
      config.db.nodes = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('db-machine-type').addEventListener('change', (e) => {
      config.db.machineType = e.target.value;
      updateConfig();
    });
    document.getElementById('db-storage-size').addEventListener('input', (e) => {
      config.db.storageSize = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('db-storage-unit').addEventListener('change', (e) => {
      config.db.storageUnit = e.target.value;
      updateConfig();
    });
    document.getElementById('db-pricing').addEventListener('change', (e) => {
      config.db.pricing = e.target.value;
      updateConfig();
    });

    // ----- Firewall Listeners -----
    document.getElementById('fw-instances').addEventListener('input', (e) => {
      config.firewall.instances = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('fw-waf').addEventListener('input', (e) => {
      config.firewall.waf = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('fw-ips').addEventListener('input', (e) => {
      config.firewall.ips = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('fw-ipsec').addEventListener('change', (e) => {
      config.firewall.ipsec = e.target.value;
      updateConfig();
    });
    document.getElementById('fw-sslvpn').addEventListener('change', (e) => {
      config.firewall.sslVpn = e.target.value;
      updateConfig();
    });
    document.getElementById('fw-l2vpn').addEventListener('change', (e) => {
      config.firewall.l2vpn = e.target.value;
      updateConfig();
    });
    document.getElementById('fw-ddos').addEventListener('change', (e) => {
      config.firewall.ddos = e.target.value;
      updateConfig();
    });
    document.getElementById('fw-iam').addEventListener('change', (e) => {
      config.firewall.iam = e.target.value;
      updateConfig();
    });

    // ----- Metrics Listeners -----
    document.getElementById('metrics-count').addEventListener('input', (e) => {
      config.metrics.metricCount = parseInt(e.target.value) || 0;
      updateConfig();
    });

    // ----- API Listeners -----
    document.getElementById('api-metric-requests').addEventListener('input', (e) => {
      config.api.metricRequests = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('api-requested').addEventListener('input', (e) => {
      config.api.requested = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('api-other-requests').addEventListener('input', (e) => {
      config.api.otherApiRequests = parseInt(e.target.value) || 0;
      updateConfig();
    });

    // ----- Antivirus Listeners -----
    document.getElementById('av-enabled').addEventListener('change', (e) => {
      config.antivirus.enabled = e.target.value;
      updateConfig();
    });
    document.getElementById('av-instances').addEventListener('input', (e) => {
      config.antivirus.instances = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('av-machine-family').addEventListener('change', (e) => {
      config.antivirus.machineFamily = e.target.value;
      updateConfig();
    });
    document.getElementById('av-machine-type').addEventListener('change', (e) => {
      config.antivirus.machineType = e.target.value;
      updateConfig();
    });
    document.getElementById('av-location').addEventListener('change', (e) => {
      config.antivirus.location = e.target.value;
      updateConfig();
    });
    document.getElementById('av-ipv6').addEventListener('input', (e) => {
      config.antivirus.ipv6Count = parseInt(e.target.value) || 0;
      updateConfig();
    });
    document.getElementById('av-ipv4').addEventListener('input', (e) => {
      config.antivirus.ipv4Count = parseInt(e.target.value) || 0;
      updateConfig();
    });

    // Button listeners
    saveBtn.addEventListener('click', saveConfiguration);
    exportBtn.addEventListener('click', exportConfiguration);
    refreshBtn.addEventListener('click', () => {
      calculateCosts();
      updateSummary();
    });
  }

  // Update cost calculation based on compute & storage (others omitted for brevity)
  function calculateCosts() {
    // Compute costs (same as before)
    let computeCost = 0;
    switch (config.compute.machineSize) {
      case 'small':
        computeCost = 20;
        break;
      case 'medium':
        computeCost = 80;
        break;
      case 'large':
        computeCost = 200;
        break;
      case 'xlarge':
        computeCost = 400;
        break;
      case 'custom':
        computeCost = (config.compute.customVcpu * 5) + (config.compute.customMemory * 0.5);
        break;
    }
    switch (config.compute.instanceType) {
      case 'compute-optimized':
        computeCost *= 1.3;
        break;
      case 'memory-optimized':
        computeCost *= 1.2;
        break;
      case 'gpu-optimized':
        computeCost *= 2.5;
        break;
    }
    const bootDiskCost = config.compute.bootDiskSize * 0.1;
    const ipCost = (config.compute.ipv4 ? 5 : 0) + (config.compute.ipv6 ? 2 : 0);
    let totalComputeCost = (computeCost + bootDiskCost + ipCost) * config.compute.instanceCount;
    switch (config.compute.committedUsage) {
      case '1-year':
        totalComputeCost *= 0.7;
        break;
      case '3-year':
        totalComputeCost *= 0.5;
        break;
    }

    // Storage costs (same as before)
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
    if (config.storage.backupFrequency !== 'none') {
      storageCost += (config.storage.blockStorage ? config.storage.blockSize : 0) * 0.02;
    }
    if (config.storage.snapshotPolicy !== 'none') {
      storageCost += (config.storage.blockStorage ? config.storage.blockSize : 0) * 0.015;
    }

    // Update DOM with computed costs
    document.getElementById('cost-compute').textContent = `$${totalComputeCost.toFixed(2)}`;
    document.getElementById('cost-storage').textContent = `$${storageCost.toFixed(2)}`;
    const totalCost = totalComputeCost + storageCost;
    document.getElementById('cost-total').textContent = `$${totalCost.toFixed(2)}`;
  }

  // Update summary panel with all fields
  function updateSummary() {
    // Compute summary
    let computeDesc = `${config.compute.instanceCount} ${config.compute.instanceType} instance`;
    if (config.compute.instanceCount > 1) computeDesc += 's';
    if (config.compute.machineSize === 'custom') {
      computeDesc += ` (${config.compute.customVcpu} vCPU, ${config.compute.customMemory}GB RAM)`;
    } else {
      computeDesc += ` (${config.compute.machineSize})`;
    }
    computeDesc += `, ${config.compute.bootDiskSize}GB boot disk, ${config.compute.location}`;
    if (config.compute.ipv4 || config.compute.ipv6) {
      computeDesc += ' with ';
      const ips = [];
      if (config.compute.ipv4) ips.push('IPv4');
      if (config.compute.ipv6) ips.push('IPv6');
      computeDesc += ips.join(' + ');
    }
    if (config.compute.committedUsage !== 'none') {
      computeDesc += `, ${config.compute.committedUsage} commitment`;
    }
    document.getElementById('summary-compute').textContent = computeDesc;

    // Storage summary
    let storageDesc = '';
    const storageTypes = [];
    if (config.storage.blockStorage) {
      storageTypes.push(`${config.storage.blockSize}GB ${config.storage.blockType.toUpperCase()} block`);
    }
    if (config.storage.objectStorage) {
      storageTypes.push(`${config.storage.objectSize}GB object`);
    }
    if (config.storage.archiveStorage) {
      storageTypes.push(`${config.storage.archiveSize}GB archive`);
    }
    storageDesc = storageTypes.join(', ');
    if (config.storage.backupFrequency !== 'none') {
      storageDesc += ` with ${config.storage.backupFrequency} backups`;
    }
    if (config.storage.snapshotPolicy !== 'none') {
      storageDesc += ` and ${config.storage.snapshotPolicy} snapshots`;
    }
    document.getElementById('summary-storage').textContent = storageDesc || 'No storage configured';

    // Network summary
    let networkDesc = `TX: ${config.network.externalTx}, RX: ${config.network.externalRx}`;
    networkDesc += `, HA: ${config.network.highAvailability}`;
    networkDesc += `, DHCP: ${config.network.dhcp}, LB: ${config.network.loadBalancer}`;
    networkDesc += `, NAT: ${config.network.nat}, Routing: ${config.network.routing}`;
    networkDesc += `, BGP: ${config.network.bgpRouting}`;
    if (config.network.firewallRules) networkDesc += `, FW Rules: ${config.network.firewallRules}`;
    if (config.network.l2vpn) networkDesc += `, L2 VPN: ${config.network.l2vpn}`;
    networkDesc += `, IPv4 Count: ${config.network.ipv4Count}`;
    document.getElementById('summary-network').textContent = networkDesc;

    // Kubernetes summary
    let k8sDesc = `${config.kubernetes.clusterCount} cluster(s)`;
    if (config.kubernetes.region) {
      k8sDesc += ` in ${config.kubernetes.region}`;
    }
    if (config.kubernetes.description) {
      k8sDesc += ` (“${config.kubernetes.description}”)`;
    }
    document.getElementById('summary-kubernetes').textContent = k8sDesc || 'No clusters configured';

    // DB as a Service summary
    let dbDesc = config.db.dbList ? `${config.db.dbList}` : '';
    if (config.db.nodes) {
      dbDesc += ` with ${config.db.nodes} node(s)`;
    }
    if (config.db.machineType) {
      dbDesc += ` on ${config.db.machineType}`;
    }
    if (config.db.storageSize) {
      dbDesc += `, ${config.db.storageSize}${config.db.storageUnit} storage`;
    }
    if (config.db.pricing) {
      dbDesc += `, ${config.db.pricing}`;
    }
    document.getElementById('summary-db').textContent = dbDesc || 'No DB configured';

    // Firewall summary
    let fwDesc = `${config.firewall.instances} instance(s)`;
    if (config.firewall.waf) {
      fwDesc += `, WAF: ${config.firewall.waf}`;
    }
    if (config.firewall.ips) {
      fwDesc += `, IPS/IDS: ${config.firewall.ips}`;
    }
    fwDesc += `, IPSec: ${config.firewall.ipsec}`;
    fwDesc += `, SSL VPN: ${config.firewall.sslVpn}`;
    fwDesc += `, L2 VPN: ${config.firewall.l2vpn}`;
    fwDesc += `, DDoS: ${config.firewall.ddos}`;
    if (config.firewall.iam) {
      fwDesc += `, IAM: ${config.firewall.iam}`;
    }
    document.getElementById('summary-firewall').textContent = fwDesc || 'No firewall configured';

    // Metrics summary
    let metricsDesc = `${config.metrics.metricCount} metric(s)`;
    document.getElementById('summary-metrics').textContent = metricsDesc || 'No metrics configured';

    // API summary
    let apiDesc = `Metric Requests: ${config.api.metricRequests}`;
    apiDesc += `, Requested: ${config.api.requested}`;
    apiDesc += `, Other Requests: ${config.api.otherApiRequests}`;
    document.getElementById('summary-api').textContent = apiDesc || 'No API configured';

    // Antivirus summary
    let avDesc = `Enabled: ${config.antivirus.enabled}`;
    if (config.antivirus.instances) {
      avDesc += `, ${config.antivirus.instances} instance(s)`;
    }
    if (config.antivirus.machineFamily) {
      avDesc += `, Family: ${config.antivirus.machineFamily}`;
    }
    if (config.antivirus.machineType) {
      avDesc += `, Type: ${config.antivirus.machineType}`;
    }
    if (config.antivirus.location) {
      avDesc += `, Location: ${config.antivirus.location}`;
    }
    avDesc += `, IPv6: ${config.antivirus.ipv6Count}, IPv4: ${config.antivirus.ipv4Count}`;
    document.getElementById('summary-antivirus').textContent = avDesc || 'No antivirus configured';

    // Update total cost in summary
    const totalCost = document.getElementById('cost-total').textContent;
    document.getElementById('summary-cost').textContent = totalCost;
  }

  // Save configuration by emailing a token to user (stub)
  async function saveConfiguration() {
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    try {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      const payload = {
        email,
        configuration: config
      };
      // Replace with real API call as needed
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Configuration saved! A token has been sent to ${email}.`);
    } catch (err) {
      console.error(err);
      alert('Error sending email. Please try again.');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fas fa-envelope"></i> Email Configuration';
    }
  }

  // Export configuration as PDF (stub)
  function exportConfiguration() {
    alert('This would generate and download a PDF of your configuration.');
    // Implement real PDF generation if required
  }

  // Validate email helper
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Called whenever any config field changes
  function updateConfig() {
    calculateCosts();
    updateSummary();
  }

  // Initialize everything
  setupNavigation();
  setupFormListeners();
  calculateCosts();
  updateSummary();
});





//ADDING THE DATA RECOVERY SO BE CAREFUL CONTAINS !!!

document.addEventListener('DOMContentLoaded', () => {
  // Configuration state with new recovery fields
  const config = {
    // Existing configuration...
    recovery: {
      enabled: 'no',
      rpo: '24hours',
      rto: '24hours',
      retention: '7days',
      region: 'same',
      frequency: 'daily',
      validated: false
    }
  };

  // Initialize the dashboard
  function initDashboard() {
    setupNavigation();
    setupFormListeners();
    validateRecoveryRequirements();
    calculateCosts();
    updateSummary();
  }

  // Set up form listeners including new recovery fields
  function setupFormListeners() {
    // Existing listeners...
    
    // Recovery configuration listeners
    document.getElementById('recovery-enabled').addEventListener('change', (e) => {
      config.recovery.enabled = e.target.value;
      const recoveryOptions = document.querySelector('.recovery-options');
      const validationMessage = document.querySelector('.recovery-validation');
      
      if (e.target.value === 'yes') {
        recoveryOptions.style.display = 'block';
        validateRecoveryRequirements();
      } else {
        recoveryOptions.style.display = 'none';
        validationMessage.style.display = 'none';
      }
      updateConfig();
    });
    
    document.getElementById('recovery-point-objective').addEventListener('change', (e) => {
      config.recovery.rpo = e.target.value;
      updateConfig();
    });
    
    document.getElementById('recovery-time-objective').addEventListener('change', (e) => {
      config.recovery.rto = e.target.value;
      updateConfig();
    });
    
    document.getElementById('recovery-retention').addEventListener('change', (e) => {
      config.recovery.retention = e.target.value;
      updateConfig();
    });
    
    document.getElementById('recovery-region').addEventListener('change', (e) => {
      config.recovery.region = e.target.value;
      updateConfig();
    });
    
    document.getElementById('recovery-frequency').addEventListener('change', (e) => {
      config.recovery.frequency = e.target.value;
      updateConfig();
    });
  }

  // Validate recovery requirements
  function validateRecoveryRequirements() {
    const validationMessage = document.querySelector('.recovery-validation');
    const messageElement = document.getElementById('recovery-validation-message');
    
    // Check if storage is configured
    if (config.recovery.enabled === 'yes') {
      if (!config.storage.blockStorage && !config.storage.objectStorage && !config.storage.archiveStorage) {
        config.recovery.validated = false;
        validationMessage.style.display = 'flex';
        messageElement.textContent = 'Please configure at least one storage option before enabling data recovery';
        return;
      }
      
      if (config.storage.backupFrequency === 'none' && config.storage.snapshotPolicy === 'none') {
        config.recovery.validated = false;
        validationMessage.style.display = 'flex';
        messageElement.textContent = 'Please configure backup or snapshot policy before enabling data recovery';
        return;
      }
      
      // All requirements met
      config.recovery.validated = true;
      validationMessage.style.display = 'none';
    }
  }

  // Update cost calculation with recovery costs
  function calculateCosts() {
    // Existing cost calculations...
    
    // Data Recovery costs
    let recoveryCost = 0;
    if (config.recovery.enabled === 'yes' && config.recovery.validated) {
      // Base cost
      recoveryCost = 50; // $50 base
      
      // Add RPO cost
      switch(config.recovery.rpo) {
        case '15min': recoveryCost += 100; break;
        case '1hour': recoveryCost += 75; break;
        case '4hours': recoveryCost += 50; break;
        case '24hours': recoveryCost += 25; break;
      }
      
      // Add RTO cost
      switch(config.recovery.rto) {
        case '1hour': recoveryCost += 100; break;
        case '4hours': recoveryCost += 75; break;
        case '8hours': recoveryCost += 50; break;
        case '24hours': recoveryCost += 25; break;
      }
      
      // Add retention cost
      switch(config.recovery.retention) {
        case '7days': recoveryCost += 20; break;
        case '14days': recoveryCost += 40; break;
        case '30days': recoveryCost += 80; break;
        case '90days': recoveryCost += 200; break;
      }
      
      // Add frequency cost
      switch(config.recovery.frequency) {
        case 'continuous': recoveryCost += 150; break;
        case 'hourly': recoveryCost += 100; break;
        case 'daily': recoveryCost += 50; break;
        case 'weekly': recoveryCost += 25; break;
      }
      
      // Add cross-region cost if not same region
      if (config.recovery.region !== 'same' && config.recovery.region !== config.compute.location) {
        recoveryCost += 75;
      }
    }
    
    // Update DOM with recovery costs
    document.getElementById('cost-recovery').textContent = `$${recoveryCost.toFixed(2)}`;
    
    // Update total cost
    const totalCost = totalComputeCost + storageCost + recoveryCost;
    document.getElementById('cost-total').textContent = `$${totalCost.toFixed(2)}`;
  }

  // Update summary with recovery information
  function updateSummary() {
    // Existing summary updates...
    
    // Recovery summary
    let recoveryDesc = config.recovery.enabled === 'yes' ? 'Enabled' : 'Disabled';
    if (config.recovery.enabled === 'yes' && config.recovery.validated) {
      recoveryDesc += ` (RPO: ${config.recovery.rpo}, RTO: ${config.recovery.rto})`;
      recoveryDesc += `, Retention: ${config.recovery.retention}`;
      recoveryDesc += `, Frequency: ${config.recovery.frequency}`;
      if (config.recovery.region !== 'same') {
        recoveryDesc += `, Recovery Region: ${config.recovery.region}`;
      }
    } else if (config.recovery.enabled === 'yes' && !config.recovery.validated) {
      recoveryDesc += ' (Configuration incomplete)';
    }
    document.getElementById('summary-recovery').textContent = recoveryDesc;
  }

  // Initialize everything
  initDashboard();
});
