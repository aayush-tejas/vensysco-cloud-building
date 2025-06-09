document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // DOM Elements
  const navItems = document.querySelectorAll('.dashboard-nav li');
  const panels = document.querySelectorAll('.panel');
  const emailInput = document.getElementById('user-email');
  const saveBtn = document.getElementById('save-config');
  const refreshBtn = document.getElementById('refresh-cost');

  // Configuration state
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
    // Compute Listeners
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

    // Storage Listeners
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

    // Network Listeners
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

    // Kubernetes Listeners
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

    // DB Listeners
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

    // Firewall Listeners
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

    // Metrics Listeners
    document.getElementById('metrics-count').addEventListener('input', (e) => {
      config.metrics.metricCount = parseInt(e.target.value) || 0;
      updateConfig();
    });

    // API Listeners
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

    // Antivirus Listeners
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
    refreshBtn.addEventListener('click', () => {
      calculateCosts();
      updateSummary();
    });
  }

  // Calculate costs
  function calculateCosts() {
    // Compute costs
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
    
    switch (config.compute.instanceType) {
      case 'compute-optimized': computeCost *= 1.3; break;
      case 'memory-optimized': computeCost *= 1.2; break;
      case 'gpu-optimized': computeCost *= 2.5; break;
    }
    
    const bootDiskCost = config.compute.bootDiskSize * 0.1;
    const ipCost = (config.compute.ipv4 ? 5 : 0) + (config.compute.ipv6 ? 2 : 0);
    let totalComputeCost = (computeCost + bootDiskCost + ipCost) * config.compute.instanceCount;
    
    switch (config.compute.committedUsage) {
      case '1-year': totalComputeCost *= 0.7; break;
      case '3-year': totalComputeCost *= 0.5; break;
    }

    // Storage costs
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

    // Update DOM
    document.getElementById('cost-compute').textContent = `$${totalComputeCost.toFixed(2)}`;
    document.getElementById('cost-storage').textContent = `$${storageCost.toFixed(2)}`;
    const totalCost = totalComputeCost + storageCost;
    document.getElementById('cost-total').textContent = `$${totalCost.toFixed(2)}`;
  }

  // Update summary
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
      k8sDesc += ` ("${config.kubernetes.description}")`;
    }
    document.getElementById('summary-kubernetes').textContent = k8sDesc || 'No clusters configured';

    // DB summary
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

  // Save configuration
  async function saveConfiguration() {
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      const response = await fetch('/api/cloud-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          configuration: config
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(`Configuration saved successfully! An email has been sent to ${email} with your configuration details.`);
        emailInput.value = '';
      } else {
        alert(result.message || 'Error saving configuration. Please try again.');
      }

    } catch (error) {
      console.error('Save configuration error:', error);
      alert('Error saving configuration. Please try again.');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fas fa-envelope"></i> Email Configuration';
    }
  }

  // Validate email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Update config
  function updateConfig() {
    calculateCosts();
    updateSummary();
  }

  // Initialize
  setupNavigation();
  setupFormListeners();
  calculateCosts();
  updateSummary();
});