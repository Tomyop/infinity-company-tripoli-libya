console.log('=== COMPLETE ORDER TEST WITH TERMS ACCEPTANCE ===');

const completeTestScript = `
// Complete order test script for browser console
console.log('🧪 COMPLETE ORDER TEST STARTED');

// Step 1: Find all form elements
const amountInput = document.querySelector('input[placeholder*="المبلغ"]');
const nameInput = document.querySelector('input[placeholder*="الاسم"]');
const phoneInput = document.querySelector('input[placeholder*="الهاتف"]');
const walletInput = document.querySelector('input[placeholder*="المحفظة"]');
const checkbox = document.querySelector('input[type="checkbox"]');
const confirmButton = document.querySelector('button');

console.log('🔍 Elements found:', {
    amount: !!amountInput,
    name: !!nameInput,
    phone: !!phoneInput,
    wallet: !!walletInput,
    checkbox: !!checkbox,
    button: !!confirmButton
});

// Step 2: Fill all required fields
if (amountInput) {
    amountInput.value = '100';
    amountInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Amount: 100');
}

if (nameInput) {
    nameInput.value = 'Test User';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Name: Test User');
}

if (phoneInput) {
    phoneInput.value = '0912345678';
    phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Phone: 0912345678');
}

if (walletInput) {
    walletInput.value = '0xf486b33c719ab4d99742f84e5a94d91589403855';
    walletInput.dispatchEvent(new Event('input', { bubbles: true }));
    console.log('✅ Wallet: 0xf486b33c719ab4d99742f84e5a94d91589403855');
}

// Step 3: Accept terms (CRITICAL!)
if (checkbox) {
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('✅ Terms accepted');
}

// Step 4: Check button state
setTimeout(() => {
    if (confirmButton) {
        console.log('🔘 Button state:', {
            disabled: confirmButton.disabled,
            text: confirmButton.textContent
        });
        
        if (confirmButton.disabled) {
            console.log('❌ Button is still disabled - checking why...');
            console.log('Amount filled:', !!amountInput?.value);
            console.log('Terms accepted:', checkbox?.checked);
        } else {
            console.log('✅ Button is enabled - ready to submit');
            
            // Step 5: Monitor network requests
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
            console.log('🚀 Clicking confirm button now...');
            
            // Step 6: Click the button
            confirmButton.click();
        }
    }
}, 1000);
`;

console.log('\n📋 COMPLETE TEST INSTRUCTIONS:');
console.log('1. Open http://localhost:3000 in your browser');
console.log('2. Open browser console (F12)');
console.log('3. Copy and paste this complete script:');
console.log('='.repeat(60));
console.log(completeTestScript);
console.log('='.repeat(60));
console.log('4. Run the script - it will automatically fill form and submit');
console.log('5. Watch console for handleConfirm execution and API calls');
