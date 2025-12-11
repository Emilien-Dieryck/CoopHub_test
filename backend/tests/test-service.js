/**
 * Test auth service
 */

import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import { login } from '../src/services/authService.js';

async function test() {
  try {
    console.log('Testing authService...\n');

    console.log('1. Login with correct credentials');
    const result = await login('john_doe', 'john123');
    console.log('   Result:', result);
    console.log('   Has token:', !!result.token);
    console.log('   Token (first 50 chars):', result.token?.substring(0, 50));

  } catch (error) {
    console.error('   Error:', error.message);
    console.error('   Full error:', error);
  }
}

test();
