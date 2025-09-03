'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings, User, Bell, Shield, Palette, Globe, Save, Eye, EyeOff, Download, LogIn, LogOut, Mail, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSupabase, hasSupabaseEnv } from '@/lib/supabaseClient'
import { t, getLang as i18nGetLang, setLang as i18nSetLang, type Lang } from '@/lib/i18n'

export default function SettingsPage() {
  const [active, setActive] = useState<'profile' | 'notifications' | 'appearance' | 'language' | 'privacy'>('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true })
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark')
  const [language, setLanguage] = useState<Lang>('en')
  const [timezone, setTimezone] = useState('UTC')
  const [userId, setUserId] = useState<string>('')
  const [email, setEmail] = useState('')
  const [authStatus, setAuthStatus] = useState<'signed_out' | 'pending' | 'signed_in'>('signed_out')
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<'idle' | 'ok' | 'err'>('idle')
  const [settingsResult, setSettingsResult] = useState<'idle' | 'ok' | 'err'>('idle')
  const [authToken, setAuthToken] = useState<string>('')

  useEffect(() => {
    const stored = localStorage.getItem('aletheia_user_id')
    if (stored) setUserId(stored)
    else {
      const id = `anon_${Math.random().toString(36).slice(2, 10)}`
      localStorage.setItem('aletheia_user_id', id)
      setUserId(id)
    }

    if (hasSupabaseEnv) {
      const supabase = getSupabase()
      supabase?.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setAuthStatus('signed_in')
          if (data.user.id) setUserId(data.user.id)
          setUserEmail((data.user.email || ''))
          // @ts-ignore
          setUserName((data.user.user_metadata?.name || ''))
        }
      })
      supabase?.auth.getSession().then(({ data }) => {
        const token = data?.session?.access_token || ''
        setAuthToken(token)
        const user = data?.session?.user
        if (user?.id) {
          fetch(`/api/settings?user_id=${user.id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          })
          .then(r=>r.json()).then(json => {
            if (json?.settings) {
              setNotifications({ email: !!json.settings.notif_email, push: !!json.settings.notif_push, weekly: !!json.settings.notif_weekly })
              setTheme(json.settings.theme || 'dark')
              setLanguage((json.settings.language as Lang) || 'en')
              setTimezone(json.settings.timezone || 'UTC')
              applyTheme(json.settings.theme || 'dark')
              document.documentElement.setAttribute('data-lang', (json.settings.language as Lang) || 'en')
            }
          })
        }
      })
    }
  }, [])

  const applyTheme = (t: 'light' | 'dark' | 'auto') => {
    const html = document.documentElement
    if (t === 'auto') {
      html.classList.remove('dark')
      localStorage.setItem('aletheia_theme', 'auto')
    } else if (t === 'dark') {
      html.classList.add('dark')
      localStorage.setItem('aletheia_theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('aletheia_theme', 'light')
    }
  }

  const saveSettings = async () => {
    if (authStatus !== 'signed_in') return
    try {
      setSettingsResult('idle')
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          user_id: userId,
          notif_email: notifications.email,
          notif_push: notifications.push,
          notif_weekly: notifications.weekly,
          theme,
          language,
          timezone,
        })
      })
      const json = await res.json()
      if (!json?.ok) throw new Error(json?.error || 'Save failed')
      setSettingsResult('ok')
      applyTheme(theme)
      document.documentElement.setAttribute('data-lang', language)
    } catch {
      setSettingsResult('err')
    } finally {
      setTimeout(()=>setSettingsResult('idle'), 2500)
    }
  }

  const handleMagicLink = async () => {
    if (!hasSupabaseEnv) {
      alert('Supabase env vars not set. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart.')
      return
    }
    try {
      setAuthStatus('pending')
      const supabase = getSupabase()
      const { error } = await supabase!.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } })
      if (error) throw error
      alert('Check your email for the sign-in link.')
    } catch (e: any) {
      alert(e.message ?? 'Sign-in failed')
      setAuthStatus('signed_out')
    }
  }

  const handleSignOut = async () => {
    if (hasSupabaseEnv) {
      await getSupabase()!.auth.signOut()
    }
    setAuthStatus('signed_out')
    setUserEmail('')
    setUserName('')
    const id = `anon_${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem('aletheia_user_id', id)
    setUserId(id)
  }

  const handleSaveProfile = async () => {
    if (!hasSupabaseEnv || authStatus !== 'signed_in') return
    try {
      setSaving(true)
      setSaveResult('idle')
      const supabase = getSupabase()!
      // update metadata (name)
      const updates: any = { data: { name: userName || '' } }
      if (userEmail) {
        updates.email = userEmail
      }
      const { error } = await supabase.auth.updateUser(updates)
      if (error) throw error
      // refetch to sync
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUserEmail((data.user.email || ''))
        // @ts-ignore
        setUserName((data.user.user_metadata?.name || ''))
      }
      setSaveResult('ok')
    } catch (e) {
      setSaveResult('err')
    } finally {
      setSaving(false)
      setTimeout(()=>setSaveResult('idle'), 2500)
    }
  }

  const downloadData = async () => {
    const url = `/api/export?user_id=${encodeURIComponent(userId)}`
    const a = document.createElement('a')
    a.href = url
    a.download = `aletheia-export-${userId}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#121212] bg-[radial-gradient(#2e2e2e_1px,transparent_1px)] [background-size:32px_32px] dark:opacity-100 opacity-10"></div>

      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
          <ArrowLeft className="w-5 h-5" /> {t(language, 'back')}
        </Link>
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <span className="text-xs uppercase tracking-wide opacity-70">{language}</span>
          <Settings className="w-5 h-5" />
          <span className="font-semibold">{t(language, 'settings')}</span>
        </div>
      </header>

      {!hasSupabaseEnv && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
          <div className="card p-4 border border-yellow-500/30">
            <div className="flex items-center gap-2 text-yellow-300"><AlertTriangle className="w-5 h-5"/> Supabase environment variables not set</div>
            <p className="text-gray-300 mt-2 text-sm">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the server. You can still use anonymous download.</p>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <nav className="card p-2 divide-y divide-gray-800/80">
            <button onClick={() => setActive('profile')} className={`w-full text-left p-3 rounded-lg ${active==='profile'?'bg-blue-500/10 text-blue-400':'text-gray-300 hover:bg-gray-800/50'}`}>
              <span className="inline-flex items-center gap-2"><User className="w-4 h-4"/> Profile</span>
            </button>
            <button onClick={() => setActive('notifications')} className={`w-full text-left p-3 rounded-lg ${active==='notifications'?'bg-blue-500/10 text-blue-400':'text-gray-300 hover:bg-gray-800/50'}`}>
              <span className="inline-flex items-center gap-2"><Bell className="w-4 h-4"/> Notifications</span>
            </button>
            <button onClick={() => setActive('privacy')} className={`w-full text-left p-3 rounded-lg ${active==='privacy'?'bg-blue-500/10 text-blue-400':'text-gray-300 hover:bg-gray-800/50'}`}>
              <span className="inline-flex items-center gap-2"><Shield className="w-4 h-4"/> Privacy & Security</span>
            </button>
            <button onClick={() => setActive('appearance')} className={`w-full text-left p-3 rounded-lg ${active==='appearance'?'bg-blue-500/10 text-blue-400':'text-gray-300 hover:bg-gray-800/50'}`}>
              <span className="inline-flex items-center gap-2"><Palette className="w-4 h-4"/> Appearance</span>
            </button>
            <button onClick={() => setActive('language')} className={`w-full text-left p-3 rounded-lg ${active==='language'?'bg-blue-500/10 text-blue-400':'text-gray-300 hover:bg-gray-800/50'}`}>
              <span className="inline-flex items-center gap-2"><Globe className="w-4 h-4"/> Language & Region</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <section className="lg:col-span-3">
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="card p-6 space-y-6">
            {active === 'profile' && (
              <>
                {authStatus === 'signed_in' ? (
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/60">
                    <h3 className="text-lg font-semibold text-white mb-2">User Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Display Name</label>
                        <input value={userName} onChange={e=>setUserName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Email</label>
                        <input type="email" value={userEmail} onChange={e=>setUserEmail(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3" />
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm mt-3">
                      <div><span className="text-gray-400">User ID:</span> <span className="break-all">{userId}</span></div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button onClick={handleSaveProfile} disabled={saving} className="btn-primary inline-flex items-center gap-2">
                        <Save className="w-4 h-4"/> {saving ? 'Saving…' : 'Save'}
                      </button>
                      {saveResult==='ok' && <span className="inline-flex items-center text-green-400 text-sm"><CheckCircle2 className="w-4 h-4 mr-1"/> Saved</span>}
                      {saveResult==='err' && <span className="inline-flex items-center text-red-400 text-sm"><XCircle className="w-4 h-4 mr-1"/> Failed</span>}
                      <button onClick={handleSignOut} className="btn-secondary">Sign out</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/60 text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">You’re not signed in</h3>
                    <p className="text-sm text-gray-400 mb-3">Sign in to see your details and save your analysis history.</p>
                    <div className="flex items-center justify-center gap-3">
                      <Link href="/signin" className="btn-primary">Sign in</Link>
                      <Link href="/signup" className="btn-secondary">Sign up</Link>
                    </div>
                    {/* Optional magic link fallback */}
                    <div className="mt-4">
                      <p className="text-gray-300 mb-2">Or receive a sign-in link (email)</p>
                      <div className="flex gap-2 items-center max-w-md mx-auto">
                        <Mail className="w-4 h-4 text-gray-400"/>
                        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3" />
                        <button onClick={handleMagicLink} className="btn-primary"><LogIn className="w-4 h-4 inline mr-1"/> Send Link</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {active === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Notifications</h2>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Email Updates</p>
                    <p className="text-sm text-gray-400">Receive activity and product news</p>
                  </div>
                  <input type="checkbox" checked={notifications.email} onChange={e=>setNotifications(o=>({...o,email:e.target.checked}))} />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Push Alerts</p>
                    <p className="text-sm text-gray-400">Real-time browser notifications</p>
                  </div>
                  <input type="checkbox" checked={notifications.push} onChange={e=>setNotifications(o=>({...o,push:e.target.checked}))} />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Weekly Digest</p>
                    <p className="text-sm text-gray-400">Summary of new dilemmas</p>
                  </div>
                  <input type="checkbox" checked={notifications.weekly} onChange={e=>setNotifications(o=>({...o,weekly:e.target.checked}))} />
                </div>
                {authStatus==='signed_in' && (
                  <div className="flex justify-end">
                    <button onClick={saveSettings} className="btn-primary inline-flex items-center gap-2"><Save className="w-4 h-4"/> Save</button>
                    {settingsResult==='ok' && <span className="ml-3 inline-flex items-center text-green-400 text-sm"><CheckCircle2 className="w-4 h-4 mr-1"/> Saved</span>}
                    {settingsResult==='err' && <span className="ml-3 inline-flex items-center text-red-400 text-sm"><XCircle className="w-4 h-4 mr-1"/> Failed</span>}
                  </div>
                )}
              </div>
            )}

            {active === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-300 mb-2">Export your data (JSON)</p>
                  <button onClick={downloadData} className="btn-secondary inline-flex items-center gap-2"><Download className="w-4 h-4"/> Download</button>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-300 mb-2">Two-Factor Authentication</p>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
              </div>
            )}

            {active === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Appearance</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button onClick={()=>setTheme('light')} className={`p-4 rounded-lg border-2 ${theme==='light'?'border-blue-500 bg-blue-500/10':'border-gray-700 bg-gray-800'}`}>Light</button>
                  <button onClick={()=>setTheme('dark')} className={`p-4 rounded-lg border-2 ${theme==='dark'?'border-blue-500 bg-blue-500/10':'border-gray-700 bg-gray-800'}`}>Dark</button>
                  <button onClick={()=>setTheme('auto')} className={`p-4 rounded-lg border-2 ${theme==='auto'?'border-blue-500 bg-blue-500/10':'border-gray-700 bg-gray-800'}`}>Auto</button>
                </div>
                {authStatus==='signed_in' && (
                  <div className="flex justify-end">
                    <button onClick={saveSettings} className="btn-primary inline-flex items-center gap-2"><Save className="w-4 h-4"/> Save</button>
                    {settingsResult==='ok' && <span className="ml-3 inline-flex items-center text-green-400 text-sm"><CheckCircle2 className="w-4 h-4 mr-1"/> Saved</span>}
                    {settingsResult==='err' && <span className="ml-3 inline-flex items-center text-red-400 text-sm"><XCircle className="w-4 h-4 mr-1"/> Failed</span>}
                  </div>
                )}
              </div>
            )}

            {active === 'language' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Language & Region</h2>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Language</label>
                  <select value={language} onChange={e=>{ const v = e.target.value as Lang; setLanguage(v); i18nSetLang(v) }} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Time Zone</label>
                  <select value={timezone} onChange={e=>setTimezone(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option value="UTC">UTC</option>
                    <option value="America/Los_Angeles">UTC-8 (Pacific)</option>
                    <option value="America/New_York">UTC-5 (Eastern)</option>
                    <option value="Europe/London">UTC+0 (London)</option>
                    <option value="Europe/Berlin">UTC+1 (CET)</option>
                  </select>
                </div>
                {authStatus==='signed_in' && (
                  <div className="flex justify-end">
                    <button onClick={saveSettings} className="btn-primary inline-flex items-center gap-2"><Save className="w-4 h-4"/> Save</button>
                    {settingsResult==='ok' && <span className="ml-3 inline-flex items-center text-green-400 text-sm"><CheckCircle2 className="w-4 h-4 mr-1"/> Saved</span>}
                    {settingsResult==='err' && <span className="ml-3 inline-flex items-center text-red-400 text-sm"><XCircle className="w-4 h-4 mr-1"/> Failed</span>}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  )
}
