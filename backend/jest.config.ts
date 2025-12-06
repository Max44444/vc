export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/'],
    globals: {
        'ts-jest': {
            diagnostics: false,
            tsconfig: 'tsconfig.json'
        }
    }
}
