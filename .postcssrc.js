'use strict';

const browsers = [
  'last 3 versions',
  'Android >= 4',
  'iOS >= 6',
  'ie >= 9',
  '> 1%'
];

module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers
    })
  ]
}
