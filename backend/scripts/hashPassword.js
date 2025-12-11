/**
 * Password Hashing Script
 * Utility to generate bcrypt hashes for testing
 * 
 * Usage: node scripts/hashPassword.js <password>
 * Example: node scripts/hashPassword.js "john123"
 */

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hashPassword.js <password>');
  console.error('Example: node scripts/hashPassword.js "john123"');
  process.exit(1);
}

// Hash password with 10 rounds
bcrypt.hash(password, 10).then(hash => {
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nUse this hash in your database');
});
