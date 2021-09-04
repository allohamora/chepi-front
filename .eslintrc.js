module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'beautiful-sort'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'airbnb',
    'airbnb-typescript',
    "next", 
    "next/core-web-vitals",
  ],
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '*.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',

    'react/jsx-props-no-spreading': 'off',

    'beautiful-sort/import': ['error', {
      'special': ['react'], 
      'order': ['special', 'namespace', 'default', 'defaultObj', 'obj', 'none']
    }],
  },
};
