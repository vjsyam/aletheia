import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')
    if (!userId) return NextResponse.json({ ok: false, error: 'user_id required' }, { status: 400 })

    const { data: authUser } = await supabase.auth.getUser()
    if (!authUser?.user?.id) return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })

    const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', userId).single()
    if (error && error.code !== 'PGRST116') throw error
    return NextResponse.json({ ok: true, settings: data || null })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const body = await req.json()
    const { user_id, notif_email, notif_push, notif_weekly, theme, language, timezone } = body || {}
    if (!user_id) return NextResponse.json({ ok: false, error: 'user_id required' }, { status: 400 })

    const { data: authUser } = await supabase.auth.getUser()
    if (!authUser?.user?.id) return NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 })

    const payload = {
      user_id,
      notif_email: !!notif_email,
      notif_push: !!notif_push,
      notif_weekly: !!notif_weekly,
      theme: theme || 'dark',
      language: language || 'en-US',
      timezone: timezone || 'UTC',
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('user_settings')
      .upsert(payload, { onConflict: 'user_id' })
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, settings: data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}
