import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    // Persona definition
    const systemPrompt = `You are ATLAS, a passionate and knowledgeable local tour guide for Jaipur, the Pink City of Rajasthan. 
    Your goal is to help visitors discover the world of Jaipur, from its iconic landmarks like Hawa Mahal and Amber Fort to its hidden cafes, royal restaurants, and vibrant bazaars. 
    Be friendly, welcoming, and provide rich historical context and practical travel tips. 
    Keep your responses concise yet engaging. You are currently assisting the user on the ATLAS travel platform.`;

    // Process messages for the new SDK
    // The @google/genai SDK often expects a simpler 'contents' structure or specific prompt
    const lastMessage = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map(m => `${m.role === 'user' ? 'User' : 'ATLAS'}: ${m.content}`).join('\n');
    
    const finalPrompt = `${systemPrompt}\n\nChat History:\n${history}\n\nUser: ${lastMessage}\nATLAS:`;

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      contents: finalPrompt,
    });

    const text = response.text || 'I apologize, but I am momentarily lost in the bazaars of Jaipur. Please try again.';

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Extract meaningful error details for the user
    let errorMessage = 'Failed to generate response';
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      errorMessage = 'ATLAS is currently overwhelmed with travellers (API Quota Exceeded). Please try again in a few minutes.';
    } else if (error.message?.includes('API key')) {
      errorMessage = 'The royal seal (API Key) seems invalid. Please check your configuration.';
    }

    return NextResponse.json({ 
      error: errorMessage, 
      details: error.message 
    }, { status: 500 });
  }
}
