import TelegramBot from 'node-telegram-bot-api';
import { createTransport } from 'nodemailer';

export default async function handler(req, res) {
  // Add comprehensive logging at function start
  console.log('🚀 SEND-NOTIFICATIONS FUNCTION STARTED');
  console.log('🔍 REQUEST METHOD:', req.method);
  console.log('🔍 REQUEST HEADERS:', JSON.stringify(req.headers, null, 2));
  console.log('🔍 REQUEST BODY:', JSON.stringify(req.body, null, 2));
  console.log('🔍 ENVIRONMENT CHECK:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_REGION: process.env.VERCEL_REGION,
    TELEGRAM_TOKEN_EXISTS: !!process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID_EXISTS: !!process.env.TELEGRAM_CHAT_ID,
    EMAIL_USER_EXISTS: !!process.env.EMAIL_USER,
    EMAIL_PASS_EXISTS: !!process.env.EMAIL_PASS
  });
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.error('❌ METHOD NOT ALLOWED:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['POST'],
      receivedMethod: req.method
    });
  }

  // Add CORS headers for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  console.log('✅ CORS HEADERS SET');

  try {
    const { telegramMessage, emailSubject, emailText, emailHtml } = req.body;
    const results = {};

    // Telegram Configuration
    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log('🔍 TELEGRAM CONFIGURATION CHECK:');
    console.log('  - BOT TOKEN EXISTS:', TELEGRAM_TOKEN ? '✅ YES' : '❌ NO');
    console.log('  - CHAT ID EXISTS:', TELEGRAM_CHAT_ID ? '✅ YES' : '❌ NO');
    console.log('  - TOKEN LENGTH:', TELEGRAM_TOKEN ? TELEGRAM_TOKEN.length : 0);
    console.log('  - CHAT ID:', TELEGRAM_CHAT_ID || 'NOT SET');
    console.log('  - NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
    console.log('  - VERCEL_ENV:', process.env.VERCEL_ENV || 'NOT SET');

    // Email Configuration
    const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const EMAIL_PORT = process.env.EMAIL_PORT || 587;
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const EMAIL_TO = process.env.EMAIL_TO || 'infinity@example.com';

    // Send Telegram notification
    if (telegramMessage && TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        console.log('🤖 Initializing Telegram bot...');
        const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });
        
        console.log('📤 Sending Telegram message:');
        console.log('  - CHAT ID:', TELEGRAM_CHAT_ID);
        console.log('  - MESSAGE LENGTH:', telegramMessage.length);
        console.log('  - MESSAGE PREVIEW:', telegramMessage.substring(0, 100) + (telegramMessage.length > 100 ? '...' : ''));
        
        const telegramResult = await bot.sendMessage(TELEGRAM_CHAT_ID, telegramMessage);
        
        console.log('✅ Telegram message sent successfully');
        console.log(`📨 Message ID: ${telegramResult.message_id}`);
        console.log(`🕐 Sent at: ${new Date(telegramResult.date * 1000).toISOString()}`);
        console.log(`📊 Response:`, JSON.stringify(telegramResult, null, 2));
        
        results.telegram = { 
          success: true, 
          messageId: telegramResult.message_id,
          timestamp: new Date(telegramResult.date * 1000).toISOString()
        };
        console.log('✅ Telegram notification sent successfully');
      } catch (error) {
        console.error('❌ Failed to send Telegram message:');
        console.error('  - ERROR:', error.message);
        console.error('  - ERROR CODE:', error.code || 'N/A');
        console.error('  - ERROR TYPE:', error.constructor.name);
        console.error('  - FULL STACK:', error.stack);
        console.error('  - TELEGRAM_TOKEN EXISTS:', !!process.env.TELEGRAM_BOT_TOKEN);
        console.error('  - TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID || 'NOT SET');
        
        results.telegram = { 
          success: false, 
          error: error.message,
          debug: {
            errorCode: error.code,
            errorType: error.constructor.name,
            tokenExists: !!process.env.TELEGRAM_BOT_TOKEN,
            chatId: process.env.TELEGRAM_CHAT_ID || 'NOT SET',
            nodeEnv: process.env.NODE_ENV,
            vercelEnv: process.env.VERCEL_ENV
          }
        };
        console.error('❌ Telegram notification failed:', error.message);
      }
    } else {
      console.log('❌ Telegram not configured or no message:');
      console.log('  - telegramMessage exists:', !!telegramMessage);
      console.log('  - TELEGRAM_TOKEN exists:', !!TELEGRAM_TOKEN);
      console.log('  - TELEGRAM_CHAT_ID exists:', !!TELEGRAM_CHAT_ID);
      results.telegram = { success: false, error: 'Telegram not configured or no message' };
    }

    // Send Email notification
    if ((emailSubject || emailText || emailHtml) && EMAIL_USER && EMAIL_PASS) {
      try {
        const emailTransporter = createTransport({
          host: EMAIL_HOST,
          port: EMAIL_PORT,
          secure: false,
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
          }
        });

        const mailOptions = {
          from: EMAIL_USER,
          to: EMAIL_TO,
          subject: emailSubject || 'Infinity Order Notification',
          text: emailText || '',
          html: emailHtml || emailText || ''
        };

        const emailResult = await emailTransporter.sendMail(mailOptions);
        results.email = { 
          success: true, 
          messageId: emailResult.messageId,
          timestamp: new Date().toISOString()
        };
        console.log('✅ Email notification sent successfully');
      } catch (error) {
        results.email = { success: false, error: error.message };
        console.error('❌ Email notification failed:', error.message);
      }
    } else {
      results.email = { success: false, error: 'Email not configured or no content' };
    }

    console.log('📤 SENDING RESPONSE:');
    console.log('  - SUCCESS:', true);
    console.log('  - RESULTS:', JSON.stringify(results, null, 2));
    
    res.status(200).json({ 
      success: true, 
      results: results,
      timestamp: new Date().toISOString()
    });
    console.log('✅ RESPONSE SENT SUCCESSFULLY');

  } catch (error) {
    console.error('❌ CATCH BLOCK - FUNCTION ERROR:');
    console.error('  - ERROR:', error.message);
    console.error('  - ERROR TYPE:', error.constructor.name);
    console.error('  - ERROR STACK:', error.stack);
    console.error('  - REQUEST BODY:', req.body);
    console.error('  - REQUEST METHOD:', req.method);
    console.error('  - ENVIRONMENT:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_REGION: process.env.VERCEL_REGION
    });
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      errorType: error.constructor.name,
      timestamp: new Date().toISOString(),
      debug: {
        stack: error.stack,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_ENV: process.env.VERCEL_ENV,
          VERCEL_REGION: process.env.VERCEL_REGION
        }
      }
    });
    console.log('❌ ERROR RESPONSE SENT');
  }
}
