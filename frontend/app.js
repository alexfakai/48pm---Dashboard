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

// Location options
const locations = ['kuje', 'idu', 'bwari', 'lokogoma'];

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
  const zone = document.getElementById(`zone-${location}`);
  
  if (!zone) return;
  
  if (isSelected) {
    // Apply gold accent and glow to selected zone
    zone.setAttribute('fill', 'rgba(212, 175, 55, 0.3)');
    zone.setAttribute('stroke', '#d4af37');
    zone.setAttribute('stroke-width', '3');
    zone.setAttribute('filter', 'url(#glow)');
    zone.classList.add('zone-selected');
  } else {
    // Reset to default state
    zone.setAttribute('fill', 'rgba(255, 255, 255, 0.1)');
    zone.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
    zone.setAttribute('stroke-width', '2');
    zone.removeAttribute('filter');
    zone.classList.remove('zone-selected');
  }
}

// Debounced version of map zone update
const debouncedMapZoneUpdate = debounce(updateMapZone, 50);


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
  }
];

// Filter properties based on selected location
function filterPropertiesByLocation() {
  const selectedLocations = filterState.locations;
  
  if (selectedLocations.length === 0) {
    showPlaceholder();
    return;
  }
  
  const filteredProperties = mockProperties.filter(property => 
    selectedLocations.includes(property.location)
  );
  
  updateDetailsPanel(filteredProperties);
}

// Debounced version of filter properties
const debouncedFilterProperties = debounce(filterPropertiesByLocation, 100);

// Show placeholder when no location selected
function showPlaceholder() {
  const placeholder = document.querySelector('.details-panel .placeholder');
  const propertyCards = document.querySelector('.property-cards');
  
  placeholder.classList.remove('hidden');
  propertyCards.classList.remove('active');
  propertyCards.innerHTML = '';
}

// Update details panel with property cards - minimized DOM manipulation
function updateDetailsPanel(properties) {
  const placeholder = document.querySelector('.details-panel .placeholder');
  const propertyCards = document.querySelector('.property-cards');
  
  placeholder.classList.add('hidden');
  propertyCards.classList.add('active');
  
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
  
  // Show placeholder initially
  showPlaceholder();
});
