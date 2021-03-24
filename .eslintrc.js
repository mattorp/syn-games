module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'sort-keys-fix',
    'graphql'
  ],
  rules:

  {
    '@typescript-eslint/ban-ts-comment': 'off',

    '@typescript-eslint/no-unused-vars': [2, {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    'arrow-spacing': 'error',
    'brace-style': 'error',

    // 'comma-dangle' : ['error', 'always-multiline' ],
    'comma-spacing': [
      'error',
      {
        after: true,
      },
    ],

    'comma-style': 'error',
    complexity: [
      'error',
      {
        max: 7,
      },
    ],
    'eol-last': ['error', 'always'],
    eqeqeq: 'error',
    indent: ['error', 2],
    'jsx-quotes': ['error', 'prefer-single'],
    'key-spacing': ['error', { 'align': 'colon' }],
    'max-depth': [
      'error',
      {
        max: 8,
      },
    ],
    'newline-per-chained-call': [
      'error',
      {
        ignoreChainWithDepth: 2,
      },
    ],
    'no-empty-pattern': 'off',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
      },
    ],
    'no-unneeded-ternary': 'error',
    'no-var': 'error',
    'object-property-newline': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': 'error',
    'prefer-exponentiation-operator': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    quotes: ['error', 'single'],
    'rest-spread-spacing': ['error', 'never'],
    semi: ['error', 'never'],
    'sort-keys-fix/sort-keys-fix': 'error'
  },
}
