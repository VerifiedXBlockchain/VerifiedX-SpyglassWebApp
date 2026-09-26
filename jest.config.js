const nextJest = require("next/jest");

// next/jest wires up SWC, CSS-module proxies and next.config.js for us.
const createJestConfig = nextJest({ dir: "./" });

module.exports = createJestConfig({
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.[jt]s?(x)", "<rootDir>/src/**/*.test.[jt]s?(x)"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
});
