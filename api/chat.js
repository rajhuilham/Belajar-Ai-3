module.exports = async function(req, res) {
    // 1. Pastikan hanya menerima request POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        // 2. System Prompt Kiro
        const systemPrompt = "Aku adalah Kiro, asisten virtual di website portofolio Rajhu Ilham Pradana (mahasiswa Teknik Informatika, fokus pada IoT, Cybersecurity, dan UI/UX). Jawab pertanyaan pengunjung secara profesional, ramah, dan singkat.\n\nPertanyaan pengunjung: ";
        const fullMessage = systemPrompt + message;

        // 3. Konfigurasi API
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

        // 4. Request ke Google
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

        // 5. Penanganan Error yang Lebih Detail
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Google API Error ${response.status}: ${errorDetails}`);
        }

        const data = await response.json();
        const replyText = data.candidates[0].content.parts[0].text;
        
        // 6. Kembalikan balasan ke Frontend
        res.status(200).json({ reply: replyText });
        
    } catch (error) {
        console.error('Laporan Error Backend:', error);
        res.status(500).json({ reply: 'Maaf, sistem Kiro sedang mengalami gangguan. Coba lagi nanti.' });
    }
};