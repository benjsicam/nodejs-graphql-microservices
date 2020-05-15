module.exports = {
  setupFilesAfterEnv: [
    "jest-extended"
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/services/**/*client.js",
    "!src/services/abstract-crud.service.js",
    "!src/index.js",
    "!src/config.js",
    "!src/logger.js",
    "!src/main.js",
    "!src/playground-query.js",
    "!src/server.js",
    "!**/node_modules/**"
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "node"
  ],
  testEnvironment: "node"
}
