const fs = require('fs');

fs.copyFile('dist/browser/index.js', 'example/axios.js', () => {});
