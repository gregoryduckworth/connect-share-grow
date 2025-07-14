
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeGlobalErrorHandler } from '@/lib/errors/globalErrorHandler'
import { validateEnvironment } from '@/lib/config/environment'
import { logger } from '@/lib/logging/logger'

// Initialize global error handling
initializeGlobalErrorHandler();

// Validate environment configuration
const { isValid, errors } = validateEnvironment();
if (!isValid) {
  logger.warn('Environment validation failed', { errors });
  console.warn('Environment validation issues:', errors);
}

createRoot(document.getElementById("root")!).render(<App />);
