# 🚀 DEPLOY INSTRUCTIONS

## 📋 STEPS TO SAVE AND REDEPLOY GOOGLE APPS SCRIPT

### **Step 1: Save the Updated Script**
1. Open Google Apps Script Editor
2. Copy the entire updated code from `google-apps-script-telegram.js`
3. Paste it into the Apps Script editor
4. Click **Save** (💾 icon)

### **Step 2: Update Form Trigger**
1. In Apps Script Editor, go to **Triggers** (⏰ icon)
2. Check that `onFormSubmit` is triggered by the Google Form
3. If not, click **Add Trigger**:
   - Function: `onFormSubmit`
   - Deployment: `Head`
   - Event source: `From spreadsheet`
   - Event type: `On form submit`
   - Click **Save**

### **Step 3: Redeploy the Script**
1. Go to **Deploy** → **New deployment**
2. Select type: **Web app**
3. Configuration:
   - Description: "Infinity Company Telegram Notifications"
   - Execute as: "Me (your-email@gmail.com)"
   - Who has access: "Anyone"
4. Click **Deploy**
5. Authorize the script when prompted
6. Copy the new Web app URL

### **Step 4: Update Google Form Settings**
1. Open your Google Form
2. Go to **Settings** → **Responses**
3. Under "Response destination", ensure it's linked to the Google Sheet
4. The Google Sheet should have the Apps Script trigger attached

### **Step 5: Test the New UI**
1. Fill out the form with test data
2. Submit the form
3. Check Google Apps Script logs:
   - Go to Apps Script Editor
   - Click **Executions** (🔍 icon)
   - Look for the latest execution
   - Verify the debugging logs show correct field extraction

## 🔍 DEBUGGING CHECKLIST

### **Expected Debug Logs:**
```
🔍 DEBUG: ALL namedValues keys:
  - KEY: 'رقم الهاتف' -> ['+218123456789']
  - KEY: 'المبلغ' -> ['100']
  - KEY: 'العملة' -> ['USDT']
  - KEY: 'السعر' -> ['5.50']
  - KEY: 'الإجمالي' -> ['550.00']
  - KEY: 'طريقة الدفع' -> ['تحويل بنكي']
  - KEY: 'عنوان المحفظة' -> ['TQn9Vn...']
  - KEY: 'الشبكة' -> ['TRC20']
  - KEY: 'العملية' -> ['شراء']

📊 EXTRACTED_FORM_DATA:
  - OPERATION_TYPE: 'شراء'
  - CURRENCY: 'USDT'
  - AMOUNT: '100'
  - PRICE: '5.50'
  - TOTAL: '550.00'
  - PAYMENT_METHOD: 'تحويل بنكي'
  - PHONE: '+218123456789'
  - WALLET_ADDRESS: 'TQn9Vn...'
  - NETWORK: 'TRC20'
```

### **Expected Telegram Message:**
```
✨ Infinity Company
📲 WhatsApp: +393895724547

🧾 Order #123456

🚀 طلب جديد

━━━━━━━━━━━━━━

📊 تفاصيل العملية:
• العملية: شراء
• العملة: USDT
• المبلغ: 100
• السعر: 5.50
• الإجمالي: 550.00
• طريقة الدفع: تحويل بنكي

━━━━━━━━━━━━━━

📞 رقم الهاتف:
+218123456789

━━━━━━━━━━━━━━

👤 بيانات الزبون:
• عنوان المحفظة:
TQn9Vn...

• الشبكة:
TRC20

━━━━━━━━━━━━━━

📂 المستندات المطلوبة لإتمام إجراء التحويل

🛂 يجب توفير صورة من جواز السفر
🏦 يجب توفير صورة من رقم الحساب المصرفي
📱 يجب توفير صورة من تطبيق العملة الرقمية لإثبات الملكية للطرف الواحد

━━━━━━━━━━━━━━

🕐 وقت الطلب: 5/8/2026, 1:30:45 PM
🔧 المصدر: Google Form Submission
```

## 🐛 TROUBLESHOOTING

### **If Still Getting Undefined Values:**
1. Check the exact field names in your Google Form
2. Compare with the namedValues keys in the debug logs
3. Update the field extraction code accordingly

### **If Old Template Still Shows:**
1. Ensure you saved the new code in Apps Script
2. Redeploy the Web app
3. Clear browser cache and test again

### **If No Notifications:**
1. Check Apps Script Executions for errors
2. Verify the trigger is active
3. Check Telegram bot token and chat ID

## ✅ SUCCESS INDICATORS

- ✅ Debug logs show all field values correctly
- ✅ Telegram message uses new Infinity Company UI
- ✅ No "undefined" values in the message
- ✅ Order number is generated randomly
- ✅ All sections display correctly with separators

**After completing these steps, run a live test to confirm the new UI works!** 🎉
