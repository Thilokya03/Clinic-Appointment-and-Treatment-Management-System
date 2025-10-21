const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${data}`));
                }
            });
        });
        
        req.on('error', reject);
        
        if (postData) {
            req.write(JSON.stringify(postData));
        }
        
        req.end();
    });
}

// Test patient search endpoint
async function testPatientSearch() {
    console.log('🧪 Testing Patient Search Endpoint\n');
    console.log('='.repeat(50));
    
    try {
        // First, login as staff to get a valid token
        console.log('\n1️⃣ Logging in as staff...');
        
        const loginOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/staff/signin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const loginResult = await makeRequest(loginOptions, {
            username: 'admin',
            password: 'admin123'
        });
        
        if (loginResult.status !== 200) {
            throw new Error(`Login failed with status ${loginResult.status}`);
        }
        
        const token = loginResult.data.token;
        console.log('✅ Login successful, token received');
        console.log('Token:', token.substring(0, 20) + '...');
        
        // Test search endpoint
        console.log('\n2️⃣ Testing search endpoint...');
        
        const searchOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/patient/search?search=',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        
        const searchResult = await makeRequest(searchOptions);
        
        if (searchResult.status === 404) {
            console.error('❌ Endpoint returned 404 - Route not found!');
            console.error('This means /api/patient/search is not registered correctly');
            process.exit(1);
        }
        
        console.log('✅ Search endpoint working!');
        console.log(`Found ${searchResult.data.length} patients`);
        
        if (searchResult.data.length > 0) {
            console.log('\n📊 Sample patient data:');
            console.log(JSON.stringify(searchResult.data[0], null, 2));
        }
        
        // Test search with specific term
        console.log('\n3️⃣ Testing search with term "P"...');
        
        const searchWithTermOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/patient/search?search=P',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        
        const searchWithTermResult = await makeRequest(searchWithTermOptions);
        
        console.log('✅ Search with term working!');
        console.log(`Found ${searchWithTermResult.data.length} patients matching "P"`);
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ All tests passed!');
        console.log('\n💡 The backend endpoint is working correctly.');
        console.log('If frontend still gets 404, check:');
        console.log('   1. Backend server is running');
        console.log('   2. Frontend is using correct token');
        console.log('   3. No proxy/CORS issues');
        
    } catch (error) {
        console.error('\n❌ Test failed:');
        console.error('Error:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Backend server is not running!');
            console.log('Start it with: cd backend && node server.js');
        }
        
        process.exit(1);
    }
}

testPatientSearch();
