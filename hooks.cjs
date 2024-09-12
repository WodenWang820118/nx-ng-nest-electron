const { join } = require('path');
const { runCommand } = require('./main-process/command-utils.cjs');

(async () => {
  try {
    // Run npm install in the specified directory
    await runCommand(
      'npm install --prefer-offline --no-audit --progress=false --omit=dev && npm install sqlite3 --prefer-offline --no-audit --progress=false --omit=dev',
      {
        cwd: join(__dirname, 'dist/nest-backend'),
        stdio: 'inherit',
      }
    );

    console.log('npm install completed successfully');
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
})();
