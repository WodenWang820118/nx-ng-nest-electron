'use strict';
const { writeFileSync } = require('fs');

function writePath(filePath, content) {
  writeFileSync(filePath, content, 'utf8');
}

module.exports = {
  writePath,
};
