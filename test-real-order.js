import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

console.log('=== REAL END-TO-END ORDER TEST ===');
console.log('Testing actual browser order submission...');

async function testRealOrder() {
    let browser;
    try {
        console.log('\n🚀 Step 1: Launching browser...');
        browser = await puppeteer.launch({ 
            headless: false, // Show browser for debugging
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        console.log('📱 Step 2: Opening frontend...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        
        // Wait for app to load
        await page.waitForSelector('#app', { timeout: 10000 });
        
        console.log('📝 Step 3: Filling order form...');
        
        // Fill amount
        await page.type('input[placeholder*="المبلغ"]', '100', { delay: 100 });
        
        // Fill customer details
        await page.type('input[placeholder*="الاسم"]', 'Test User', { delay: 100 });
        await page.type('input[placeholder*="الهاتف"]', '0912345678', { delay: 100 });
        await page.type('input[placeholder*="المحفظة"]', '0xf486b33c719ab4d99742f84e5a94d91589403855', { delay: 100 });
        
        // Accept terms
        await page.waitForSelector('input[type="checkbox"]', { timeout: 5000 });
        await page.click('input[type="checkbox"]');
        
        console.log('✅ Step 4: Submitting order...');
        
        // Monitor network requests
        const requests = [];
        page.on('request', request => {
            if (request.url().includes('/api/send-')) {
                requests.push({
                    url: request.url(),
                    method: request.method(),
                    postData: request.postData()
                });
                console.log('🌐 API Request:', request.url());
            }
        });
        
        page.on('response', response => {
            if (response.url().includes('/api/send-')) {
                console.log('📨 API Response:', response.status(), response.url());
            }
        });
        
        // Click confirm button
        await page.waitForSelector('button:contains("تأكيد")', { timeout: 5000 });
        await page.click('button:contains("تأكيد")');
        
        // Wait for success message
        try {
            await page.waitForSelector('div:contains("تم تسجيل طلبك بنجاح")', { timeout: 10000 });
            console.log('✅ Success message displayed');
        } catch (error) {
            console.log('⚠️ Success message not found, checking for any success indicator...');
        }
        
        // Wait a bit more for notifications to be sent
        await page.waitForTimeout(3000);
        
        console.log('\n📊 Step 5: Analyzing results...');
        
        if (requests.length > 0) {
            console.log(`✅ Found ${requests.length} API requests:`);
            requests.forEach((req, index) => {
                console.log(`  ${index + 1}. ${req.method} ${req.url}`);
                if (req.postData) {
                    try {
                        const data = JSON.parse(req.postData);
                        console.log(`     Body:`, JSON.stringify(data, null, 2));
                    } catch (e) {
                        console.log(`     Body: ${req.postData}`);
                    }
                }
            });
        } else {
            console.log('❌ NO API REQUESTS FOUND - This is the problem!');
            console.log('   The frontend is not calling the notification API');
        }
        
        // Check browser console for errors
        const consoleMessages = await page.evaluate(() => {
            const messages = [];
            const originalLog = console.log;
            const originalError = console.error;
            
            console.log = (...args) => messages.push({ type: 'log', args });
            console.error = (...args) => messages.push({ type: 'error', args });
            
            return messages;
        });
        
        if (consoleMessages.length > 0) {
            console.log('\n🖥️ Browser Console Messages:');
            consoleMessages.forEach(msg => {
                console.log(`  ${msg.type.toUpperCase()}:`, msg.args.join(' '));
            });
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testRealOrder().then(() => {
    console.log('\n🏁 Real order test completed');
}).catch(console.error);
