'use client'

import React from 'react'
import Link from 'next/link'
import { t, getLang, type Lang } from '@/lib/i18n'
import { ArrowLeft, Scale, Shield, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const Section = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="card mb-8"
  >
    {children}
  </motion.section>
)

export default function LearnPage() {
  const lang: Lang = typeof document !== 'undefined' ? (getLang() as Lang) : 'en'
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#121212] bg-[radial-gradient(#2e2e2e_1px,transparent_1px)] [background-size:32px_32px]"></div>

      <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
          <ArrowLeft className="w-5 h-5" /> {t(lang, 'back')}
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-300 to-blue-300"
        >
          How The Three AIs Think
        </motion.h1>
        <p className="text-gray-300 mb-8">
          Aletheia analyzes dilemmas using three distinct traditions of moral philosophy. Below is a
          deep dive into how each AI reasons, the decision rules it follows, where it shines, and
          where it can fail. Use the guide to understand why their conclusions sometimes agree—and
          often conflict.
        </p>

        {/* Table of contents */}
        <nav className="card mb-10">
          <h2 className="text-lg font-semibold text-white mb-3">On this page</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li><a className="text-blue-400 hover:underline" href="#utilitarian">Utilitarian AI</a></li>
            <li><a className="text-blue-400 hover:underline" href="#deontologist">Deontologist AI</a></li>
            <li><a className="text-blue-400 hover:underline" href="#virtue">Virtue Ethicist AI</a></li>
          </ul>
        </nav>

        {/* Utilitarian AI */}
        <Section delay={0.05}>
          <div id="utilitarian" className="mb-4 flex items-center gap-3">
            <Scale className="h-8 w-8 text-cyan-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-400">Utilitarian AI</h2>
          </div>

          <div className="prose-custom">
            <p>
              Utilitarianism evaluates actions by their consequences. The central aim is to
              <strong> maximize total well-being and minimize suffering</strong> for everyone affected.
              This AI estimates outcomes, aggregates benefits and harms, and selects the option with
              the highest expected value.
            </p>

            <h3>Core Decision Rule</h3>
            <ul>
              <li>List stakeholders and possible actions.</li>
              <li>Estimate outcomes (best/worst cases and probabilities).</li>
              <li>Translate outcomes into a common utility scale.</li>
              <li>Choose the action with the highest expected total utility.</li>
            </ul>

            <h3>Strengths</h3>
            <ul>
              <li>Clear, outcome-focused; handles trade-offs transparently.</li>
              <li>Useful in policy, risk, and resource allocation decisions.</li>
              <li>Encourages data-driven, empirically grounded reasoning.</li>
            </ul>

            <h3>Limitations</h3>
            <ul>
              <li>Utility is hard to measure and compare across people.</li>
              <li>May justify harmful acts if they raise net utility ("ends justify means").</li>
              <li>Can overlook rights, promises, and fairness constraints.</li>
            </ul>

            <h3>Walk-through Example</h3>
            <p>
              In the trolley problem, Utilitarian AI weighs <em>five lives</em> against <em>one</em>.
              If all else is equal, it concludes pulling the lever maximizes total well-being.
            </p>
          </div>
        </Section>

        {/* Deontologist AI */}
        <Section delay={0.1}>
          <div id="deontologist" className="mb-4 flex items-center gap-3">
            <Shield className="h-8 w-8 text-fuchsia-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-fuchsia-400">Deontologist AI</h2>
          </div>

          <div className="prose-custom">
            <p>
              Deontology judges actions by whether they follow <strong>moral rules and duties</strong>,
              not by outcomes alone. It asks: Could the rule behind my action be universalized without
              contradiction? Does this action treat persons as ends in themselves, never merely as means?
            </p>

            <h3>Core Decision Rule</h3>
            <ul>
              <li>Identify the maxim (underlying rule) behind the action.</li>
              <li>Test universalizability: could everyone follow this rule?</li>
              <li>Check respect for persons: never use people merely as tools.</li>
              <li>If a duty is violated, the action is impermissible regardless of outcome.</li>
            </ul>

            <h3>Strengths</h3>
            <ul>
              <li>Protects rights, dignity, and moral constraints.</li>
              <li>Resists "ends justify means" reasoning.</li>
              <li>Supports trust, promises, and rule-governed institutions.</li>
            </ul>

            <h3>Limitations</h3>
            <ul>
              <li>Can be inflexible in emergencies or tragic trade-offs.</li>
              <li>Conflicts between duties may be hard to resolve.</li>
              <li>Less sensitive to net harms when duties collide.</li>
            </ul>

            <h3>Walk-through Example</h3>
            <p>
              In the trolley problem, Deontologist AI rejects pulling the lever if it treats the one
              person merely as a means to save five. Violating a duty not to kill cannot be justified
              by better outcomes.
            </p>
          </div>
        </Section>

        {/* Virtue Ethicist AI */}
        <Section delay={0.15}>
          <div id="virtue" className="mb-4 flex items-center gap-3">
            <Heart className="h-8 w-8 text-yellow-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">Virtue Ethicist AI</h2>
          </div>

          <div className="prose-custom">
            <p>
              Virtue ethics focuses on <strong>character and moral growth</strong>. The central
              question is: What would a wise, virtuous agent do here? It emphasizes virtues like
              courage, justice, compassion, and practical wisdom (<em>phronēsis</em>).
            </p>

            <h3>Core Decision Approach</h3>
            <ul>
              <li>Understand the context and relationships involved.</li>
              <li>Discern which virtues are at stake (e.g., courage vs. compassion).</li>
              <li>Seek the action that best expresses balanced, well-formed character.</li>
              <li>Learn from exemplars—what would a truly virtuous person do?</li>
            </ul>

            <h3>Strengths</h3>
            <ul>
              <li>Balances rules and outcomes through practical wisdom.</li>
              <li>Centers integrity, empathy, and human flourishing.</li>
              <li>Resonates with lived experience and moral development.</li>
            </ul>

            <h3>Limitations</h3>
            <ul>
              <li>Less algorithmic; requires mature judgment and context sensitivity.</li>
              <li>Different cultures may prize different virtues.</li>
              <li>Ambiguity when virtues conflict without a clear resolution.</li>
            </ul>

            <h3>Walk-through Example</h3>
            <p>
              In the trolley problem, Virtue Ethicist AI considers compassion for the many and justice
              for the one, aiming for the <em>most</em> virtuous act in tragic circumstances—often pulling
              the lever, but with moral sobriety rather than simple arithmetic.
            </p>
          </div>
        </Section>

        {/* Footer nav */}
        <div className="text-center mt-10">
          <Link href="/" className="btn-secondary">Back to Analyzer</Link>
        </div>
      </main>
    </div>
  )
}
