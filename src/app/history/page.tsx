'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { getSupabase, hasSupabaseEnv } from '@/lib/supabaseClient'
import { t, getLang, type Lang } from '@/lib/i18n'

interface HistoryItem {
  id: string
  dilemma_key: string | null
  custom_text: string | null
  utilitarian_html: string | null
  deontologist_html: string | null
  virtue_ethicist_html: string | null
  created_at: string
}

const Html = ({ html }: { html: string | null }) => (
  <div className="prose-custom" dangerouslySetInnerHTML={{ __html: html || '' }} />
)

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [authToken, setAuthToken] = useState<string>('')
  const [total, setTotal] = useState<number>(0)
  const [limit] = useState<number>(10)
  const [offset, setOffset] = useState<number>(0)
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    try { setLangState(getLang()) } catch {}
    if (!hasSupabaseEnv) return
    const supabase = getSupabase()
    supabase?.auth.getSession().then(({ data }) => {
      const token = data?.session?.access_token || ''
      setAuthToken(token)
      const user = data?.session?.user
      if (user?.id) setUserId(user.id)
    })
  }, [])

  const load = async (nextOffset = 0) => {
    if (!userId) { setLoading(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/history?user_id=${encodeURIComponent(userId)}&limit=${limit}&offset=${nextOffset}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
      })
      const json = await res.json()
      if (json?.ok) {
        setItems(json.items || [])
        setTotal(json.total || 0)
        setOffset(nextOffset)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(0) }, [userId, authToken])

  const onDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    await fetch(`/api/history?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    })
    load(offset)
  }

  const canPrev = offset > 0
  const canNext = offset + limit < total

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#121212] bg-[radial-gradient(#2e2e2e_1px,transparent_1px)] [background-size:32px_32px] dark:opacity-100 opacity-10"></div>

      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
          <ArrowLeft className="w-5 h-5" /> {t(lang, 'back')}
        </Link>
        <h1 className="text-2xl font-semibold">{t(lang, 'my_history')}</h1>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="card p-6">Loading…</div>
        ) : !userId ? (
          <div className="card p-6 text-center">{t(lang, 'sign_in_to_keep')}</div>
        ) : items.length === 0 ? (
          <div className="card p-6 text-center">No history yet. Analyze a dilemma to see it here.</div>
        ) : (
          <>
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.id} className="card">
                  <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                    <div className="inline-flex items-center gap-2"><Clock className="w-4 h-4"/>{new Date(item.created_at).toLocaleString()}</div>
                    <div className="opacity-70">{item.dilemma_key || 'Custom'}</div>
                  </div>
                  {item.custom_text && (
                    <div className="mb-3">
                      <div className="text-sm text-gray-400">Question</div>
                      <div className="text-gray-200 dark:text-gray-200">{item.custom_text}</div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-cyan-400 font-semibold mb-1">Utilitarian</div>
                      <Html html={item.utilitarian_html} />
                    </div>
                    <div>
                      <div className="text-fuchsia-400 font-semibold mb-1">Deontologist</div>
                      <Html html={item.deontologist_html} />
                    </div>
                    <div>
                      <div className="text-yellow-400 font-semibold mb-1">Virtue Ethicist</div>
                      <Html html={item.virtue_ethicist_html} />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={()=>onDelete(item.id)} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"><Trash2 className="w-4 h-4"/> Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button disabled={!canPrev} onClick={()=>load(Math.max(0, offset - limit))} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${canPrev? 'border-gray-600 text-gray-200 hover:bg-gray-800':'border-gray-700 text-gray-500'}`}><ChevronLeft className="w-4 h-4"/> Prev</button>
              <div className="text-sm text-gray-400">{offset + 1} - {Math.min(offset + limit, total)} of {total}</div>
              <button disabled={!canNext} onClick={()=>load(offset + limit)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${canNext? 'border-gray-600 text-gray-200 hover:bg-gray-800':'border-gray-700 text-gray-500'}`}>Next <ChevronRight className="w-4 h-4"/></button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
