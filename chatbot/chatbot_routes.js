const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const router = express.Router();

// Initialize OpenAI with API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Utility function for input validation
function validateMessage(message) {
    return message && typeof message === 'string' && message.trim().length > 0;
}

// POST /api/chat - Chatbot API endpoint
router.post('/', async (req, res) => {
    const { message, model = 'gpt-4' } = req.body; // Default to GPT-4 if no model is specified

    if (!validateMessage(message)) {
        return res.status(400).json({ error: 'A valid message is required.' });
    }

    try {
        console.log('Received message:', message); // Debug log

        // OpenAI API request
        const response = await openai.createChatCompletion({
            model,
            messages: [
                {
                    role: 'system',
                    content:
                        process.env.SYSTEM_ROLE ||
                        'You are a helpful chatbot assistant specializing in Automated Market Makers.',
                },
                { role: 'user', content: message },
            ],
            max_tokens: 150, // Adjust token limit as needed
        });

        // Extract and send reply
        const reply = response.data.choices[0]?.message?.content.trim();
        if (!reply) {
            throw new Error('No reply generated by OpenAI.');
        }

        console.log('Generated reply:', reply); // Debug log
        res.json({ reply });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);

        // Handle specific OpenAI errors
        const status = error.response?.status || 500;
        const errorMessage = error.response?.data?.error?.message || 'Failed to generate a response.';
        res.status(status).json({ error: errorMessage });
    }
});

module.exports = router;
