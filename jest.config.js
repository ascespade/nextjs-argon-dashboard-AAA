const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files
    dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/pages/(.*)$': '<rootDir>/pages/$1',
        '^@/styles/(.*)$': '<rootDir>/styles/$1',
        '^@/utils/(.*)$': '<rootDir>/utils/$1',
        '^@/types/(.*)$': '<rootDir>/types/$1',
        '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
        '^@/store/(.*)$': '<rootDir>/store/$1',
        '^@/services/(.*)$': '<rootDir>/services/$1',
        '^@/constants/(.*)$': '<rootDir>/constants/$1',
    },
    collectCoverageFrom: [
        'components/**/*.{js,jsx,ts,tsx}',
        'pages/**/*.{js,jsx,ts,tsx}',
        'utils/**/*.{js,jsx,ts,tsx}',
        'hooks/**/*.{js,jsx,ts,tsx}',
        'store/**/*.{js,jsx,ts,tsx}',
        'services/**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!**/.next/**',
        '!**/coverage/**',
        '!**/*.config.js',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    testMatch: [
        '<rootDir>/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testTimeout: 10000,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
