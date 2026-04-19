import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req, { params }) {
  try {
    const { review_id } = params;
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: 'Must be signed in to like' }, { status: 401 });
    }

    // Check if already liked
    const { data: existing } = await supabaseAdmin
      .from('review_likes')
      .select('*')
      .eq('review_id', review_id)
      .eq('user_id', user_id)
      .single();

    if (existing) {
      // Unlike
      await supabaseAdmin
        .from('review_likes')
        .delete()
        .eq('review_id', review_id)
        .eq('user_id', user_id);
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await supabaseAdmin
        .from('review_likes')
        .insert([{ review_id, user_id }]);
      return NextResponse.json({ liked: true });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
