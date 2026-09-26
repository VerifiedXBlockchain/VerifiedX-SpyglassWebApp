// Polling Configuration
export const POLLING_CONFIG = {
  INTERVAL: 5000, // 5 seconds
  MAX_RETRIES: 60, // 5 minutes total
  RETRY_DELAY: 1000 // 1 second
} as const;
