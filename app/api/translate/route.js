import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key missing in .env.local' }, { status: 500 });
    }

    const { text, targetLanguage } = await req.json();
    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 });
    }

    // Direct REST API call (No SDK) - Most reliable method
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{
        parts: [{
          text: `Translate the following to the locale '${targetLanguage}'. Output ONLY the raw translation: ${text}`
        }]
      }]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Google API Error:', data);
      throw new Error(data.error?.message || 'Google API returned an error');
    }

    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return NextResponse.json({ 
      translatedText: translatedText.trim(),
      method: 'Direct REST'
    });

  } catch (err) {
    console.error('Translation Error:', err.message);
    
    let userMsg = 'Translation failed.';
    if (err.message.includes('not found') || err.message.includes('404')) {
        userMsg = 'API ERROR: Model not found. This key likely belongs to a Google Project that HAS NOT ENABLED the "Generative Language API".';
    } else if (err.message.includes('API key not valid')) {
        userMsg = 'API ERROR: The API key provided is invalid.';
    }

    return NextResponse.json({ 
      error: userMsg,
      details: err.message
    }, { status: 500 });
  }
}
