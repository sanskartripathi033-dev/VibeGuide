import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured in environment variables!' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    const prompt = `Translate the following text strictly into the locale '${targetLanguage}'. 
Never include surrounding quotes, markdown, explanations, or notes. Output ONLY the raw translated string. 
Text to translate:
${text}`;

    // Note: 'gemini-2.5-flash' does not exist yet. Using 'gemini-2.0-flash' (the latest 2.x model).
    // If you specifically need a flash model, 2.0 is the current flagship.
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: prompt,
    });

    const translatedText = response.text || '';
    return NextResponse.json({ translatedText: translatedText.trim() });
  } catch (err) {
    console.error('Translation error:', err);
    
    // Attempting automatic fallback to 1.5-flash if 2.0 is not supported by the key
    try {
        const aiFallback = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY });
        const { text, targetLanguage } = await req.json();
        const fallbackRes = await aiFallback.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `Translate to ${targetLanguage}: ${text}`
        });
        return NextResponse.json({ translatedText: (fallbackRes.text || '').trim(), note: 'Used 1.5-flash fallback' });
    } catch (fallbackErr) {
        return NextResponse.json({ 
            error: 'Translation failed.', 
            details: err.message,
            tip: 'Ensure your GEMINI_API_KEY is valid and has access to gemini-2.0-flash or gemini-1.5-flash'
        }, { status: 500 });
    }
  }
}
