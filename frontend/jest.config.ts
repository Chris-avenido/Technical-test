import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Points to your Next.js app root so next/jest can load next.config.js and .env files
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Run jest.setup.ts after the test framework is installed to add @testing-library/jest-dom matchers
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Module name mapper for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Redirect lucide-react to our manual mock (avoids ESM issues in Jest)
    '^lucide-react$': '<rootDir>/__mocks__/lucide-react.ts',
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.test.ts',
    '<rootDir>/__tests__/**/*.test.tsx',
  ],
};

// createJestConfig wraps your config with Next.js defaults (transforms, moduleNameMapper, etc.)
export default createJestConfig(config);
