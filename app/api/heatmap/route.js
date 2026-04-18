import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/heatmap?lat_min=&lat_max=&lng_min=&lng_max=
// Returns crowd trail points within the map's visible bounding box for last 30 minutes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat_min = parseFloat(searchParams.get('lat_min'));
    const lat_max = parseFloat(searchParams.get('lat_max'));
    const lng_min = parseFloat(searchParams.get('lng_min'));
    const lng_max = parseFloat(searchParams.get('lng_max'));

    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin
      .from('crowd_trails')
      .select('lat, lng')
      .gte('recorded_at', thirtyMinsAgo)
      .gte('lat', lat_min || 26.5)
      .lte('lat', lat_max || 27.3)
      .gte('lng', lng_min || 75.4)
      .lte('lng', lng_max || 76.1);

    if (error) throw error;

    return NextResponse.json({ points: data || [] }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/heatmap]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
