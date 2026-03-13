// Environment variables with validation
const requiredEnvVars = ['VITE_API_BASE_URL'] as const;

export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  TOKEN_KEY: import.meta.env.VITE_TOKEN_KEY || 'zmade_access_token',
  REFRESH_KEY: import.meta.env.VITE_REFRESH_KEY || 'zmade_refresh_token',
  ENABLE_MOCK: import.meta.env.VITE_ENABLE_MOCK === 'true',
  ENABLE_DEBUG_LOGS: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true',
} as const;

// Validate required variables in production
if (import.meta.env.PROD) {
  requiredEnvVars.forEach((key) => {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}
