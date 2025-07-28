import { USE_MOCK_PROVIDERS, ENABLE_DEBUG_LOGS, API_BASE_URL } from '@env';

// Configuration des variables d'environnement
export const ENV = {
  // Mode développement/production
  IS_DEVELOPMENT: __DEV__,
  
  // Configuration des providers
  USE_MOCK_PROVIDERS: USE_MOCK_PROVIDERS !== 'false',
  
  // Configuration des logs
  ENABLE_DEBUG_LOGS: ENABLE_DEBUG_LOGS !== 'false',
  
  // Configuration des API (si applicable)
  API_BASE_URL: API_BASE_URL || 'https://api.carpeapp.com',
  
  // Configuration des fonctionnalités
  ENABLE_ANALYTICS: !__DEV__,
  ENABLE_CRASH_REPORTING: !__DEV__,
} as const;

// Helper pour vérifier l'environnement
export const isDevelopment = () => ENV.IS_DEVELOPMENT;
export const isProduction = () => !ENV.IS_DEVELOPMENT;
export const useMockProviders = () => ENV.USE_MOCK_PROVIDERS;

// Helper pour les logs conditionnels
export const debugLog = (message: string, ...args: any[]) => {
  if (ENV.ENABLE_DEBUG_LOGS) {
    console.log(`🔧 [DEV] ${message}`, ...args);
  }
};

export const prodLog = (message: string, ...args: any[]) => {
  if (ENV.ENABLE_DEBUG_LOGS) {
    console.log(`🚀 [PROD] ${message}`, ...args);
  }
}; 