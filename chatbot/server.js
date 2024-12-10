const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// Validate required environment variables
['OPENAI_API_KEY', 'SYSTEM_ROLE'].forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Environment variable ${varName} is missing.`);
        process.exit(1);
    }
});

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI API Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: ['http://localhost:3000', 'https://your-production-site.com'] }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev')); // Dynamic logging

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api', apiLimiter);

// Utility function for input validation
function validateMessage(message) {
    return message && typeof message === 'string' && message.trim().length > 0;
}

// API Endpoint for Chatbot
app.post('/api/chat', async (req, res) => {
    const { message, model = 'gpt-4' } = req.body;
    const ALLOWED_MODELS = ['gpt-4', 'gpt-3.5-turbo']; // Allowed OpenAI models

    if (!validateMessage(message)) {
        return res.status(400).json({ error: 'Invalid message. Please provide a valid input.' });
    }

    if (!ALLOWED_MODELS.includes(model)) {
        return res.status(400).json({ error: 'Invalid model specified.' });
    }

    try {
        console.log('Received message:', message);

        const response = await openai.chat.completions.create({
            model,
            messages: [
                {
                    role: 'system',
                    content: process.env.SYSTEM_ROLE || 'You are a helpful assistant specializing in Automated Market Makers.',
                },
                { role: 'user', content: message },
            ],
            max_tokens: 150,
        });

        const botReply = response.choices[0]?.message?.content.trim();
        if (!botReply) throw new Error('No response generated from OpenAI.');

        console.log('Generated response:', botReply);
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error.message);
        res.status(500).json({ error: error.response?.data?.error?.message || 'An error occurred. Please try again later.' });
    }
});

// Centralized Error Handler
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err.stack || err.message);
    res.status(err.status || 500).json({ error: err.message || 'An unexpected error occurred. Please try again later.' });
});

// Graceful Shutdown Handling
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('Server terminated.');
    process.exit(0);
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
