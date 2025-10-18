// UI Layout Constants
export const LAYOUT_HEIGHTS = {
  PENDING_MIN_HEIGHT: "100vh"
} as const;

// Polling Configuration
export const POLLING_CONFIG = {
  INTERVAL: 5000, // 5 seconds
  MAX_RETRIES: 60, // 5 minutes total
  RETRY_DELAY: 1000 // 1 second
} as const;
