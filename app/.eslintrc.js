module.exports = {
  extends: [
    'plugin:vue/recommended',
    '../.eslintrc.js'
  ],
  env: {
    browser: true,
    node: false
  },
  plugins: [
    'vue'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2017
  },
  globals: {
    process: false
  },
  rules: {
    'object-shorthand': [2, 'always', { ignoreConstructors: false }],
    'spaced-comment': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/extensions': [2, 'always', {
      vue: 'never',
      js: 'never',
      styl: 'never',
      css: 'never'
    }]
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            extensions: [
              '.vue',
              '.js',
              '.styl',
              '.css'
            ],
            alias: {
              lodash: 'lodash-es',
              underscore: 'lodash-es'
            }
          }
        }
      }
    }
  }
};
