// jest.config.js
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // Файл установки глобальных переменных тестовой среды (полифил localStorage и др.)
  setupFiles: ['./jest.setup.ts'],
  preset: 'ts-jest/presets/default-esm', // Essential for ESM + TypeScript
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    // This maps import './file.js' to './file' (if it's a .ts file originally)
    // Needed because TS in ESM mode might output imports with .js extensions.
    '^(\./.*)\.js$': '$1',
  },
  transform: {
    // Use ts-jest for .ts and .tsx files
    '^.+\.tsx?$': [
      'ts-jest',
      {
        useESM: true, // Key for ESM support
        tsconfig: 'tsconfig.app.json',
      },
    ],
  },
  // Jest's default transformIgnorePatterns often causes issues with ESM modules in node_modules
  // that are not transpiled to CommonJS. By telling Jest to transform them (or rather, not ignore them for transformation),
  // it can work. However, our issue seems to be with our own source files, not node_modules.
  // For now, let's ensure it's not overly broad.
  // A common pattern for allowing specific node_modules to be transformed:
  // transformIgnorePatterns: [
  //   '/node_modules/(?!some-es-module-package|another-es-module-package)',
  // ],
  // Default is '/node_modules/', which is usually fine if all your deps are CJS or your own code is correctly handled.
  // Since the error is in our own code (src/utils), transformIgnorePatterns might not be the primary fix here,
  // but ensuring it's not misconfigured is good.
  // Let's ensure it's the default or slightly more permissive if needed later.
  transformIgnorePatterns: [
    '/node_modules/', // Default, Jest won't transform files in node_modules
    '\\.pnp\\.[^\\/]+$', // Corrected .pnp pattern
  ],
};
