// src/utils/userMapping.js
// Utility functions to manage username-to-hostname mapping

const FILE_MONITORING_API_URL = 
  import.meta.env.VITE_FILE_MONITORING_API_URL || "https://vigilantlog-backend.onrender.com";

/**
 * Get the logged-in username from session storage
 */
export const getLoggedInUsername = () => {
  return sessionStorage.getItem("username") || null;
};

/**
 * Get the user's configured hostname from the backend
 * Returns null if not configured yet
 */
export const fetchUserHostname = async (username) => {
  if (!username) return null;
  
  try {
    const response = await fetch(
      `${FILE_MONITORING_API_URL}/api/file-monitor/user-mapping/${encodeURIComponent(username)}`
    );
    
    if (response.ok) {
      const data = await response.json();
      // data should be { username, hostname }
      return data.hostname || null;
    }
    
    // If 404 or not found, user hasn't configured hostname yet
    return null;
  } catch (error) {
    console.error("Error fetching user hostname:", error);
    return null;
  }
};

/**
 * Save the username-to-hostname mapping
 */
export const saveUserHostnameMapping = async (username, hostname) => {
  if (!username || !hostname) {
    throw new Error("Username and hostname are required");
  }
  
  try {
    const response = await fetch(
      `${FILE_MONITORING_API_URL}/api/file-monitor/user-mapping`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, hostname }),
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to save user-hostname mapping");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving user hostname mapping:", error);
    throw error;
  }
};

/**
 * Initialize user context after login
 * Fetches and caches the user's hostname if configured
 */
export const initializeUserContext = async () => {
  const username = getLoggedInUsername();
  
  if (!username) {
    console.warn("No username found in session");
    return { username: null, hostname: null };
  }
  
  // Fetch the user's configured hostname
  const hostname = await fetchUserHostname(username);
  
  // Store in localStorage for quick access
  if (hostname) {
    localStorage.setItem("hostname", hostname);
    localStorage.setItem("hostname_configured", "true");
  } else {
    // Clear any existing hostname to prevent showing wrong data
    localStorage.removeItem("hostname");
    localStorage.setItem("hostname_configured", "false");
  }
  
  return { username, hostname };
};

/**
 * Check if the current user has configured their hostname
 */
export const isHostnameConfigured = () => {
  return localStorage.getItem("hostname_configured") === "true";
};

/**
 * Get the device ID to use for API calls
 * Returns null if user hasn't configured hostname yet
 */
export const getDeviceId = () => {
  const isConfigured = isHostnameConfigured();
  
  if (!isConfigured) {
    return null;
  }
  
  return localStorage.getItem("hostname") || null;
};

/**
 * Clear user context (on logout)
 */
export const clearUserContext = () => {
  localStorage.removeItem("hostname");
  localStorage.removeItem("hostname_configured");
  sessionStorage.clear();
};

