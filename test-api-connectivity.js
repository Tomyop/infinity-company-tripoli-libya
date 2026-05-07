console.log('=== FRONTEND-BACKEND CONNECTIVITY TEST ===');

async function testAPIConnectivity() {
    try {
        console.log('🔍 Testing API endpoints from frontend context...');
        
        // Test 1: Health check
        console.log('\n1. Testing health endpoint...');
        const healthResponse = await fetch('http://localhost:3001/api/health');
        const healthData = await healthResponse.json();
        console.log('✅ Health:', healthData);
        
        // Test 2: Telegram test
        console.log('\n2. Testing telegram endpoint...');
        const telegramResponse = await fetch('http://localhost:3001/api/test-telegram');
        const telegramData = await telegramResponse.json();
        console.log('✅ Telegram test:', telegramData);
        
        // Test 3: Combined notifications (same as frontend would call)
        console.log('\n3. Testing combined notifications...');
        const notificationsResponse = await fetch('http://localhost:3001/api/send-notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegramMessage: '🧪 Frontend connectivity test',
                emailSubject: 'Frontend Test',
                emailText: 'Testing API connectivity from frontend'
            })
        });
        const notificationsData = await notificationsResponse.json();
        console.log('✅ Combined notifications:', notificationsData);
        
        console.log('\n🎯 CONNECTIVITY TEST: SUCCESS');
        console.log('Frontend can reach backend APIs correctly');
        
    } catch (error) {
        console.error('❌ CONNECTIVITY TEST FAILED:', error.message);
        console.log('This indicates the frontend cannot reach the backend');
    }
}

testAPIConnectivity();
