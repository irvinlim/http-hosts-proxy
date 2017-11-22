module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  globals: {
    __static: true,
  },
  plugins: ['html', 'prettier', 'mocha'],
  rules: {
    // always use LF for line breaks
    'linebreak-style': ['error', 'unix'],

    // always use single quotes
    quotes: ['error', 'single'],

    // always use semicolons
    semi: ['error', 'always'],

    // allow console methods
    'no-console': 'off',

    // don't allow redeclaration of vars in outer scope
    'no-shadow': [
      'error',
      { allow: ['resolve', 'reject', 'done', 'cb', 'event', 'err'] },
    ],

    // don't allow unused vars
    'no-unused-vars': ['error', { varsIgnorePattern: '^_.*' }],

    // allow paren-less arrow functions
    'arrow-parens': 0,

    // allow async-await
    'generator-star-spacing': 0,

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
};
