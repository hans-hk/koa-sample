module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 2016,
    'sourceType': 'module'
  },
  'parser': 'babel-eslint',
  'rules': {
    'indent': 0,
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'no-unused-vars': 0,
    'no-console': 0,
    'no-debugger': 0
  }
};