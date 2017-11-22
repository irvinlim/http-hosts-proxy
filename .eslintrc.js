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
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': 'off',

    // don't allow redeclaration of vars in outer scope
    'no-shadow': [
      'error',
      { allow: ['resolve', 'reject', 'done', 'cb', 'event', 'err'] },
    ],

    'no-unused-vars': ['error', { varsIgnorePattern: '^_.*' }],

    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
};
