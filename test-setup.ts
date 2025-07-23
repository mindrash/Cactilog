import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Replit Auth environment variables
process.env.REPLIT_DOMAINS = 'test.replit.dev';
process.env.SESSION_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
  },
  writable: true,
});