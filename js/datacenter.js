document.addEventListener('DOMContentLoaded', () => {
  // Authentication check
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // DOM Elements
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-design');
  const typeCards = document.querySelectorAll('.type-card');
  const rackCountSlider = document.getElementById('rack-count');
  const rackValue = document.getElementById('rack-value');
  const powerUsageSlider = document.getElementById('power-usage');
  const powerValue = document.getElementById('power-value');
  const coolingSelect = document.getElementById('cooling');
  const redundancySelect = document.getElementById('redundancy');
  const securitySelect = document.getElementById('security');
  const remoteMonitoring = document.getElementById('remote-monitoring');
  const onSiteSupport = document.getElementById('on-site-support');
  const projectName = document.getElementById('project-name');
  const notes = document.getElementById('notes');
  const logoutBtn = document.getElementById('logout-btn');
  const dataCenterList = document.getElementById('data-center-list');

  // Summary fields
  const summaryFields = {
    type: document.getElementById('summary-type'),
    racks: document.getElementById('summary-racks'),
    power: document.getElementById('summary-power'),
    cooling: document.getElementById('summary-cooling'),
    redundancy: document.getElementById('summary-redundancy'),
    security: document.getElementById('summary-security'),
    remote: document.getElementById('summary-remote'),
    onsite: document.getElementById('summary-onsite')
  };

  let currentStep = 0;

  // Initialize the form
  function initForm() {
    updateStep();
    updateSummary();
    loadDataCenters();
  }

  // Tab navigation
  function setupTabs() {
    tabBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        currentStep = index;
        updateStep();
        updateSummary();
      });
    });
  }

  // Previous/Next buttons
  function setupNavigation() {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateStep();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentStep < tabContents.length - 1) {
        currentStep++;
        updateStep();
      }
    });
  }

  // Update step visibility
  function updateStep() {
    tabContents.forEach((content, index) => {
      content.classList.toggle('active', index === currentStep);
    });
    
    tabBtns.forEach((btn, index) => {
      btn.classList.toggle('active', index === currentStep);
    });

    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
    nextBtn.style.display = currentStep === tabContents.length - 1 ? 'none' : 'inline-block';
  }

  // Type selection
  function setupTypeSelection() {
    typeCards.forEach(card => {
      card.addEventListener('click', () => {
        typeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        updateSummary();
      });
    });
  }

  // Slider updates
  function setupSliders() {
    rackCountSlider.addEventListener('input', () => {
      rackValue.textContent = rackCountSlider.value;
      updateSummary();
    });

    powerUsageSlider.addEventListener('input', () => {
      powerValue.textContent = powerUsageSlider.value;
      updateSummary();
    });
  }

  // Form element listeners
  function setupFormListeners() {
    coolingSelect.addEventListener('change', updateSummary);
    redundancySelect.addEventListener('change', updateSummary);
    securitySelect.addEventListener('change', updateSummary);
    remoteMonitoring.addEventListener('change', updateSummary);
    onSiteSupport.addEventListener('change', updateSummary);
  }

  // Update summary section
  function updateSummary() {
    // Type
    const selectedTypeCard = document.querySelector('.type-card.active');
    summaryFields.type.textContent = selectedTypeCard ? 
      selectedTypeCard.dataset.type.charAt(0).toUpperCase() + selectedTypeCard.dataset.type.slice(1) : 
      'Not selected';

    // Racks
    summaryFields.racks.textContent = rackCountSlider.value;

    // Power
    summaryFields.power.textContent = `${powerUsageSlider.value} kW`;

    // Cooling
    summaryFields.cooling.textContent = coolingSelect.options[coolingSelect.selectedIndex].text;

    // Redundancy
    summaryFields.redundancy.textContent = redundancySelect.options[redundancySelect.selectedIndex].text;

    // Security
    summaryFields.security.textContent = securitySelect.options[securitySelect.selectedIndex].text;

    // Remote Monitoring
    summaryFields.remote.textContent = remoteMonitoring.checked ? 'Yes' : 'No';

    // On-site Support
    summaryFields.onsite.textContent = onSiteSupport.checked ? 'Yes' : 'No';
  }

  // Form submission
  function setupFormSubmission() {
    document.getElementById('designer-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate required fields
      if (!projectName.value.trim()) {
        alert('Please enter a project name.');
        return;
      }

      const selectedTypeCard = document.querySelector('.type-card.active');
      if (!selectedTypeCard) {
        alert('Please select a data center type.');
        return;
      }

      // Prepare payload
      const payload = {
        projectName: projectName.value.trim(),
        type: selectedTypeCard.dataset.type,
        racks: parseInt(rackCountSlider.value),
        power: parseInt(powerUsageSlider.value),
        cooling: coolingSelect.value,
        redundancy: redundancySelect.value,
        security: securitySelect.value,
        remoteMonitoring: remoteMonitoring.checked,
        onSiteSupport: onSiteSupport.checked,
        notes: notes.value.trim(),
        estimatedCost: calculateEstimatedCost()
      };

      try {
        const response = await fetch('/api/datacenters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to save data center');
        }

        const result = await response.json();
        alert('Data center configuration saved successfully!');
        loadDataCenters();
        resetForm();
      } catch (error) {
        console.error('Error saving data center:', error);
        alert(`Error: ${error.message}`);
      }
    });
  }

  // Calculate estimated cost
  function calculateEstimatedCost() {
    const racks = parseInt(rackCountSlider.value);
    const power = parseInt(powerUsageSlider.value);
    const selectedTypeCard = document.querySelector('.type-card.active');
    const type = selectedTypeCard ? selectedTypeCard.dataset.type : 'modular';
    
    // Base cost calculation
    let cost = racks * 1000 + power * 10;
    
    // Adjust for data center type
    if (type === 'traditional') {
      cost *= 1.2; // Traditional is 20% more expensive
    }
    
    // Adjust for cooling type
    if (coolingSelect.value === 'liquid') {
      cost += power * 5; // Additional $5 per kW for liquid cooling
    } else if (coolingSelect.value === 'hybrid') {
      cost += power * 3; // Additional $3 per kW for hybrid cooling
    }
    
    // Adjust for redundancy
    if (redundancySelect.value === 'n+1') {
      cost *= 1.1; // 10% more for N+1
    } else if (redundancySelect.value === '2n') {
      cost *= 1.3; // 30% more for 2N
    } else if (redundancySelect.value === '2n+1') {
      cost *= 1.5; // 50% more for 2N+1
    }
    
    // Adjust for security
    if (securitySelect.value === 'standard') {
      cost += racks * 200; // $200 per rack for standard security
    } else if (securitySelect.value === 'high') {
      cost += racks * 500; // $500 per rack for high security
    }
    
    // Add services costs
    if (remoteMonitoring.checked) {
      cost += racks * 50; // $50 per rack for remote monitoring
    }
    
    if (onSiteSupport.checked) {
      cost += racks * 100; // $100 per rack for on-site support
    }
    
    return Math.round(cost);
  }

  // Reset form
  function resetForm() {
    document.getElementById('designer-form').reset();
    typeCards.forEach(c => c.classList.remove('active'));
    rackCountSlider.value = 10;
    powerUsageSlider.value = 100;
    rackValue.textContent = '10';
    powerValue.textContent = '100';
    currentStep = 0;
    updateStep();
    updateSummary();
  }

  // Load saved data centers
  async function loadDataCenters() {
    try {
      const response = await fetch('/api/datacenters', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data centers');
      }

      const dataCenters = await response.json();
      renderDataCenterList(dataCenters);
    } catch (error) {
      console.error('Error loading data centers:', error);
      dataCenterList.innerHTML = '<p>Error loading data centers. Please try again later.</p>';
    }
  }

  // Render data center list
  function renderDataCenterList(list) {
    if (list.length === 0) {
      dataCenterList.innerHTML = '<p>No saved data centers yet.</p>';
      return;
    }

    dataCenterList.innerHTML = '';
    list.forEach(dc => {
      const card = document.createElement('div');
      card.className = 'dc-card';
      card.innerHTML = `
        <h4>${dc.projectName}</h4>
        <p><strong>Type:</strong> ${dc.type.charAt(0).toUpperCase() + dc.type.slice(1)}</p>
        <p><strong>Racks:</strong> ${dc.racks}</p>
        <p><strong>Power:</strong> ${dc.power} kW</p>
        <p><strong>Cooling:</strong> ${dc.cooling.charAt(0).toUpperCase() + dc.cooling.slice(1)}</p>
        <p><strong>Redundancy:</strong> ${dc.redundancy}</p>
        <p><strong>Security:</strong> ${dc.security.charAt(0).toUpperCase() + dc.security.slice(1)}</p>
        <p><strong>Remote Monitoring:</strong> ${dc.remoteMonitoring ? 'Yes' : 'No'}</p>
        <p><strong>On-site Support:</strong> ${dc.onSiteSupport ? 'Yes' : 'No'}</p>
        <p><strong>Notes:</strong> ${dc.notes || '—'}</p>
        <p><strong>Estimated Cost:</strong> ₹${dc.estimatedCost.toLocaleString()}</p>
        <div class="dc-actions">
          <button class="dc-delete" data-id="${dc._id}">Delete</button>
        </div>
      `;
      dataCenterList.appendChild(card);

      // Add delete handler
      card.querySelector('.dc-delete').addEventListener('click', () => deleteDataCenter(dc._id));
    });
  }

  // Delete data center
  async function deleteDataCenter(id) {
    if (!confirm('Are you sure you want to delete this data center configuration?')) {
      return;
    }

    try {
      const response = await fetch(`/api/datacenters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete data center');
      }

      alert('Data center configuration deleted successfully!');
      loadDataCenters();
    } catch (error) {
      console.error('Error deleting data center:', error);
      alert(`Error: ${error.message}`);
    }
  }

  // Logout
  function setupLogout() {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      window.location.href = '/login.html';
    });
  }

  // Initialize all functionality
  setupTabs();
  setupNavigation();
  setupTypeSelection();
  setupSliders();
  setupFormListeners();
  setupFormSubmission();
  setupLogout();
  initForm();
});