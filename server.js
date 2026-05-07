import express from 'express';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { createServer } from 'http';
import cors from 'cors';
import { createTransport } from 'nodemailer';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Telegram Bot Configuration
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Email Configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || 'infinity@example.com';

console.log('=== NOTIFICATION SERVER ===');
console.log('BOT TOKEN STATUS:', TELEGRAM_TOKEN ? '✅ FOUND' : '❌ MISSING');
console.log('CHAT_ID:', TELEGRAM_CHAT_ID || '❌ NOT SET');
console.log('EMAIL USER:', EMAIL_USER || '❌ NOT SET');
console.log('EMAIL TO:', EMAIL_TO);

// Initialize Telegram Bot
let bot = null;
if (TELEGRAM_TOKEN) {
    try {
        bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });
        console.log('✅ Telegram bot initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Telegram bot:', error.message);
    }
} else {
    console.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables');
}

// Initialize Email Transporter
let emailTransporter = null;
if (EMAIL_USER && EMAIL_PASS) {
    try {
        emailTransporter = createTransport({
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            secure: false,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });
        console.log('✅ Email transporter initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize email transporter:', error.message);
    }
} else {
    console.error('❌ EMAIL credentials not found in environment variables');
}

// Telegram notification endpoint
app.post('/api/send-telegram', async (req, res) => {
    try {
        if (!bot) {
            return res.status(500).json({ 
                success: false, 
                error: 'Telegram bot not initialized' 
            });
        }

        if (!TELEGRAM_CHAT_ID) {
            return res.status(500).json({ 
                success: false, 
                error: 'TELEGRAM_CHAT_ID not configured' 
            });
        }

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Message is required' 
            });
        }

        console.log('📤 Sending Telegram message:', message);
        
        const result = await bot.sendMessage(TELEGRAM_CHAT_ID, message);
        
        console.log('✅ Telegram message sent successfully');
        console.log(`📨 Message ID: ${result.message_id}`);
        console.log(`🕐 Sent at: ${new Date(result.date * 1000).toISOString()}`);

        res.json({ 
            success: true, 
            messageId: result.message_id,
            timestamp: new Date(result.date * 1000).toISOString()
        });

    } catch (error) {
        console.error('❌ Failed to send Telegram message:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Email notification endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        if (!emailTransporter) {
            return res.status(500).json({ 
                success: false, 
                error: 'Email transporter not initialized' 
            });
        }

        const { subject, text, html } = req.body;

        if (!subject && !text && !html) {
            return res.status(400).json({ 
                success: false, 
                error: 'Subject or content is required' 
            });
        }

        console.log('📧 Sending email notification...');
        
        const mailOptions = {
            from: EMAIL_USER,
            to: EMAIL_TO,
            subject: subject || 'Infinity Order Notification',
            text: text || '',
            html: html || text || ''
        };

        const result = await emailTransporter.sendMail(mailOptions);
        
        console.log('✅ Email sent successfully');
        console.log(`📨 Message ID: ${result.messageId}`);
        console.log(`🕐 Sent at: ${new Date().toISOString()}`);

        res.json({ 
            success: true, 
            messageId: result.messageId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Combined notification endpoint (sends both Telegram and Email)
app.post('/api/send-notifications', async (req, res) => {
    try {
        const { telegramMessage, emailSubject, emailText, emailHtml } = req.body;
        const results = {};

        // Send Telegram notification
        if (telegramMessage && bot && TELEGRAM_CHAT_ID) {
            try {
                const telegramResult = await bot.sendMessage(TELEGRAM_CHAT_ID, telegramMessage);
                results.telegram = { 
                    success: true, 
                    messageId: telegramResult.message_id,
                    timestamp: new Date(telegramResult.date * 1000).toISOString()
                };
                console.log('✅ Telegram notification sent successfully');
            } catch (error) {
                results.telegram = { success: false, error: error.message };
                console.error('❌ Telegram notification failed:', error.message);
            }
        } else {
            results.telegram = { success: false, error: 'Telegram not configured or no message' };
        }

        // Send Email notification
        if ((emailSubject || emailText || emailHtml) && emailTransporter) {
            try {
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

        res.json({ 
            success: true, 
            results: results
        });

    } catch (error) {
        console.error('❌ Failed to send notifications:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Order submission endpoint
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        console.log('📦 New order received:', orderData);

        // Send Telegram notification
        if (bot && TELEGRAM_CHAT_ID) {
            try {
                await bot.sendMessage(TELEGRAM_CHAT_ID, orderData.message);
                console.log('✅ Order notification sent to Telegram');
            } catch (error) {
                console.error('❌ Failed to send Telegram notification:', error.message);
            }
        }

        // Send email notification
        if (emailTransporter) {
            try {
                const mailOptions = {
                    from: EMAIL_USER,
                    to: EMAIL_TO,
                    subject: `New Order: ${orderData.operation} ${orderData.amount} ${orderData.currency}`,
                    text: orderData.message,
                    html: `<pre>${orderData.message}</pre>`
                };
                await emailTransporter.sendMail(mailOptions);
                console.log('✅ Order notification sent by email');
            } catch (error) {
                console.error('❌ Failed to send email notification:', error.message);
            }
        }

        res.json({ 
            success: true, 
            message: 'Order received and processed successfully',
            order: orderData
        });

    } catch (error) {
        console.error('❌ Failed to process order:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        telegram: bot ? 'connected' : 'disconnected',
        chatId: TELEGRAM_CHAT_ID ? 'configured' : 'not configured',
        email: emailTransporter ? 'connected' : 'disconnected',
        emailUser: EMAIL_USER ? 'configured' : 'not configured'
    });
});

// Test endpoint
app.get('/api/test-telegram', async (req, res) => {
    try {
        if (!bot) {
            return res.status(500).json({ 
                success: false, 
                error: 'Telegram bot not initialized' 
            });
        }

        const testMessage = 'Infinity Telegram notifications restored successfully';
        
        const result = await bot.sendMessage(TELEGRAM_CHAT_ID, testMessage);
        
        console.log('✅ Test message sent successfully');
        
        res.json({ 
            success: true, 
            messageId: result.message_id,
            message: testMessage
        });

    } catch (error) {
        console.error('❌ Test message failed:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`🌐 Network access: http://192.168.1.207:${PORT}`);
    console.log('📡 Telegram notification API ready');
    
    // Log final status
    console.log('\n=== FINAL STATUS ===');
    console.log('BOT TOKEN STATUS:', TELEGRAM_TOKEN ? '✅ WORKING' : '❌ MISSING');
    console.log('CHAT_ID:', TELEGRAM_CHAT_ID || '❌ NOT SET');
    console.log('TELEGRAM STATUS:', bot ? '✅ WORKING' : '❌ NOT WORKING');
    console.log('EMAIL STATUS:', emailTransporter ? '✅ WORKING' : '❌ NOT WORKING');
    console.log('SERVER STATUS: ✅ RUNNING');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

export default app;
