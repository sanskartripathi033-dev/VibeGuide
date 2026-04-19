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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const translatedText = response.text || '';
    return NextResponse.json({ translatedText: translatedText.trim() });
  } catch (err) {
    console.error('Translation error:', err);
    return NextResponse.json({ error: 'Translation failed. Please try again.', details: err.message }, { status: 500 });
  }
}
