/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./src/polyfills.ts'],
  testMatch: ['**/src/**/*.spec.ts'],
  verbose: true,
};
