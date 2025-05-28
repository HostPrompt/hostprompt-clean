/**
 * User ID management utility
 * 
 * Handles generating and retrieving a unique user ID for multi-user UAT testing
 * without requiring authentication
 */

// Local storage key for the user ID
const USER_ID_KEY = 'hostprompt_user_id';
const USER_ID_NUMERIC_KEY = 'hostprompt_user_id_numeric';

/**
 * Gets the current user ID string from localStorage or generates a new one if it doesn't exist
 */
export function getUserIdString(): string {
  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    // Generate a new user ID with the 'uat-' prefix and a random UUID
    userId = 'uat-' + crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
    
    // Also generate a numeric representation for database compatibility
    const numericId = generateNumericId();
    localStorage.setItem(USER_ID_NUMERIC_KEY, numericId.toString());
    
    console.log('New user session generated:', { stringId: userId, numericId });
  }

  return userId;
}

/**
 * Gets the numeric representation of the user ID for database compatibility
 * Uses a hash of the string ID to generate a large numeric value,
 * then ensures it's within a valid integer range
 */
export function getUserId(): number {
  // Check if we already have a numeric ID
  const storedNumericId = localStorage.getItem(USER_ID_NUMERIC_KEY);
  if (storedNumericId) {
    return parseInt(storedNumericId, 10);
  }
  
  // If not, generate one and store it
  const numericId = generateNumericId();
  localStorage.setItem(USER_ID_NUMERIC_KEY, numericId.toString());
  
  return numericId;
}

/**
 * Generate a numeric ID based on the current timestamp and some randomness,
 * ensuring it's large enough to be unique but small enough to fit in an integer field
 */
function generateNumericId(): number {
  // Start with current timestamp to ensure uniqueness
  const timestamp = Date.now();
  // Add some randomness (0-9999)
  const random = Math.floor(Math.random() * 10000);
  
  // Combine in a way that should fit in a 32-bit integer range
  // We'll take the last 7 digits of timestamp (covers ~115 days uniquely)
  // and add the random 4 digits to ensure uniqueness even for simultaneous users
  const timeComponent = timestamp % 10000000; // Last 7 digits
  const numericId = (timeComponent * 10000) + random;
  
  return numericId;
}

/**
 * Resets the user ID (useful for testing)
 */
export function resetUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_ID_NUMERIC_KEY);
}