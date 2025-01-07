const { Database } = require('./index');

async function test() {
  try {
    console.log('Testing database connection...');
    const connected = await Database.testConnection();
    console.log('Database connection test result:', connected);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
