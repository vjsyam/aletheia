import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const body = await req.json()
    const { user_id, dilemma_key, custom_text, utilitarian_html, deontologist_html, virtue_ethicist_html } = body || {}

    const { data, error } = await supabase
      .from('dilemmas_history')
      .insert([{ user_id: user_id ?? null, dilemma_key: dilemma_key ?? null, custom_text: custom_text ?? null, utilitarian_html: utilitarian_html ?? null, deontologist_html: deontologist_html ?? null, virtue_ethicist_html: virtue_ethicist_html ?? null }])
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, item: data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('user_id')
    const limit = Math.max(1, Math.min(parseInt(searchParams.get('limit') || '20', 10) || 20, 100))
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10) || 0)

    let query = supabase
      .from('dilemmas_history')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) query = query.eq('user_id', userId)

    const { data, error, count } = await query
    if (error) throw error
    return NextResponse.json({ ok: true, items: data, total: count ?? null })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })

    const { error } = await supabase.from('dilemmas_history').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Unknown error' }, { status: 500 })
  }
}
