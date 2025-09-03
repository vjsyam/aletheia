'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LogIn, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSupabase, hasSupabaseEnv } from '@/lib/supabaseClient'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const signIn = async () => {
    if (!hasSupabaseEnv) {
      setError('Supabase not configured. Add env vars and restart.');
      return
    }
    try {
      setLoading(true)
      setError(null)
      const supabase = getSupabase()!
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      window.location.href = '/'
    } catch (e: any) {
      setError(e.message ?? 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#121212] bg-[radial-gradient(#2e2e2e_1px,transparent_1px)] [background-size:32px_32px]"></div>

      <header className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" /> Back
        </Link>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h1 initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="text-4xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-300 to-blue-300">
          Sign in
        </motion.h1>

        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3" placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button disabled={loading} onClick={signIn} className="btn-primary w-full inline-flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4"/> {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-sm text-gray-400">Don’t have an account? <Link href="/signup" className="text-blue-400 hover:underline">Sign up</Link></p>
        </div>

        {!hasSupabaseEnv && (
          <p className="text-xs text-yellow-300 mt-4 inline-flex items-center gap-2"><Shield className="w-4 h-4"/> Supabase env vars not set.</p>
        )}
      </main>
    </div>
  )
}
