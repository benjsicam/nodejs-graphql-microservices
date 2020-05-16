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
    "!src/app.js",
    "!src/config.js",
    "!src/db.js",
    "!src/index.js",
    "!src/logger.js",
    "!src/main.js",
    "!src/models/*.js",
    "!src/repositories/abstract-crud.repository.js",
    "!src/services/health-check.service.js",
    "!**/node_modules/**"
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "node"
  ],
  testEnvironment: "node"
}