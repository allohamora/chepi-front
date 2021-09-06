module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'beautiful-sort'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb-typescript',
    'next',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-empty-interface': 'warn',
    'max-classes-per-file': ['error', 2],

    'react/jsx-props-no-spreading': 'off',
    'react/display-name': 'warn',
    'import/prefer-default-export': 'off',

    'beautiful-sort/import': [
      'error',
      {
        special: ['react'],
        order: ['special', 'namespace', 'default', 'defaultObj', 'obj', 'none'],
      },
    ],
  },
};
