module.exports = async function(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        // System Prompt Kiro
        const systemPrompt = "Kamu adalah Kiro, asisten virtual di website portofolio Rajhu Ilham Pradana (mahasiswa Teknik Informatika, fokus pada IoT, Cybersecurity, dan UI/UX). Jawab pertanyaan pengunjung secara profesional, ramah, dan singkat.\n\nPertanyaan pengunjung: ";
        const fullMessage = systemPrompt + message;

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        // ==========================================
        // TAHAP 1: AUTO-DISCOVERY (Mencari Model Valid)
        // ==========================================
        const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        
        if (!modelsResponse.ok) {
            throw new Error(`Gagal mengambil daftar model: ${modelsResponse.status}`);
        }
        
        const modelsData = await modelsResponse.json();
        
        // Mencari model Gemini yang mendukung fitur "generateContent"
        const availableModel = modelsData.models.find(m => 
            m.name.includes('gemini') && 
            m.supportedGenerationMethods && 
            m.supportedGenerationMethods.includes('generateContent')
        );

        if (!availableModel) {
            throw new Error("Tidak ada model Gemini yang didukung untuk API Key ini.");
        }

        // ==========================================
        // TAHAP 2: REQUEST CHAT MENGGUNAKAN MODEL YANG DITEMUKAN
        // ==========================================
        // availableModel.name otomatis akan berisi string yang tepat, misal "models/gemini-1.5-flash"
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/${availableModel.name}:generateContent`;

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
            const errorDetails = await response.text();
            throw new Error(`Google API Error ${response.status}: ${errorDetails}`);
        }

        const data = await response.json();
        const replyText = data.candidates[0].content.parts[0].text;
        
        res.status(200).json({ reply: replyText });
        
    } catch (error) {
        console.error('Laporan Error Backend:', error);
        res.status(500).json({ reply: 'Maaf, sistem Kiro sedang mengalami gangguan. Coba lagi nanti.' });
    }
};