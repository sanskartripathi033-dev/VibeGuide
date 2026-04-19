import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Auto-creates required tables if they don't exist.
 * Call GET /api/setup to initialize the database.
 */
export async function GET() {
  const results = {};

  // Create reviews table
  const { error: e1 } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.reviews (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        author_name TEXT NOT NULL,
        place TEXT NOT NULL,
        category TEXT NOT NULL,
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        body TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  }).catch(() => ({ error: 'rpc_not_available' }));
  results.reviews = e1 ? 'may already exist or rpc unavailable' : 'ok';

  // Create review_likes table
  const { error: e2 } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.review_likes (
        review_id BIGINT REFERENCES public.reviews(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        PRIMARY KEY (review_id, user_id)
      );
    `
  }).catch(() => ({ error: 'rpc_not_available' }));
  results.review_likes = e2 ? 'may already exist or rpc unavailable' : 'ok';

  // Create saved_trips table
  const { error: e3 } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.saved_trips (
        id BIGSERIAL PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        title TEXT,
        destination TEXT NOT NULL,
        days INTEGER,
        budget TEXT,
        preferences TEXT,
        itinerary JSONB,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  }).catch(() => ({ error: 'rpc_not_available' }));
  results.saved_trips = e3 ? 'may already exist or rpc unavailable' : 'ok';

  return NextResponse.json({
    message: 'Database setup attempted. If tables still do not exist, please run the SQL manually in your Supabase SQL Editor.',
    results,
    manual_sql: `
-- Run this in Supabase SQL Editor → https://supabase.com → Your Project → SQL Editor

CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  place TEXT NOT NULL,
  category TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  body TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.review_likes (
  review_id BIGINT REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (review_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.saved_trips (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  destination TEXT NOT NULL,
  days INTEGER,
  budget TEXT,
  preferences TEXT,
  itinerary JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public reads reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Auth users insert reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users manage own trips" ON public.saved_trips USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users manage own trip likes" ON public.review_likes USING (auth.uid() = user_id);
    `
  });
}
