'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  })

  useEffect(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('aletheia_theme') : null
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored)
    }
  }, [])

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const html = document.documentElement
    if (next === 'dark') html.classList.add('dark')
    else html.classList.remove('dark')
    try { localStorage.setItem('aletheia_theme', next) } catch {}
    setTheme(next)
  }, [theme])

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="fixed top-4 right-4 z-50 inline-flex items-center justify-center rounded-full border bg-white text-gray-900 border-gray-200 shadow-sm hover:bg-gray-50 w-10 h-10 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
    </button>
  )
}


