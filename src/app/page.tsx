'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { Scale, Shield, Heart, Loader2, Sparkles, Settings, PenSquare, BookOpen, CheckCircle2, History } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSupabase, hasSupabaseEnv } from '@/lib/supabaseClient'
import { t, getLang, setLang, type Lang } from '@/lib/i18n'

// Icons
const UtilitarianIcon = () => <Scale className="h-8 w-8 text-cyan-400" />
const DeontologistIcon = () => <Shield className="h-8 w-8 text-fuchsia-400" />
const VirtueEthicistIcon = () => <Heart className="h-8 w-8 text-yellow-400" />

// Dilemmas (expanded)
const dilemmas = {
  trolley: {
    title: 'The Trolley Problem',
    text:
      'A runaway trolley is about to hit five people. You can pull a lever to switch it to a different track, where it would hit one person. Do you pull the lever?',
  },
  lifeboat: {
    title: 'The Lifeboat',
    text:
      'You are on a lifeboat with four others. It will sink unless one person is thrown overboard. One person is severely injured. What should be done?',
  },
  doctor: {
    title: 'The Transplant Surgeon',
    text:
      'You are a surgeon with five patients who will die without organ transplants. A healthy person, a perfect match for all five, comes in for a check-up. Do you harvest their organs?',
  },
  whistleblower: {
    title: 'The Whistleblower',
    text:
      'Your company is secretly dumping toxic waste. Exposing it saves the environment but devastates the local economy. Do you reveal the truth?',
  },
  autonomous_ship: {
    title: 'The Autonomous Ship',
    text:
      'An autonomous ship must choose between colliding with a small boat carrying ten people or swerving and sinking valuable cargo. What should it do?',
  },
  privacy_ai: {
    title: 'AI Surveillance',
    text:
      'A city can reduce crime by 80% using AI cameras, but it requires constant public monitoring. Should it be deployed?',
  },
  climate_action: {
    title: 'Climate Action Tradeoff',
    text:
      'A strict climate policy will severely impact current jobs but significantly reduces long-term climate risk. Should it pass?',
  },
  algorithmic_bias: {
    title: 'Algorithmic Bias in Hiring',
    text:
      'A hiring AI improves efficiency but shows bias against certain groups. Should it continue while being improved?',
  },
  rescue_robot: {
    title: 'Rescue Robot Dilemma',
    text:
      'A rescue robot can save a single child now or wait to save three adults later with some risk. What should it do?',
  },
} as const

type DilemmaKey = keyof typeof dilemmas

// Mock responses
const mockResponses: Record<DilemmaKey | 'custom', { utilitarian: string; deontologist: string; virtue_ethicist: string }> = {
  trolley: {
    utilitarian:
      '<p><strong>Conclusion: Pull the lever.</strong></p><p>Maximizes total well-being: five saved vs one lost.</p>',
    deontologist:
      '<p><strong>Conclusion: Do not pull the lever.</strong></p><p>Never use a person merely as a means; duty not to kill.</p>',
    virtue_ethicist:
      '<p><strong>Conclusion: Likely pull the lever.</strong></p><p>Exhibits courage and compassion with practical wisdom.</p>',
  },
  lifeboat: {
    utilitarian:
      '<p><strong>Conclusion: Sacrifice one.</strong></p><p>Net survival improves; minimizes total suffering.</p>',
    deontologist:
      '<p><strong>Conclusion: Do not sacrifice.</strong></p><p>Actively causing death violates moral duty.</p>',
    virtue_ethicist:
      '<p><strong>Conclusion: Tragic conflict.</strong></p><p>Seek a third option; no perfectly virtuous act available.</p>',
  },
  doctor: {
    utilitarian:
      '<p><strong>Conclusion: Harvest.</strong></p><p>Five saved outweigh one life lost (ignoring second-order trust effects).</p>',
    deontologist:
      '<p><strong>Conclusion: Do not harvest.</strong></p><p>Murder cannot be universalized; persons are ends in themselves.</p>',
    virtue_ethicist:
      '<p><strong>Conclusion: Do not harvest.</strong></p><p>Betrays healing virtues and trustworthiness of a physician.</p>',
  },
  whistleblower: {
    utilitarian:
      '<p><strong>Conclusion: Expose the company.</strong></p><p>Prevents wider, long-term harm; benefits many over few.</p>',
    deontologist:
      '<p><strong>Conclusion: Expose the company.</strong></p><p>Duty to be truthful and not harm others overrides consequences.</p>',
    virtue_ethicist:
      '<p><strong>Conclusion: Expose the company.</strong></p><p>Acts with integrity and courage for the common good.</p>',
  },
  autonomous_ship: {
    utilitarian:
      '<p><strong>Conclusion: Swerve to save lives.</strong></p><p>Human life outweighs property; minimizes suffering.</p>',
    deontologist:
      '<p><strong>Conclusion: Swerve to save lives.</strong></p><p>Protect persons as ends; duty to preserve life.</p>',
    virtue_ethicist:
      '<p><strong>Conclusion: Swerve to save lives.</strong></p><p>Demonstrates compassion and justice.</p>',
  },
  privacy_ai: {
    utilitarian:
      '<p><strong>Conclusion: Implement with safeguards.</strong></p><p>Large benefit with strong oversight and transparency.</p>',
    deontologist:
      '<p><strong>Conclusion: Do not implement mass surveillance.</strong></p><p>Violates autonomy and treats citizens as means.</p>',
    virtue_ethicist:
      '<p><strong>Conclusion: Only with ethical framework.</strong></p><p>Balance security with dignity and transparency.</p>',
  },
  climate_action: {
    utilitarian:
      '<p><strong>Conclusion: Pass the policy.</strong></p><p>Long-term global benefits outweigh short-term costs.</p>',
    deontologist:
      '<p><strong>Conclusion: Pass if duties to future persons are recognized.</strong></p><p>Do not offload harm onto future generations.</p>',
    virtue_ethicist:
      '<p><strong>Conclusion: Act responsibly.</strong></p><p>Exhibits prudence, justice, and stewardship.</p>',
  },
  algorithmic_bias: {
    utilitarian:
      '<p><strong>Conclusion: Continue with strict mitigation.</strong></p><p>Efficiency gains acceptable only with rapid bias reduction.</p>',
    deontologist:
      '<p><strong>Conclusion: Suspend until fair.</strong></p><p>Discrimination violates rights regardless of outcome.</p>',
    virtue_ethicist:
      '<p><strong>Conclusion: Build just systems.</strong></p><p>Prioritize fairness, transparency, and accountability.</p>',
  },
  rescue_robot: {
    utilitarian:
      '<p><strong>Conclusion: Save the three if expected value is higher.</strong></p><p>Choose the option with greater expected lives saved.</p>',
    deontologist:
      '<p><strong>Conclusion: Do not instrumentalize individuals.</strong></p><p>Avoid calculations that treat persons as means.</p>',
    virtue_ethicist:
      '<p><strong>Conclusion: Exercise practical wisdom.</strong></p><p>Judge context sensitively with courage and compassion.</p>',
  },
  custom: {
    utilitarian:
      '<p><strong>Conclusion depends on totals.</strong></p><p>Choose the action with maximal expected well-being.</p>',
    deontologist:
      '<p><strong>Conclusion depends on duties.</strong></p><p>Follow universalizable rules; never treat persons as mere means.</p>',
    virtue_ethicist:
      '<p><strong>Conclusion depends on character.</strong></p><p>Act in ways that express justice, courage, compassion, and wisdom.</p>',
  },
} as const

type PhilosopherKey = 'utilitarian' | 'deontologist' | 'virtue_ethicist'

const HtmlRenderer = ({ html }: { html: string }) => (
  <div
    className="prose-custom"
    dangerouslySetInnerHTML={{ __html: html }}
  />
)

export default function LandingPage() {
  const [selected, setSelected] = useState<DilemmaKey>('trolley')
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<{ [k in PhilosopherKey]?: string }>({})
  const [authedUserId, setAuthedUserId] = useState<string | null>(null)
  const [authToken, setAuthToken] = useState<string>('')
  const [savedToast, setSavedToast] = useState<'idle' | 'saved'>('idle')
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    try { setLangState(getLang()) } catch {}
    if (!hasSupabaseEnv) { setAuthedUserId(null); setAuthToken(''); return }
    const supabase = getSupabase()
    supabase?.auth.getSession().then(({ data }) => {
      const token = data?.session?.access_token || ''
      setAuthToken(token)
      const user = data?.session?.user
      if (user?.id) setAuthedUserId(user.id)
      else setAuthedUserId(null)
    })
  }, [])

  const changeLang = useCallback((next: Lang) => {
    setLang(next)
    setLangState(next)
  }, [])

  const persistIfAuthed = useCallback(async (key: DilemmaKey | 'custom', customText: string, answers: {utilitarian?: string, deontologist?: string, virtue_ethicist?: string}) => {
    if (!authedUserId) return
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          user_id: authedUserId,
          dilemma_key: key === 'custom' ? null : key,
          custom_text: key === 'custom' ? customText : null,
          utilitarian_html: answers.utilitarian || null,
          deontologist_html: answers.deontologist || null,
          virtue_ethicist_html: answers.virtue_ethicist || null,
        })
      })
      if (res.ok) {
        setSavedToast('saved')
        setTimeout(()=>setSavedToast('idle'), 2000)
      }
    } catch {}
  }, [authedUserId, authToken])

  const analyze = useCallback(() => {
    setLoading(true)
    setResponses({})
    const key: DilemmaKey | 'custom' = custom.trim() ? 'custom' : selected

    setTimeout(() => {
      const answerBlock = {
        utilitarian: (mockResponses as any)[key].utilitarian as string,
        deontologist: (mockResponses as any)[key].deontologist as string,
        virtue_ethicist: (mockResponses as any)[key].virtue_ethicist as string,
      }
      setResponses(answerBlock)
      setLoading(false)
      persistIfAuthed(key, custom.trim(), answerBlock)
    }, 900)
  }, [custom, selected, persistIfAuthed])

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Background grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#121212] bg-[radial-gradient(#2e2e2e_1px,transparent_1px)] [background-size:32px_32px]"></div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-300 to-blue-300"
        >
          {t(lang, 'app_title')}
        </motion.h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
          {t(lang, 'hero_tagline')}
        </p>

        {/* Action buttons near header */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/learn" className="inline-flex items-center gap-2 btn-secondary">
            <BookOpen className="w-5 h-5"/> {t(lang, 'learn_ai')}
          </Link>
          <a
            href="#analyze"
            onClick={(e)=>{ e.preventDefault(); setCustom(' '); document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 btn-primary"
          >
            <PenSquare className="w-5 h-5"/> {t(lang, 'create_dilemma')}
          </a>
          <select value={lang} onChange={e=>changeLang(e.target.value as Lang)} className="ml-2 bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-lg dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
            <option value="pt">PT</option>
          </select>
        </div>
      </section>

      {/* Pillars */}
      <section id="learn" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <UtilitarianIcon />
            <h3 className="text-xl font-semibold text-cyan-400">{t(lang, 'utilitarian_ai')}</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{t(lang, 'utilitarian_desc')}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <DeontologistIcon />
            <h3 className="text-xl font-semibold text-fuchsia-400">{t(lang, 'deontologist_ai')}</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{t(lang, 'deontologist_desc')}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <VirtueEthicistIcon />
            <h3 className="text-xl font-semibold text-yellow-400">{t(lang, 'virtue_ai')}</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{t(lang, 'virtue_desc')}</p>
        </div>
      </section>

      {/* Sign in / Sign up buttons directly below the three AI notes (only when not signed in) */}
      {!authedUserId && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/signin" className="btn-primary">{t(lang, 'signin')}</Link>
            <Link href="/signup" className="btn-secondary">{t(lang, 'signup')}</Link>
          </div>
        </section>
      )}

      {/* Analyzer */}
      <section id="analyze" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="card">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex border-b border-gray-700 mb-4 gap-2">
                <button
                  onClick={() => { setCustom('') }}
                  className={`py-2 px-4 font-semibold -mb-px border-b-2 ${custom ? 'text-gray-400 border-transparent hover:text-white' : 'text-blue-400 border-blue-400'}`}
                >
                  Classic Dilemmas
                </button>
                <button
                  onClick={() => { if (!custom) setCustom(' ') }}
                  className={`py-2 px-4 font-semibold -mb-px border-b-2 ${custom ? 'text-blue-400 border-blue-400' : 'text-gray-400 border-transparent hover:text-white'}`}
                >
                  Write Your Own
                </button>
              </div>

              {!custom && (
                <div>
                  <label htmlFor="dilemma" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Choose a scenario:</label>
                  <select
                    id="dilemma"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value as DilemmaKey)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(dilemmas).map(([key, d]) => (
                      <option key={key} value={key}>{d.title}</option>
                    ))}
                  </select>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">{dilemmas[selected].text}</p>
                </div>
              )}

              {!!custom && (
                <div>
                  <label htmlFor="custom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Describe your dilemma:</label>
                  <textarea
                    id="custom"
                    rows={6}
                    value={custom.trimStart()}
                    placeholder="e.g., Should we deploy an AI that reduces crime by 80% but increases surveillance?"
                    onChange={(e) => setCustom(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={analyze}
                  disabled={loading || (!!custom && !custom.trim())}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>Analyzing...</span></>) : (<><Sparkles className="w-5 h-5" /><span>Analyze</span></>)}
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card border border-cyan-400/40">
                <div className="flex items-center gap-2 mb-2">
                  <UtilitarianIcon />
                  <h4 className="font-semibold text-cyan-400">Utilitarian</h4>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-2/3" />
                  </div>
                ) : (
                  responses.utilitarian && <HtmlRenderer html={responses.utilitarian} />
                )}
              </div>
              <div className="card border border-fuchsia-400/40">
                <div className="flex items-center gap-2 mb-2">
                  <DeontologistIcon />
                  <h4 className="font-semibold text-fuchsia-400">Deontologist</h4>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-2/3" />
                  </div>
                ) : (
                  responses.deontologist && <HtmlRenderer html={responses.deontologist} />
                )}
              </div>
              <div className="card border border-yellow-400/40">
                <div className="flex items-center gap-2 mb-2">
                  <VirtueEthicistIcon />
                  <h4 className="font-semibold text-yellow-400">Virtue Ethicist</h4>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-2/3" />
                  </div>
                ) : (
                  responses.virtue_ethicist && <HtmlRenderer html={responses.virtue_ethicist} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating History Button */}
      <Link href="/history" className="fixed left-4 bottom-4 md:left-6 md:bottom-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-3 shadow-lg">
          <History className="w-5 h-5" />
          <span className="hidden sm:inline">{t(lang, 'history')}</span>
        </span>
      </Link>

      {/* Floating Settings Button */}
      <Link href="/settings" className="fixed right-4 bottom-4 md:right-6 md:bottom-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 px-4 py-3 shadow-lg">
          <Settings className="w-5 h-5" />
          <span className="hidden sm:inline">{t(lang, 'settings')}</span>
        </span>
      </Link>

      {savedToast==='saved' && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-20 bg-gray-800 border border-green-500/30 text-green-300 px-4 py-2 rounded-lg shadow-lg inline-flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4"/> Saved to your history
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-gray-500">
        <div className="mb-2">Built with Next.js + Tailwind. Aletheia © {new Date().getFullYear()}.</div>
        {!authedUserId && (
          <div className="text-xs text-gray-400">
            {t(lang, 'not_saved_notice')} <Link href="/signin" className="text-blue-400 hover:underline">{t(lang, 'signin')}</Link> {t(lang, 'sign_in_to_keep')}
          </div>
        )}
      </footer>
    </div>
  )
}
