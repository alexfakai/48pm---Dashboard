# Database Integration Guide

## Current Setup (Mock Data)

Right now, the dashboard uses **mock data** stored in `frontend/app.js` in the `mockProperties` array. This allows the prototype to work fully without a database.

**The filters ARE working** - when you click any filter button, you should see:
- Properties appear in the right panel
- Filter chips show above the results
- Result count updates
- Map labels turn gold for selected locations

Try clicking:
- A location like "Maitama" or "Lokogoma"
- A property type like "Duplex" or "Apartment"
- A price range like "Less than 100M"
- A payment option like "Mortgage"

## When You Get Database Access

Here's how to integrate your real database:

### Option 1: REST API (Recommended)

Replace the mock data with API calls:

```javascript
// In app.js, replace the mockProperties array with:

let allProperties = []; // Store fetched properties

// Fetch properties from your API
async function fetchProperties() {
  try {
    const response = await fetch('https://your-api.com/api/properties');
    const data = await response.json();
    allProperties = data;
    return allProperties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Update applyAllFilters function to use fetched data:
function applyAllFilters() {
  const hasFilters = filterState.propertyTypes.length > 0 || 
                     filterState.locations.length > 0 || 
                     filterState.priceCategories.length > 0 || 
                     filterState.paymentOptions.length > 0;
  
  if (!hasFilters) {
    showPlaceholder();
    return;
  }
  
  // Use allProperties instead of mockProperties
  let filteredProperties = allProperties;
  
  // ... rest of filtering logic stays the same
}

// Initialize by fetching data
document.addEventListener('DOMContentLoaded', async function() {
  await fetchProperties(); // Fetch data first
  
  initializeFilterHandlers();
  initializeMapZones();
  initializeLocationHandlers();
  initializeFilterChipHandlers();
  initializeClearAllHandler();
  
  showPlaceholder();
});
```

### Option 2: Server-Side Filtering (Better for Large Datasets)

Send filter parameters to the server and get filtered results:

```javascript
async function applyAllFilters() {
  const hasFilters = filterState.propertyTypes.length > 0 || 
                     filterState.locations.length > 0 || 
                     filterState.priceCategories.length > 0 || 
                     filterState.paymentOptions.length > 0;
  
  if (!hasFilters) {
    showPlaceholder();
    return;
  }
  
  // Build query parameters
  const params = new URLSearchParams();
  
  if (filterState.propertyTypes.length > 0) {
    params.append('types', filterState.propertyTypes.join(','));
  }
  if (filterState.locations.length > 0) {
    params.append('locations', filterState.locations.join(','));
  }
  if (filterState.priceCategories.length > 0) {
    params.append('prices', filterState.priceCategories.join(','));
  }
  if (filterState.paymentOptions.length > 0) {
    params.append('payments', filterState.paymentOptions.join(','));
  }
  
  try {
    const response = await fetch(`https://your-api.com/api/properties?${params}`);
    const filteredProperties = await response.json();
    updateDetailsPanel(filteredProperties);
  } catch (error) {
    console.error('Error fetching filtered properties:', error);
    showPlaceholder();
  }
}
```

### Option 3: Firebase/Supabase

If using Firebase or Supabase:

```javascript
// Firebase example
import { collection, query, where, getDocs } from 'firebase/firestore';

async function applyAllFilters() {
  const hasFilters = filterState.propertyTypes.length > 0 || 
                     filterState.locations.length > 0 || 
                     filterState.priceCategories.length > 0 || 
                     filterState.paymentOptions.length > 0;
  
  if (!hasFilters) {
    showPlaceholder();
    return;
  }
  
  try {
    let q = collection(db, 'properties');
    
    // Add filters
    if (filterState.locations.length > 0) {
      q = query(q, where('location', 'in', filterState.locations));
    }
    if (filterState.propertyTypes.length > 0) {
      q = query(q, where('type', 'in', filterState.propertyTypes));
    }
    
    const querySnapshot = await getDocs(q);
    const properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Apply remaining filters client-side if needed
    let filteredProperties = properties;
    
    if (filterState.priceCategories.length > 0) {
      filteredProperties = filteredProperties.filter(property => 
        filterState.priceCategories.includes(property.priceCategory)
      );
    }
    
    if (filterState.paymentOptions.length > 0) {
      filteredProperties = filteredProperties.filter(property => 
        filterState.paymentOptions.some(option => 
          property.paymentOptions.includes(option)
        )
      );
    }
    
    updateDetailsPanel(filteredProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    showPlaceholder();
  }
}
```

## Database Schema

Your database should have a properties table/collection with these fields:

```json
{
  "id": "string (unique)",
  "title": "string",
  "type": "string (duplex|apartment|bungalow|terrace)",
  "location": "string (maitama|wuse|asokoro|gwarinpa|jabi|kuje|idu|bwari|lokogoma)",
  "price": "number",
  "priceCategory": "string (<50M|<100M|<200M|>200M)",
  "paymentOptions": "array of strings (mortgage|outright|installment)",
  "bedrooms": "number",
  "bathrooms": "number",
  "squareMeters": "number",
  "images": "array of image URLs (optional)",
  "description": "string (optional)",
  "amenities": "array of strings (optional)",
  "createdAt": "timestamp (optional)",
  "updatedAt": "timestamp (optional)"
}
```

## What Stays the Same

You don't need to change:
- The HTML structure
- The CSS styling
- The filter UI logic
- The filter chips functionality
- The map highlighting
- The property card rendering

Only replace:
1. Where the data comes from (`mockProperties` → API/Database)
2. How filtering is done (client-side → server-side, optional)

## Testing Your Integration

1. Keep the mock data initially
2. Add your API calls alongside it
3. Add a toggle to switch between mock and real data
4. Test thoroughly before removing mock data

```javascript
const USE_MOCK_DATA = false; // Toggle this

async function getProperties() {
  if (USE_MOCK_DATA) {
    return mockProperties;
  } else {
    return await fetchPropertiesFromAPI();
  }
}
```

## Need Help?

The current code is production-ready for the frontend. When you get database access:
1. Choose your integration method (REST API recommended)
2. Update the data fetching functions
3. Keep all the UI logic the same
4. Test with your real data

The filtering, chips, result counts, and map highlighting will all work automatically once you provide the data in the same format!
