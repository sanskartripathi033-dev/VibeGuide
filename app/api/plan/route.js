import { NextResponse } from 'next/server';
import { generateItinerary } from '@/lib/aiItinerary';

export async function POST(request) {
  try {
    const body = await request.json();
    const { origin, days, budget, preferences } = body;

    if (!origin || !days || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields (origin, days, budget)' },
        { status: 400 }
      );
    }

    const plan = await generateItinerary({ origin, days, budget, preferences });
    
    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    console.error('Plan API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan. Ensure your API key is configured.' },
      { status: 500 }
    );
  }
}
