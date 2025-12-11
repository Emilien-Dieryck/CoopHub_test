/**
 * Test user repository
 */

import { findByUsernameOrEmail } from '../src/repositories/userRepository.js';

console.log('Testing userRepository...\n');

console.log('1. Finding "john_doe"');
const john = findByUsernameOrEmail('john_doe');
console.log('   Result:', john, '\n');

console.log('2. Finding "john@example.com"');
const johnEmail = findByUsernameOrEmail('john@example.com');
console.log('   Result:', johnEmail, '\n');

console.log('3. Finding non-existent user "fake"');
const fake = findByUsernameOrEmail('fake');
console.log('   Result:', fake, '\n');
