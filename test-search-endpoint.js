// Quick test script for user search endpoint
// Run with: node test-search-endpoint.js

const http = require('http');

// Test configuration
const HOST = 'localhost';
const PORT = 3000;
const TOKEN = 'YOUR_ACCESS_TOKEN_HERE'; // Replace with actual token from localStorage

function testSearchEndpoint(query = '') {
  const path = query 
    ? `/api/users/search?q=${encodeURIComponent(query)}&limit=20`
    : '/api/users/search?limit=20';

  const options = {
    hostname: HOST,
    port: PORT,
    path: path,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  console.log(`\n🔍 Testing: ${path}`);
  console.log('─'.repeat(50));

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      
      try {
        const json = JSON.parse(data);
        console.log('Response:', JSON.stringify(json, null, 2));
        
        if (json.success && json.data && json.data.users) {
          console.log(`\n✅ Found ${json.data.users.length} users`);
          json.data.users.forEach(user => {
            console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
          });
        } else {
          console.log('\n❌ No users found or unexpected response format');
        }
      } catch (e) {
        console.log('Raw response:', data);
        console.log('Parse error:', e.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Backend not running on port 3000');
    console.log('2. Network connection issue');
  });

  req.end();
}

// Run tests
console.log('🚀 User Search Endpoint Test');
console.log('═'.repeat(50));

if (TOKEN === 'YOUR_ACCESS_TOKEN_HERE') {
  console.log('\n⚠️  Please update the TOKEN variable with your actual access token');
  console.log('\nHow to get your token:');
  console.log('1. Login to the app in browser');
  console.log('2. Open DevTools (F12)');
  console.log('3. Go to Application → Local Storage');
  console.log('4. Copy the value of "access_token"');
  console.log('5. Replace TOKEN in this file');
  process.exit(1);
}

// Test 1: Get all users (no search query)
testSearchEndpoint();

// Test 2: Search for "jane"
setTimeout(() => {
  testSearchEndpoint('jane');
}, 1000);

// Test 3: Search for "admin"
setTimeout(() => {
  testSearchEndpoint('admin');
}, 2000);
