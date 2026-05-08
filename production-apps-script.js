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
