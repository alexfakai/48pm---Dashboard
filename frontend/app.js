// 48 Property Marketing Dashboard - Interactive Features

// Filter state management
const filterState = {
  propertyTypes: [],
  locations: [],
  priceCategories: [],
  paymentOptions: []
};

// Property type options
const propertyTypes = ['duplex', 'apartment', 'bungalow', 'terrace'];

// Location options - expanded with popular districts
const locations = ['maitama', 'wuse', 'asokoro', 'gwarinpa', 'jabi', 'kuje', 'idu', 'bwari', 'lokogoma'];

// Price category options
const priceCategories = ['<50M', '<100M', '<200M', '>200M'];

// Payment option options
const paymentOptions = ['mortgage', 'outright', 'installment'];


// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


// Initialize filter button click handlers with event delegation
function initializeFilterHandlers() {
  const filterPanel = document.querySelector('.filter-panel');
  
  // Use event delegation on the parent container
  filterPanel.addEventListener('click', function(event) {
    const button = event.target.closest('.filter-btn');
    if (!button) return;
    
    const filterType = button.getAttribute('data-filter');
    const filterValue = button.getAttribute('data-value');
    
    // Toggle selected class for visual feedback
    button.classList.toggle('selected');
    
    // Update filter state
    updateFilterState(filterType, filterValue, button.classList.contains('selected'));
    
    // Update filter chips and results
    updateFilterChips();
    applyAllFilters();
  });
}

// Update filter state based on button selection
function updateFilterState(filterType, value, isSelected) {
  let stateArray;
  
  switch(filterType) {
    case 'type':
      stateArray = filterState.propertyTypes;
      break;
    case 'location':
      stateArray = filterState.locations;
      break;
    case 'price':
      stateArray = filterState.priceCategories;
      break;
    case 'payment':
      stateArray = filterState.paymentOptions;
      break;
    default:
      return;
  }
  
  if (isSelected) {
    // Add to filter state if not already present
    if (!stateArray.includes(value)) {
      stateArray.push(value);
    }
  } else {
    // Remove from filter state
    const index = stateArray.indexOf(value);
    if (index > -1) {
      stateArray.splice(index, 1);
    }
  }
}


// Initialize map zone highlighting with event delegation
function initializeMapZones() {
  const filterPanel = document.querySelector('.filter-panel');
  
  // Use event delegation for location buttons
  filterPanel.addEventListener('click', function(event) {
    const button = event.target.closest('.location-btn');
    if (!button) return;
    
    const location = button.getAttribute('data-value');
    const isSelected = button.classList.contains('selected');
    
    // Debounced map zone update
    debouncedMapZoneUpdate(location, isSelected);
  });
}

// Update map zone styling based on location selection
function updateMapZone(location, isSelected) {
  const hotspot = document.getElementById(`hotspot-${location}`);
  
  if (!hotspot) return;
  
  // Find the label within the hotspot
  const label = hotspot.querySelector('.hotspot-label');
  
  if (!label) return;
  
  if (isSelected) {
    // Apply gold accent to selected label
    label.classList.add('active');
  } else {
    // Reset to default state
    label.classList.remove('active');
  }
}

// Debounced version of map zone update
const debouncedMapZoneUpdate = debounce(updateMapZone, 50);


// Update filter chips display
function updateFilterChips() {
  const chipsContainer = document.querySelector('.filter-chips');
  const clearAllBtn = document.querySelector('.clear-all-btn');
  
  if (!chipsContainer) return;
  
  // Clear existing chips
  chipsContainer.innerHTML = '';
  
  // Collect all active filters
  const allFilters = [];
  
  // Add property type filters
  filterState.propertyTypes.forEach(type => {
    allFilters.push({ type: 'type', value: type, label: capitalizeFirst(type) });
  });
  
  // Add location filters
  filterState.locations.forEach(location => {
    allFilters.push({ type: 'location', value: location, label: capitalizeFirst(location) });
  });
  
  // Add price filters
  filterState.priceCategories.forEach(price => {
    allFilters.push({ type: 'price', value: price, label: price });
  });
  
  // Add payment filters
  filterState.paymentOptions.forEach(payment => {
    allFilters.push({ type: 'payment', value: payment, label: capitalizeFirst(payment) });
  });
  
  // Show/hide clear all button
  if (allFilters.length > 0) {
    clearAllBtn.classList.remove('hidden');
  } else {
    clearAllBtn.classList.add('hidden');
  }
  
  // Create chip elements
  allFilters.forEach(filter => {
    const chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.innerHTML = `
      <span>${filter.label}</span>
      <span class="filter-chip-remove" data-filter-type="${filter.type}" data-filter-value="${filter.value}"></span>
    `;
    chipsContainer.appendChild(chip);
  });
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize filter chip removal handlers
function initializeFilterChipHandlers() {
  const chipsContainer = document.querySelector('.filter-chips');
  
  chipsContainer.addEventListener('click', function(event) {
    const removeBtn = event.target.closest('.filter-chip-remove');
    if (!removeBtn) return;
    
    const filterType = removeBtn.getAttribute('data-filter-type');
    const filterValue = removeBtn.getAttribute('data-filter-value');
    
    // Find and deselect the corresponding button
    const button = document.querySelector(`.filter-btn[data-filter="${filterType}"][data-value="${filterValue}"]`);
    if (button) {
      button.classList.remove('selected');
    }
    
    // Update filter state
    updateFilterState(filterType, filterValue, false);
    
    // Update map label if it's a location
    if (filterType === 'location') {
      updateMapZone(filterValue, false);
    }
    
    // Update chips and results
    updateFilterChips();
    applyAllFilters();
  });
}

// Initialize clear all button handler
function initializeClearAllHandler() {
  const clearAllBtn = document.querySelector('.clear-all-btn');
  
  clearAllBtn.addEventListener('click', function() {
    // Deselect all filter buttons
    document.querySelectorAll('.filter-btn.selected').forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // Clear all map labels
    filterState.locations.forEach(location => {
      updateMapZone(location, false);
    });
    
    // Clear filter state
    filterState.propertyTypes = [];
    filterState.locations = [];
    filterState.priceCategories = [];
    filterState.paymentOptions = [];
    
    // Update UI
    updateFilterChips();
    showPlaceholder();
  });
}

// Apply all filters to properties
function applyAllFilters() {
  // If no filters are selected, show placeholder
  const hasFilters = filterState.propertyTypes.length > 0 || 
                     filterState.locations.length > 0 || 
                     filterState.priceCategories.length > 0 || 
                     filterState.paymentOptions.length > 0;
  
  if (!hasFilters) {
    showPlaceholder();
    return;
  }
  
  // Filter properties based on all active filters
  let filteredProperties = mockProperties;
  
  // Filter by property type
  if (filterState.propertyTypes.length > 0) {
    filteredProperties = filteredProperties.filter(property => 
      filterState.propertyTypes.includes(property.type)
    );
  }
  
  // Filter by location
  if (filterState.locations.length > 0) {
    filteredProperties = filteredProperties.filter(property => 
      filterState.locations.includes(property.location)
    );
  }
  
  // Filter by price category
  if (filterState.priceCategories.length > 0) {
    filteredProperties = filteredProperties.filter(property => 
      filterState.priceCategories.includes(property.priceCategory)
    );
  }
  
  // Filter by payment options
  if (filterState.paymentOptions.length > 0) {
    filteredProperties = filteredProperties.filter(property => 
      filterState.paymentOptions.some(option => property.paymentOptions.includes(option))
    );
  }
  
  updateDetailsPanel(filteredProperties);
}


// Mock property data (3-5 properties per location)
const mockProperties = [
  // Kuje properties
  {
    id: 'kuje-1',
    title: 'Modern Duplex in Kuje',
    type: 'duplex',
    location: 'kuje',
    price: 45000000,
    priceCategory: '<50M',
    paymentOptions: ['mortgage', 'installment'],
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 250
  },
  {
    id: 'kuje-2',
    title: 'Spacious Bungalow',
    type: 'bungalow',
    location: 'kuje',
    price: 35000000,
    priceCategory: '<50M',
    paymentOptions: ['outright', 'installment'],
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 180
  },
  {
    id: 'kuje-3',
    title: 'Luxury Terrace House',
    type: 'terrace',
    location: 'kuje',
    price: 55000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'outright', 'installment'],
    bedrooms: 4,
    bathrooms: 4,
    squareMeters: 220
  },
  
  // Idu properties
  {
    id: 'idu-1',
    title: 'Executive Apartment',
    type: 'apartment',
    location: 'idu',
    price: 75000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'installment'],
    bedrooms: 3,
    bathrooms: 3,
    squareMeters: 160
  },
  {
    id: 'idu-2',
    title: 'Premium Duplex',
    type: 'duplex',
    location: 'idu',
    price: 120000000,
    priceCategory: '<200M',
    paymentOptions: ['mortgage', 'outright'],
    bedrooms: 5,
    bathrooms: 4,
    squareMeters: 320
  },
  {
    id: 'idu-3',
    title: 'Contemporary Terrace',
    type: 'terrace',
    location: 'idu',
    price: 85000000,
    priceCategory: '<100M',
    paymentOptions: ['installment', 'outright'],
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 200
  },
  {
    id: 'idu-4',
    title: 'Elegant Bungalow',
    type: 'bungalow',
    location: 'idu',
    price: 65000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'installment'],
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 190
  },
  
  // Bwari properties
  {
    id: 'bwari-1',
    title: 'Luxury Villa Duplex',
    type: 'duplex',
    location: 'bwari',
    price: 250000000,
    priceCategory: '>200M',
    paymentOptions: ['outright', 'mortgage'],
    bedrooms: 6,
    bathrooms: 5,
    squareMeters: 450
  },
  {
    id: 'bwari-2',
    title: 'Premium Apartment',
    type: 'apartment',
    location: 'bwari',
    price: 95000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'installment'],
    bedrooms: 3,
    bathrooms: 3,
    squareMeters: 170
  },
  {
    id: 'bwari-3',
    title: 'Exclusive Terrace',
    type: 'terrace',
    location: 'bwari',
    price: 180000000,
    priceCategory: '<200M',
    paymentOptions: ['mortgage', 'outright', 'installment'],
    bedrooms: 5,
    bathrooms: 4,
    squareMeters: 280
  },
  
  // Lokogoma properties
  {
    id: 'lokogoma-1',
    title: 'Modern Apartment Complex',
    type: 'apartment',
    location: 'lokogoma',
    price: 68000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'installment'],
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 150
  },
  {
    id: 'lokogoma-2',
    title: 'Family Duplex',
    type: 'duplex',
    location: 'lokogoma',
    price: 110000000,
    priceCategory: '<200M',
    paymentOptions: ['mortgage', 'outright', 'installment'],
    bedrooms: 5,
    bathrooms: 4,
    squareMeters: 300
  },
  {
    id: 'lokogoma-3',
    title: 'Cozy Bungalow',
    type: 'bungalow',
    location: 'lokogoma',
    price: 48000000,
    priceCategory: '<50M',
    paymentOptions: ['installment', 'outright'],
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 175
  },
  {
    id: 'lokogoma-4',
    title: 'Stylish Terrace Home',
    type: 'terrace',
    location: 'lokogoma',
    price: 92000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'installment'],
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 210
  },
  {
    id: 'lokogoma-5',
    title: 'Penthouse Apartment',
    type: 'apartment',
    location: 'lokogoma',
    price: 135000000,
    priceCategory: '<200M',
    paymentOptions: ['outright', 'mortgage'],
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 200
  },
  
  // Maitama properties (Premium)
  {
    id: 'maitama-1',
    title: 'Luxury Maitama Villa',
    type: 'duplex',
    location: 'maitama',
    price: 350000000,
    priceCategory: '>200M',
    paymentOptions: ['outright', 'mortgage'],
    bedrooms: 7,
    bathrooms: 6,
    squareMeters: 550
  },
  {
    id: 'maitama-2',
    title: 'Executive Terrace',
    type: 'terrace',
    location: 'maitama',
    price: 280000000,
    priceCategory: '>200M',
    paymentOptions: ['outright', 'mortgage'],
    bedrooms: 6,
    bathrooms: 5,
    squareMeters: 480
  },
  {
    id: 'maitama-3',
    title: 'Premium Apartment',
    type: 'apartment',
    location: 'maitama',
    price: 195000000,
    priceCategory: '<200M',
    paymentOptions: ['mortgage', 'outright'],
    bedrooms: 4,
    bathrooms: 4,
    squareMeters: 220
  },
  
  // Wuse properties (Premium)
  {
    id: 'wuse-1',
    title: 'Wuse Diplomatic Residence',
    type: 'duplex',
    location: 'wuse',
    price: 320000000,
    priceCategory: '>200M',
    paymentOptions: ['outright', 'mortgage'],
    bedrooms: 6,
    bathrooms: 5,
    squareMeters: 500
  },
  {
    id: 'wuse-2',
    title: 'Modern Wuse Apartment',
    type: 'apartment',
    location: 'wuse',
    price: 175000000,
    priceCategory: '<200M',
    paymentOptions: ['mortgage', 'outright', 'installment'],
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 200
  },
  {
    id: 'wuse-3',
    title: 'Elegant Terrace House',
    type: 'terrace',
    location: 'wuse',
    price: 240000000,
    priceCategory: '>200M',
    paymentOptions: ['outright', 'mortgage'],
    bedrooms: 5,
    bathrooms: 4,
    squareMeters: 400
  },
  
  // Asokoro properties (Premium)
  {
    id: 'asokoro-1',
    title: 'Asokoro Presidential Villa',
    type: 'duplex',
    location: 'asokoro',
    price: 450000000,
    priceCategory: '>200M',
    paymentOptions: ['outright'],
    bedrooms: 8,
    bathrooms: 7,
    squareMeters: 650
  },
  {
    id: 'asokoro-2',
    title: 'Luxury Asokoro Terrace',
    type: 'terrace',
    location: 'asokoro',
    price: 310000000,
    priceCategory: '>200M',
    paymentOptions: ['outright', 'mortgage'],
    bedrooms: 6,
    bathrooms: 5,
    squareMeters: 520
  },
  
  // Gwarinpa properties
  {
    id: 'gwarinpa-1',
    title: 'Gwarinpa Family Home',
    type: 'duplex',
    location: 'gwarinpa',
    price: 95000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'installment'],
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 280
  },
  {
    id: 'gwarinpa-2',
    title: 'Spacious Apartment',
    type: 'apartment',
    location: 'gwarinpa',
    price: 72000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'installment', 'outright'],
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 165
  },
  {
    id: 'gwarinpa-3',
    title: 'Modern Terrace',
    type: 'terrace',
    location: 'gwarinpa',
    price: 88000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'installment'],
    bedrooms: 4,
    bathrooms: 3,
    squareMeters: 240
  },
  
  // Jabi properties
  {
    id: 'jabi-1',
    title: 'Jabi Lake View Duplex',
    type: 'duplex',
    location: 'jabi',
    price: 145000000,
    priceCategory: '<200M',
    paymentOptions: ['mortgage', 'outright', 'installment'],
    bedrooms: 5,
    bathrooms: 4,
    squareMeters: 340
  },
  {
    id: 'jabi-2',
    title: 'Contemporary Apartment',
    type: 'apartment',
    location: 'jabi',
    price: 98000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'installment'],
    bedrooms: 3,
    bathrooms: 3,
    squareMeters: 180
  },
  {
    id: 'jabi-3',
    title: 'Stylish Bungalow',
    type: 'bungalow',
    location: 'jabi',
    price: 78000000,
    priceCategory: '<100M',
    paymentOptions: ['mortgage', 'installment', 'outright'],
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 200
  }
];

// Filter properties based on selected location
function filterPropertiesByLocation() {
  applyAllFilters();
}

// Debounced version of filter properties
const debouncedFilterProperties = debounce(filterPropertiesByLocation, 100);

// Show placeholder when no filters selected
function showPlaceholder() {
  const placeholder = document.querySelector('.details-panel .placeholder');
  const resultsContainer = document.querySelector('.results-container');
  
  placeholder.classList.remove('hidden');
  resultsContainer.classList.remove('active');
}

// Update details panel with property cards - minimized DOM manipulation
function updateDetailsPanel(properties) {
  const placeholder = document.querySelector('.details-panel .placeholder');
  const resultsContainer = document.querySelector('.results-container');
  const propertyCards = document.querySelector('.property-cards');
  const resultsCount = document.querySelector('.results-count');
  
  placeholder.classList.add('hidden');
  resultsContainer.classList.add('active');
  
  // Update results count
  const count = properties.length;
  resultsCount.textContent = `${count} result${count !== 1 ? 's' : ''}`;
  
  // Use DocumentFragment to minimize reflows
  const fragment = document.createDocumentFragment();
  
  // Generate property cards
  properties.forEach(property => {
    const card = createPropertyCard(property);
    fragment.appendChild(card);
  });
  
  // Single DOM update
  propertyCards.innerHTML = '';
  propertyCards.appendChild(fragment);
}

// Create property card HTML dynamically
function createPropertyCard(property) {
  const template = document.getElementById('property-card-template');
  const card = template.content.cloneNode(true);
  
  // Set property type badge
  const badge = card.querySelector('.property-type-badge');
  badge.textContent = property.type;
  
  // Set property title
  const title = card.querySelector('.property-title');
  title.textContent = property.title;
  
  // Set property price (format in millions)
  const price = card.querySelector('.property-price');
  const priceInMillions = (property.price / 1000000).toFixed(0);
  price.textContent = `₦${priceInMillions}M`;
  
  // Set payment options
  const paymentOptions = card.querySelector('.property-payment-options');
  property.paymentOptions.forEach(option => {
    const pill = document.createElement('span');
    pill.className = 'payment-pill';
    pill.textContent = option;
    paymentOptions.appendChild(pill);
  });
  
  // Set property details
  const bedrooms = card.querySelector('.bedrooms');
  bedrooms.textContent = `${property.bedrooms} Beds`;
  
  const bathrooms = card.querySelector('.bathrooms');
  bathrooms.textContent = `${property.bathrooms} Baths`;
  
  const area = card.querySelector('.area');
  area.textContent = `${property.squareMeters}m²`;
  
  return card;
}

// Enhanced location button handler to update details panel
function initializeLocationHandlers() {
  const filterPanel = document.querySelector('.filter-panel');
  
  // Use event delegation for location buttons
  filterPanel.addEventListener('click', function(event) {
    const button = event.target.closest('.location-btn');
    if (!button) return;
    
    // Use debounced filter update
    debouncedFilterProperties();
  });
}


// Initialize all handlers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeFilterHandlers();
  initializeMapZones();
  initializeLocationHandlers();
  initializeFilterChipHandlers();
  initializeClearAllHandler();
  
  // Show placeholder initially
  showPlaceholder();
});
