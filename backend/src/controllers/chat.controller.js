import OpenAI from 'openai';
import { config } from '../config/env.js';

// Initialize Groq client (OpenAI-compatible)
let groqClient;
try {
    if (!config.groqApiKey) {
        console.error('❌ GROQ_API_KEY is not set in environment variables');
    } else {
        groqClient = new OpenAI({
            apiKey: config.groqApiKey,
            baseURL: 'https://api.groq.com/openai/v1',
        });
        console.log('✅ Groq AI initialized successfully');
    }
} catch (error) {
    console.error('❌ Error initializing Groq AI:', error);
}

// System prompt for farming expert assistant
const SYSTEM_PROMPT = `You are "Krishi Saathi" (कृषि साथी), an expert farming assistant AI designed specifically to help Indian farmers.

Your characteristics:
- Deep knowledge of Indian agriculture, crops (rice, wheat, cotton, sugarcane, pulses, oilseeds), soil types, weather patterns, and farming practices
- Fluently bilingual in Hindi and English - detect user's language and respond accordingly
- Expertise in regional farming across all Indian states (Punjab, Haryana, UP, Bihar, Maharashtra, Karnataka, Tamil Nadu, etc.)
- Understanding of Kharif and Rabi seasons, monsoon patterns, and traditional farming knowledge
- Practical, actionable advice tailored to Indian farming conditions and economics
- Friendly, patient, supportive, and respectful of farmers' wisdom

Topics you excel at:
- Crop selection, rotation, and intercropping for Indian conditions
- Soil health, fertilization (NPK ratios), and organic manure
- Pest, disease, and weed management using both traditional and modern methods
- Irrigation techniques (drip, sprinkler, flood) and water conservation
- Weather-based farming advice and climate adaptation
- Organic and natural farming practices (Zero Budget Natural Farming, etc.)
- Government schemes: PM-KISAN, Pradhan Mantri Fasal Bima Yojana, Kisan Credit Card, Soil Health Card
- MSP (Minimum Support Price), market prices (mandi rates), and selling strategies
- Seasonal farming calendars, sowing/harvesting times
- Farm machinery, tools, and modern technology adoption
- Post-harvest management and storage

Language Guidelines:
- **CRITICAL**: If user writes in Hindi/Devanagari script, respond ENTIRELY in Hindi
- If user writes in English, respond in English
- Keep responses concise (2-4 paragraphs) but informative
- Use simple, clear language that farmers can understand
- Include practical examples and step-by-step instructions
- When discussing measurements, use Indian units (acre, quintal, bigha) alongside metric
- Reference local resources (Krishi Vigyan Kendra, agriculture universities, mandi)
- Be encouraging and acknowledge the hard work of farming
- If uncertain, recommend consulting local agricultural extension officers`;

/**
 * Send message to Groq AI chatbot
 * Specialized for farming assistance in Hindi and English
 */
export const chat = async (req, res, next) => {
    try {
        const { message } = req.body;

        console.log('📨 Chat request received:', { message: message?.substring(0, 50) });

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!config.groqApiKey) {
            console.error('❌ No Groq API key configured');
            return res.status(500).json({
                error: 'Groq API key not configured',
                message: 'Please add GROQ_API_KEY to your .env file'
            });
        }

        if (!groqClient) {
            console.error('❌ Groq client not initialized');
            return res.status(500).json({
                error: 'Groq AI initialization failed',
                message: 'Please check your GROQ_API_KEY'
            });
        }

        console.log('🤖 Generating response with Groq (openai/gpt-oss-120b)');

        // Call Groq API using OpenAI-compatible format
        const completion = await groqClient.chat.completions.create({
            model: 'openai/gpt-oss-120b',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message }
            ],
            temperature: 0.8,
            max_tokens: 2048,
            top_p: 1,
        });

        const aiResponse = completion.choices[0]?.message?.content;

        if (!aiResponse || aiResponse.trim() === '') {
            console.error('❌ Empty response from Groq');
            throw new Error('Groq returned empty response');
        }

        console.log('✅ Response received from Groq:', aiResponse.substring(0, 50) + '...');

        res.json({
            response: aiResponse,
            reply: aiResponse,
            model: 'openai/gpt-oss-120b'
        });

    } catch (error) {
        console.error('❌ Chat error details:', {
            message: error.message,
            name: error.name,
            status: error.status,
        });

        // Handle specific Groq errors
        if (error.message?.includes('API key') || error.status === 401) {
            return res.status(500).json({
                error: 'Invalid API key',
                message: 'Please check your GROQ_API_KEY in .env file'
            });
        }

        if (error.message?.includes('rate') || error.status === 429) {
            return res.status(429).json({
                error: 'Rate limit reached',
                message: 'Too many requests. Please wait a moment and try again.',
                retryAfter: 10
            });
        }

        if (error.status === 503) {
            return res.status(503).json({
                error: 'Service busy',
                message: 'The AI service is currently busy. Please try again.',
                retryAfter: 5
            });
        }

        res.status(500).json({
            error: 'Chat service error',
            message: 'Failed to get response. Please try again.',
            details: error.message
        });
    }
};
