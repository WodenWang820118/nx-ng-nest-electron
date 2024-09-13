'use strict';
const { appendFileSync } = require('fs');
const { join } = require('path');

function logToFile(path, message, type = 'info') {
  const logPath = join(path, `${type}.log`);
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${type.toUpperCase()}: ${message}\n`;

  try {
    appendFileSync(logPath, logMessage);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

module.exports = {
  logToFile,
};
