import { NextResponse } from 'next/server';

// This endpoint tells clients to clear their local auth storage.
// Call it after rotating the JWT secret in Supabase dashboard.
export async function POST() {
  return NextResponse.json({ cleared: true, storageKey: 'prasads-visuals-auth' });
}