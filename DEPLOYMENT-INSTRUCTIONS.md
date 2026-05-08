# DEPLOYMENT INSTRUCTIONS - PRODUCTION RECOVERY

## 🚀 IMMEDIATE ACTIONS REQUIRED

### 1. GOOGLE APPS SCRIPT DEPLOYMENT

**Copy this code to Google Apps Script:**
```javascript
// PRODUCTION APPS SCRIPT - SIMPLE WORKING FLOW
// Frontend → Apps Script Web App → Telegram

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  const message = 
    "🚀 TEST ORDER\n\n" +
    "Currency: " + data.currency + "\n" +
    "Amount: " + data.amount + "\n" +
    "Phone: " + data.customerPhone;
  
  UrlFetchApp.fetch(
    "https://api.telegram.org/bot8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE/sendMessage",
    {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: "8624852792",
        text: message
      })
    }
  );
  
  return ContentService
    .createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

**Deployment Settings:**
- ✅ Web App
- ✅ Execute as: Me
- ✅ Access: Anyone
- ✅ Deploy URL: https://script.google.com/macros/s/AKfycbzbleLu6AaM72rVP4oihBWtqtbWqs9vH28_LDi2FxlAYifs-n4LIDdZ13p6Ot0ZBa7O/exec

### 2. FRONTEND STATUS ✅

**App.jsx Updated:**
- ✅ Correct fetch URL
- ✅ Required fields: operationType, currency, amount, total, paymentMethod, customerPhone, walletAddress, network
- ✅ Proper headers: "Content-Type": "text/plain;charset=utf-8"

**Build Status:**
- ✅ npm run build - COMPLETED
- ✅ npm run dev -- --host - RUNNING
- ✅ Local: http://localhost:3001/
- ✅ Network: http://192.168.1.207:3001/

### 3. TELEGRAM CONFIGURATION ✅

**Bot Token:** 8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE
**Chat ID:** 8624852792

### 4. TEST FLOW

**Expected Message Format:**
```
🚀 TEST ORDER

Currency: USDT
Amount: 100
Phone: 0912345678
```

**Test Steps:**
1. Open http://localhost:3001/
2. Fill form with test data
3. Submit order
4. Check Telegram for message
5. Check browser console for logs

### 5. VERIFICATION CHECKLIST

- [ ] Apps Script deployed successfully
- [ ] Web App URL accessible
- [ ] Frontend sends to correct URL
- [ ] Telegram message received
- [ ] Browser shows success response

### 6. NEXT STEPS AFTER SUCCESS

Once basic flow works:
1. Add more order details to message
2. Restore premium Infinity template
3. Add error handling
4. Add retry logic

**CURRENT PRIORITY: Get ANY Telegram message working first!**
