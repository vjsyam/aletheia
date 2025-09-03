'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LogIn, Mail, Shield, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSupabase, hasSupabaseEnv } from '@/lib/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'pending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleEmail = async () => {
    if (!hasSupabaseEnv) {
      setError('Supabase env vars not set. Add them to .env.local and restart.')
      return
    }
    try {
      setStatus('pending')
      setError(null)
      const supabase = getSupabase()!
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } })
      if (error) throw error
      setStatus('sent')
    } catch (e: any) {
      setError(e.message ?? 'Failed to send link')
      setStatus('error')
    }
  }

  const handleGoogle = async () => {
    if (!hasSupabaseEnv) {
      setError('Supabase env vars not set. Add them to .env.local and restart.')
      return
    }
    try {
      const supabase = getSupabase()!
      await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } })
    } catch (e: any) {
      setError(e.message ?? 'Google sign-in failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#121212] bg-[radial-gradient(#2e2e2e_1px,transparent_1px)] [background-size:32px_32px]"></div>

      <header className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white">
          <ArrowLeft className="w-5 h-5" /> Back
        </Link>
      </header>

      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.h1 initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="text-4xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-300 to-blue-300">
          Sign in to Aletheia
        </motion.h1>

        {!hasSupabaseEnv && (
          <div className="card p-4 border border-yellow-500/30 mb-6">
            <div className="flex items-center gap-2 text-yellow-300"><AlertTriangle className="w-5 h-5"/> Supabase environment variables not set</div>
            <p className="text-gray-300 mt-2 text-sm">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the server.</p>
          </div>
        )}

        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <div className="flex gap-2 items-center">
              <Mail className="w-4 h-4 text-gray-400"/>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3" />
              <button onClick={handleEmail} className="btn-primary inline-flex items-center gap-2"><LogIn className="w-4 h-4"/> Send Link</button>
            </div>
            {status==='sent' && <p className="text-sm text-green-400 mt-2">Magic link sent. Check your email.</p>}
            {status==='error' && error && <p className="text-sm text-red-400 mt-2">{error}</p>}
          </div>

          <div className="border-t border-gray-800 pt-4">
            <button onClick={handleGoogle} className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-3 rounded-lg">Continue with Google</button>
          </div>

          <p className="text-sm text-gray-400">By signing in you agree to our terms and allow storage of your analysis history under your account.</p>
        </div>
      </main>
    </div>
  )
}

