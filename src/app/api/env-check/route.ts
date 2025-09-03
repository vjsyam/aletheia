import { NextResponse } from 'next/server'

export async function GET() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()
  return NextResponse.json({
    ok: Boolean(url && key),
    hasUrl: Boolean(url),
    hasKey: Boolean(key),
    // lengths only for debugging; do not log actual secrets
    urlLength: url.length,
    keyLength: key.length,
  })
}

