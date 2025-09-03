import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')
    if (!userId) return NextResponse.json({ ok: false, error: 'user_id required' }, { status: 400 })

    const { data, error } = await supabase
      .from('dilemmas_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return new NextResponse(JSON.stringify({ ok: true, items: data }, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=aletheia-export-${userId}.json`,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

