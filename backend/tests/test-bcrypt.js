/**
 * Test script to verify bcrypt password comparison works
 */

import bcrypt from 'bcryptjs';

const testPassword = 'john123';
const storedHash = '$2b$10$/abf7yy0Yl38cwy4iq/miuWXVf2B6aIwnfppzUaJ9.1dVnuwkWmWC';

console.log('Testing bcrypt password comparison:');
console.log('Stored hash:', storedHash);
console.log('Test password:', testPassword);

bcrypt.compare(testPassword, storedHash).then(isMatch => {
  console.log('Password match:', isMatch);
  process.exit(isMatch ? 0 : 1);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
