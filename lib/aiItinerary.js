import { GoogleGenAI } from '@google/genai';

// IMPORTANT: We use the SDK syntax. Make sure GEMINI_API_KEY is in .env.local
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateItinerary({ origin, days, budget, preferences }) {
  // Treating 'origin' as the user's chosen destination based on feedback.
  const destination = origin;
  
  const prompt = `
    You are an expert travel planner.
    A user wants a highly tailored travel itinerary for ${destination} for ${days} days.
    Their budget is ${budget} and their preferences are: ${preferences}.

    Generate a highly detailed, engaging itinerary for them in precise JSON format.
    The response MUST only contain the raw JSON array (no markdown block, no conversational text).
    
    The JSON structure should be an array of objects representing days. Each day object must look exactly like this:
    {
      "day": "Day 1",
      "theme": "A catchy theme for the day (e.g. The Pink City Core)",
      "color": "#C05C42",
      "stops": [
        {
          "time": "9:00 AM",
          "icon": "🏰",
          "name": "Location Name",
          "tip": "An insider travel tip or historical fact",
          "duration": "2 hrs",
          "maps": "Google Maps search query string"
        }
      ]
    }
    
    Also, please generate 2 travel tips and 1 price estimate at the top level. So actually, structure it like this:
    {
      "itinerary": [ ... array of day objects as specified above ],
      "estimates": {
        "transport": "Estimated travel cost from origin",
        "daily": "Estimated daily spend"
      },
      "quotes": [
        "A beautiful quote about travel or Rajasthan",
        "Another inspiring quote"
      ]
    }
    
    Ensure the JSON is valid and accurately tracks logic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text;
    // Strip markdown code block boundaries if Gemini includes them
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error('AI Generation failed:', error);
    throw new Error('Failed to generate itinerary. Please check API Key or try again.');
  }
}
