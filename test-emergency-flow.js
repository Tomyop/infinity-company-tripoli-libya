// TEST EMERGENCY RECOVERY FLOW
// This script tests the complete Frontend → Apps Script → Telegram flow

// Test 1: Simulate frontend request with complete data
function testEmergencyFlow() {
  console.log('🧪 TESTING EMERGENCY RECOVERY FLOW');
  
  // Simulate the exact data structure the frontend sends
  const frontendData = {
    operationType: 'شراء',
    currency: 'USDT',
    amount: '100',
    walletAddress: '0xf486b33c719ab4d99742f84e5a94d91589403855',
    network: 'BEP20',
    customerPhone: '0912345678',
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 FRONTEND DATA:', frontendData);
  
  // Simulate the Apps Script Web App call
  fetch('https://script.google.com/macros/s/AKfycbzbleLu6AaM72rVP4oihBWtqtbWqs9vH28_LDi2FxlAYifs-n4LIDdZ13p6Ot0ZBa7O/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(frontendData)
  })
  .then(response => {
    console.log('📊 APPS SCRIPT RESPONSE STATUS:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ APPS SCRIPT RESPONSE DATA:', data);
  })
  .catch(error => {
    console.error('❌ APPS SCRIPT ERROR:', error);
  });
}

// Test 2: Test with missing fields (edge case)
function testEmergencyFlowMissingFields() {
  console.log('🧪 TESTING EMERGENCY FLOW WITH MISSING FIELDS');
  
  const incompleteData = {
    operationType: 'بيع',
    currency: 'BTC',
    amount: '0.01',
    // Missing: walletAddress, network, customerPhone
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 INCOMPLETE DATA:', incompleteData);
  
  fetch('https://script.google.com/macros/s/AKfycbzbleLu6AaM72rVP4oihBWtqtbWqs9vH28_LDi2FxlAYifs-n4LIDdZ13p6Ot0ZBa7O/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(incompleteData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ INCOMPLETE DATA RESPONSE:', data);
  })
  .catch(error => {
    console.error('❌ INCOMPLETE DATA ERROR:', error);
  });
}

// Test 3: Test with empty/null values
function testEmergencyFlowEmptyValues() {
  console.log('🧪 TESTING EMERGENCY FLOW WITH EMPTY VALUES');
  
  const emptyData = {
    operationType: '',
    currency: '',
    amount: '',
    walletAddress: '',
    network: '',
    customerPhone: '',
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 EMPTY DATA:', emptyData);
  
  fetch('https://script.google.com/macros/s/AKfycbzbleLu6AaM72rVP4oihBWtqtbWqs9vH28_LDi2FxlAYifs-n4LIDdZ13p6Ot0ZBa7O/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(emptyData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ EMPTY DATA RESPONSE:', data);
  })
  .catch(error => {
    console.error('❌ EMPTY DATA ERROR:', error);
  });
}

// Run all tests
console.log('🚀 STARTING EMERGENCY RECOVERY TESTS');
testEmergencyFlow();
setTimeout(testEmergencyFlowMissingFields, 2000);
setTimeout(testEmergencyFlowEmptyValues, 4000);

console.log('📋 TEST INSTRUCTIONS:');
console.log('1. Copy the emergency-recovery-apps-script.js to your Google Apps Script project');
console.log('2. Deploy as Web App with "Execute as me" and "Anyone has access"');
console.log('3. Update the URL in the frontend if needed');
console.log('4. Check Telegram for test messages');
console.log('5. Check Apps Script execution logs for detailed debugging');
console.log('');
console.log('🔧 EXPECTED BEHAVIOR:');
console.log('- Each test should send "TEST MESSAGE RECEIVED" to Telegram first');
console.log('- Then send the order details to Telegram');
console.log('- Apps Script logs should show detailed parsing information');
console.log('- Frontend should receive success responses');
