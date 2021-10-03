/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.js"],
  moduleNameMapper: {},
  transform: {
    "\\.(css)$": "<rootDir>/test/styleMock.js",
    "^.+\\.[jt]sx?$": "<rootDir>/.storybook/transformer",
    "^.+\\.stories\\.[jt]sx?$": "<rootDir>/.storybook/transformer",
  },
  testMatch: ["**/?(*.)+(spec|test|stories).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
};

module.exports = config;
