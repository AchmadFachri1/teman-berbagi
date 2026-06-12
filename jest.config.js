module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    testTimeout: 60000,
    forceExit: true,
    detectOpenHandles: true,
    verbose: true,
    roots: ['<rootDir>/tests'],
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'server/controllers/**/*.js',
        'server/models/**/*.js',
        'server/middleware/**/*.js',
        'server/routes/**/*.js',
        '!server/server.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 75,
            lines: 75,
            statements: 75
        }
    }
};