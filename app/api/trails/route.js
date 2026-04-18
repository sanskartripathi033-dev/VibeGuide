import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// POST /api/trails — Record a GPS point for the heatmap
export async function POST(request) {
  try {
    const { lat, lng, user_id } = await request.json();

    if (lat === undefined || lng === undefined || !user_id) {
      return NextResponse.json({ error: 'Missing lat, lng, or user_id' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('crowd_trails')
      .insert({ lat, lng, user_id });

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/trails]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
