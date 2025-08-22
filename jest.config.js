module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!.*react-native|.*@react-native)',
  ],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
    '**/?(*.)+(spec|test).ts',
    '**/?(*.)+(spec|test).tsx',
  ],
};
