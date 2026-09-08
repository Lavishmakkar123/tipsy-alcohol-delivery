module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    'app.js',
    'middleware/**/*.js',
    'controllers/**/*.js',
    'services/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 75,
      functions: 90,
      lines: 90,
    },
  },
  coverageReporters: ['text', 'lcov', 'json-summary'],
};
