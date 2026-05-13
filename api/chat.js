export default async function handler(req, res) {
    // Pastikan hanya menerima request POST dari frontend
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        // 1. Memberikan kepribadian agar bot kenal kamu
        const systemPrompt = "Kamu adalah Kiro, asisten virtual di website portofolio Rajhu Ilham Pradana (mahasiswa Teknik Informatika, fokus pada IoT, Cybersecurity, dan UI/UX). Jawab pertanyaan pengunjung secara profesional, ramah, dan singkat.\n\nPertanyaan pengunjung: ";
        
        const fullMessage = systemPrompt + message;

        // 2. Memanggil Google Gemini API
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullMessage }] }],
                generationConfig: { 
                    temperature: 0.7, 
                    maxOutputTokens: 1000 
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const replyText = data.candidates[0].content.parts[0].text;
        
        // 3. Mengirim balasan ke frontend
        res.status(200).json({ reply: replyText });
        
    } catch (error) {
        console.error('Error dari Backend:', error);
        res.status(500).json({ reply: 'Maaf, sistem sedang sibuk. Silakan coba lagi nanti.' });
    }
}