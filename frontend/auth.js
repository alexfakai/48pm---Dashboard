// Authentication System for 48 Property Dashboard

// CREDENTIALS - Change these to your desired username and password
const CREDENTIALS = {
  username: 'admin',
  password: 'Property2024!' // Change this to a strong password
};

// Session duration (in milliseconds)
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const REMEMBER_ME_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Check if user is already logged in (for dashboard pages)
function checkAuth() {
  const session = getSession();
  
  if (!session || !session.isValid) {
    // Not logged in or session expired, redirect to login
    window.location.href = 'login.html';
    return false;
  }
  
  return true;
}

// Get current session
function getSession() {
  const sessionData = localStorage.getItem('dashboardSession');
  
  if (!sessionData) {
    return null;
  }
  
  try {
    const session = JSON.parse(sessionData);
    const now = Date.now();
    
    // Check if session is expired
    if (now > session.expiresAt) {
      clearSession();
      return null;
    }
    
    return {
      isValid: true,
      username: session.username,
      expiresAt: session.expiresAt
    };
  } catch (error) {
    clearSession();
    return null;
  }
}

// Create new session
function createSession(username, rememberMe = false) {
  const now = Date.now();
  const duration = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;
  
  const session = {
    username: username,
    loginTime: now,
    expiresAt: now + duration
  };
  
  localStorage.setItem('dashboardSession', JSON.stringify(session));
}

// Clear session (logout)
function clearSession() {
  localStorage.removeItem('dashboardSession');
}

// Simple hash function for password comparison
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

// Verify credentials
function verifyCredentials(username, password) {
  // Simple comparison (in production, use proper hashing)
  return username === CREDENTIALS.username && password === CREDENTIALS.password;
}

// Login form handler
if (document.getElementById('loginForm')) {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  const loginBtn = document.getElementById('loginBtn');
  
  // Check if already logged in
  const session = getSession();
  if (session && session.isValid) {
    window.location.href = 'index.html';
  }
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Hide error message
    errorMessage.classList.remove('show');
    
    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    // Simulate network delay for better UX
    setTimeout(() => {
      if (verifyCredentials(username, password)) {
        // Success - create session and redirect
        createSession(username, rememberMe);
        window.location.href = 'index.html';
      } else {
        // Failed - show error
        errorMessage.classList.add('show');
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        
        // Clear password field
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
      }
    }, 800);
  });
}

// Logout function (call this from dashboard)
function logout() {
  clearSession();
  window.location.href = 'login.html';
}

// Add logout button functionality if it exists
document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      logout();
    });
  }
});

// Auto-logout on session expiry (check every minute)
setInterval(function() {
  const session = getSession();
  if (!session || !session.isValid) {
    if (window.location.pathname !== '/login.html' && !window.location.pathname.endsWith('login.html')) {
      logout();
    }
  }
}, 60000); // Check every minute
