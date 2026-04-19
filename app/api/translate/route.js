import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIza...') {
      return NextResponse.json({ 
        error: 'API Key not found or invalid in .env.local',
        tip: 'Ensure GEMINI_API_KEY is set correctly and you restarted the server.' 
      }, { status: 500 });
    }

    const { text, targetLanguage } = await req.json();
    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use the model from ENV or default to 1.5-flash
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Translate the following text strictly into the locale '${targetLanguage}'. 
Output ONLY the raw translation without quotes or extra text.
Text: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    return NextResponse.json({ 
      translatedText: translatedText.trim(),
      model: 'gemini-1.5-flash'
    });

  } catch (err) {
    console.error('Translation error:', err);
    
    let userMessage = 'Translation failed. Please check your API key and Internet.';
    if (err.message.includes('404')) {
        userMessage = 'Model not found (404). This usually means the Generative Language API is not enabled in your Google Cloud project for this key.';
    } else if (err.message.includes('403')) {
        userMessage = 'Permission denied (403). Your API key might be invalid or restricted.';
    }

    return NextResponse.json({ 
      error: userMessage, 
      details: err.message 
    }, { status: 500 });
  }
}
