console.log('=== BROWSER ORDER TEST ===');
console.log('Opening browser to test real order submission...');

// Since we can't use puppeteer, let's create a manual test script
// that can be run in browser console

const testScript = `
// This script should be run in browser console on http://localhost:3000
console.log('🧪 MANUAL ORDER TEST STARTED');

// Step 1: Fill form fields
const amountInput = document.querySelector('input[placeholder*="المبلغ"]');
const nameInput = document.querySelector('input[placeholder*="الاسم"]');
const phoneInput = document.querySelector('input[placeholder*="الهاتف"]');
const walletInput = document.querySelector('input[placeholder*="المحفظة"]');

if (amountInput) {
    amountInput.value = '100';
    console.log('✅ Amount filled');
} else {
    console.log('❌ Amount input not found');
}

if (nameInput) {
    nameInput.value = 'Test User';
    console.log('✅ Name filled');
} else {
    console.log('❌ Name input not found');
}

if (phoneInput) {
    phoneInput.value = '0912345678';
    console.log('✅ Phone filled');
} else {
    console.log('❌ Phone input not found');
}

if (walletInput) {
    walletInput.value = '0xf486b33c719ab4d99742f84e5a94d91589403855';
    console.log('✅ Wallet filled');
} else {
    console.log('❌ Wallet input not found');
}

// Step 2: Accept terms
const checkbox = document.querySelector('input[type="checkbox"]');
if (checkbox) {
    checkbox.checked = true;
    console.log('✅ Terms accepted');
} else {
    console.log('❌ Checkbox not found');
}

// Step 3: Monitor network requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const url = args[0];
    if (url.includes('/api/send-')) {
        console.log('🌐 API CALL DETECTED:', url);
        console.log('📤 Request body:', args[1]?.body);
    }
    
    return originalFetch.apply(this, args).then(response => {
        if (url.includes('/api/send-')) {
            console.log('📨 API RESPONSE:', response.status);
            response.clone().json().then(data => {
                console.log('📊 Response data:', data);
            });
        }
        return response;
    });
};

console.log('🔍 Network monitoring enabled');
console.log('📝 Now click the confirm button manually to complete the test');
`;

console.log('\n📋 INSTRUCTIONS:');
console.log('1. Open http://localhost:3000 in your browser');
console.log('2. Open browser console (F12)');
console.log('3. Copy and paste this script:');
console.log('='.repeat(50));
console.log(testScript);
console.log('='.repeat(50));
console.log('4. Run the script, then manually click the confirm button');
console.log('5. Watch console for API calls and responses');
