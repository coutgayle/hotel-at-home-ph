// Master entry point for Hostinger / Phusion Passenger
const { execSync } = require('child_process');
const path = require('path');

console.log('--- Hostinger: Starting App.js ---');

// Ensure frontend is built before starting the server
try {
  console.log('--- Hostinger: Running Next.js Frontend Build ---');
  // Change directory to 'frontend' and then execute 'npm run build'
  execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
  console.log('--- Hostinger: Next.js Frontend Build Complete ---');
} catch (error) {
  console.error('--- Hostinger: Next.js Frontend Build Failed! ---', error);
  process.exit(1); // Exit if build fails
}

// Start the backend server
require('./backend/server.js');
// Master entry point for Hostinger / Phusion Passenger
require('./backend/server.js');