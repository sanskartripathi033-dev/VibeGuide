import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { text, targetLanguage } = await req.json();
    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    // Creating a highly constrained prompt to output pure text translation
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
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
