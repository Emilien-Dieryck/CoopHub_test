/**
 * Test security utilities
 */

import { validateIdentifier, validatePassword, comparePasswords } from '../src/utils/securityUtils.js';

async function test() {
  try {
    console.log('Testing security utilities...\n');

    // Test 1: validate identifier
    console.log('1. Testing validateIdentifier("john_doe")');
    const identifier = validateIdentifier('john_doe');
    console.log('   Result:', identifier, '\n');

    // Test 2: validate password
    console.log('2. Testing validatePassword("john123")');
    const password = validatePassword('john123');
    console.log('   Result:', password, '\n');

    // Test 3: compare passwords
    console.log('3. Testing comparePasswords');
    const hash = '$2b$10$/abf7yy0Yl38cwy4iq/miuWXVf2B6aIwnfppzUaJ9.1dVnuwkWmWC';
    const match = await comparePasswords('john123', hash);
    console.log('   Password matches hash:', match, '\n');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

test();
