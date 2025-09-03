'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabase, hasSupabaseEnv } from '@/lib/supabaseClient'

type EnvCheck = {
  ok: boolean
  hasUrl: boolean
  hasKey: boolean
  urlLength: number
  keyLength: number
}

export default function AuthDebugPage() {
  const [env, setEnv] = useState<EnvCheck | null>(null)
  const [sessionJson, setSessionJson] = useState<string>('')
  const [userJson, setUserJson] = useState<string>('')
  const [clientOk, setClientOk] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/env-check', { cache: 'no-store' })
        const json = await res.json()
        setEnv(json)
      } catch (e: any) {
        setError(e?.message || 'Failed to fetch /api/env-check')
      }
      try {
        setClientOk(Boolean(getSupabase()))
        const supabase = getSupabase()
        if (supabase) {
          const { data: sessionData } = await supabase.auth.getSession()
          const { data: userData } = await supabase.auth.getUser()
          setSessionJson(JSON.stringify(sessionData, null, 2))
          setUserJson(JSON.stringify(userData, null, 2))
        }
      } catch (e: any) {
        setError(prev => prev || e?.message || 'Supabase check failed')
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen p-6 space-y-4 bg-gray-900 text-gray-100">
      <h1 className="text-xl font-semibold">Auth Diagnostics</h1>
      <div className="space-y-2">
        <div>hasSupabaseEnv (build-time read): <strong>{String(hasSupabaseEnv)}</strong></div>
        <div>Client initialized: <strong>{String(clientOk)}</strong></div>
        <div>Runtime /api/env-check ok: <strong>{String(env?.ok)}</strong> (url {String(env?.hasUrl)} len {env?.urlLength}, key {String(env?.hasKey)} len {env?.keyLength})</div>
        {error && <div className="text-red-400">{error}</div>}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <pre className="bg-gray-800 p-3 rounded border border-gray-700 overflow-auto"><code>session: {sessionJson || 'null'}</code></pre>
        <pre className="bg-gray-800 p-3 rounded border border-gray-700 overflow-auto"><code>user: {userJson || 'null'}</code></pre>
      </div>
      <div>
        <Link href="/" className="text-blue-400 hover:underline">Back to home</Link>
      </div>
    </div>
  )
}


