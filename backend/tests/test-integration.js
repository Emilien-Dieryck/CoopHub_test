/**
 * Integration Test - Backend Security
 * Tests login with bcrypt hashing and JWT generation
 */

import http from 'http';

const API_URL = 'http://localhost:4000';
const LOGIN_ENDPOINT = '/api/login';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${path}`);
    
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log('\n🔐 Backend Security Integration Tests\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Health check
    console.log('\n✓ Test 1: Health Check');
    const health = await makeRequest('GET', '/health');
    console.log('  Status:', health.status);
    console.log('  Response:', health.body);

    // Test 2: Successful login
    console.log('\n✓ Test 2: Login with Correct Credentials (john_doe)');
    const login = await makeRequest('POST', LOGIN_ENDPOINT, {
      identifier: 'john_doe',
      password: 'john123',
    });
    console.log('  Status:', login.status);
    console.log('  Success:', login.body.success);
    console.log('  Message:', login.body.message);
    console.log('  User:', login.body.user);
    console.log('  Token Present:', !!login.body.token);
    if (login.body.token) {
      console.log('  Token (first 50 chars):', login.body.token.substring(0, 50) + '...');
    }

    // Test 3: Wrong password
    console.log('\n✓ Test 3: Login with Wrong Password');
    const wrongPass = await makeRequest('POST', LOGIN_ENDPOINT, {
      identifier: 'john_doe',
      password: 'wrongpassword',
    });
    console.log('  Status:', wrongPass.status);
    console.log('  Error:', wrongPass.body.error);

    // Test 4: Non-existent user
    console.log('\n✓ Test 4: Login with Non-existent User');
    const noUser = await makeRequest('POST', LOGIN_ENDPOINT, {
      identifier: 'nonexistent',
      password: 'password123',
    });
    console.log('  Status:', noUser.status);
    console.log('  Error:', noUser.body.error);

    // Test 5: Second user
    console.log('\n✓ Test 5: Login with Second User (jane_smith)');
    const jane = await makeRequest('POST', LOGIN_ENDPOINT, {
      identifier: 'jane_smith',
      password: 'abcde123',
    });
    console.log('  Status:', jane.status);
    console.log('  Success:', jane.body.success);
    console.log('  User:', jane.body.user);
    console.log('  Token Present:', !!jane.body.token);

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ All tests completed!\n');

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    process.exit(1);
  }
}

// Wait for server to be ready
setTimeout(runTests, 500);
