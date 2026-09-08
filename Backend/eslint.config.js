const js = require('@eslint/js');
const security = require('eslint-plugin-security');
const nodePlugin = require('eslint-plugin-n');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  security.configs.recommended,
  nodePlugin.configs['flat/recommended-script'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-missing-require': 'off',
      // This app is deployed, not published to npm — devDependencies are
      // always present at runtime, so this check doesn't apply here.
      'n/no-unpublished-require': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['tests/**/*.js', '**/*.test.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'security/detect-object-injection': 'off',
    },
  },
  {
    files: ['db/**/*.js'],
    rules: {
      'n/no-process-exit': 'off',
    },
  },
  {
    ignores: ['node_modules/**', 'coverage/**', '.claude/**'],
  },
  prettierConfig,
];
