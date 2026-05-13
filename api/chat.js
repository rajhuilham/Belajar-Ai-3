/**
 * Backend API Endpoint untuk Chat AI
 * 
 * File ini adalah contoh implementasi backend yang bisa digunakan dengan:
 * 1. Node.js + Express
 * 2. Next.js API Routes
 * 3. Vercel Serverless Functions
 * 4. Netlify Functions
 * 
 * PENTING: Jangan pernah expose API key di frontend!
 * Simpan API key di environment variables (.env file)
 */

// ============================================
// OPSI 1: Node.js + Express
// ============================================
/*
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Panggil AI API (contoh dengan Google Gemini)
        const aiResponse = await callGeminiAPI(message);
        
        res.json({ reply: aiResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
*/

// ============================================
// OPSI 2: Next.js API Route
// ============================================
// Simpan file ini di: pages/api/chat.js atau app/api/chat/route.js

// Untuk Next.js Pages Router (pages/api/chat.js):
/*
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        // Panggil AI API
        const aiResponse = await callGeminiAPI(message);
        
        res.status(200).json({ reply: aiResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
*/

// Untuk Next.js App Router (app/api/chat/route.js):
/*
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { message } = await request.json();
        
        // Panggil AI API
        const aiResponse = await callGeminiAPI(message);
        
        return NextResponse.json({ reply: aiResponse });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
*/

// ============================================
// FUNGSI UNTUK MEMANGGIL GOOGLE GEMINI API
// ============================================
async function callGeminiAPI(userMessage) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userMessage
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

// ============================================
// FUNGSI UNTUK MEMANGGIL GROQ API
// ============================================
async function callGroqAPI(userMessage) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768', // atau 'llama2-70b-4096'
                messages: [
                    {
                        role: 'system',
                        content: 'Kamu adalah asisten AI yang membantu menjawab pertanyaan tentang Rajhu Ilham Pradana, seorang mahasiswa Teknik Informatika yang tertarik pada IoT, Cybersecurity, dan UI/UX.'
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000,
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Groq API Error:', error);
        throw error;
    }
}

// ============================================
// FUNGSI UNTUK MEMANGGIL OPENAI API
// ============================================
async function callOpenAIAPI(userMessage) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'Kamu adalah asisten AI yang membantu menjawab pertanyaan tentang Rajhu Ilham Pradana, seorang mahasiswa Teknik Informatika yang tertarik pada IoT, Cybersecurity, dan UI/UX.'
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000,
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw error;
    }
}

// Export fungsi yang akan digunakan
module.exports = {
    callGeminiAPI,
    callGroqAPI,
    callOpenAIAPI
};
