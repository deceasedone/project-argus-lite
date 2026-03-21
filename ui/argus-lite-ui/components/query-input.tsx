'use client'

import { useState, useRef } from 'react'
import { type EngineType } from '@/lib/api'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Loader2 } from 'lucide-react'

const placeholders: Record<EngineType, string> = {
  research: 'e.g., What are the latest breakthroughs in solid-state battery technology?',
  finance:  'e.g., Analyze NVDA and AMD recent performance and give an investment outlook.',
}

const accentMap = {
  research: {
    accent:       '#f59e0b',
    accentHover:  '#fbbf24',
    accentSoft:   'rgba(245,158,11,0.08)',
    accentBorder: 'rgba(245,158,11,0.22)',
    focusShadow:  '0 0 0 1px rgba(245,158,11,0.3), 0 4px 40px rgba(245,158,11,0.06)',
    btnBg:        'linear-gradient(135deg,#f59e0b,#d97706)',
    btnColor:     '#1a0f00',
  },
  finance: {
    accent:       '#8b5cf6',
    accentHover:  '#a78bfa',
    accentSoft:   'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.22)',
    focusShadow:  '0 0 0 1px rgba(139,92,246,0.3), 0 4px 40px rgba(139,92,246,0.06)',
    btnBg:        'linear-gradient(135deg,#8b5cf6,#7c3aed)',
    btnColor:     '#f0ecff',
  },
}

export default function QueryInput({
  engine,
  onSubmit,
  isLoading,
}: {
  engine:    EngineType
  onSubmit:  (q: string) => void
  isLoading: boolean
}) {
  const [query, setQuery]     = useState('')
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const a   = accentMap[engine]
  const empty = !query.trim()

  const submit = () => { if (!empty && !isLoading) onSubmit(query.trim()) }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit() }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value)
    const el = ref.current
    if (el) { el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 180)}px` }
  }

  return (
    <div
      className="rounded-2xl border bg-ae-card transition-all duration-300 overflow-hidden animate-fade-up"
      style={{
        borderColor: focused ? a.accentBorder : '#222228',
        boxShadow:   focused ? a.focusShadow : 'none',
      }}
    >
      <textarea
        ref={ref}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKey}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholders[engine]}
        disabled={isLoading}
        rows={3}
        className={cn(
          'w-full bg-transparent px-5 pt-5 pb-2 text-sm leading-relaxed',
          'text-ae-text placeholder-ae-dim font-sans',
          'outline-none resize-none',
          'disabled:opacity-40 disabled:cursor-not-allowed'
        )}
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-5 pb-4 pt-1">
        <span className="font-mono text-[10px] text-ae-dim select-none">
          <kbd className="px-1.5 py-0.5 rounded border border-ae-border text-[9px] font-mono bg-ae-surface">⌘</kbd>
          {' + '}
          <kbd className="px-1.5 py-0.5 rounded border border-ae-border text-[9px] font-mono bg-ae-surface">↵</kbd>
          {' to run'}
        </span>

        <button
          onClick={submit}
          disabled={empty || isLoading}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-outfit text-xs font-semibold',
            'transition-all duration-200',
            'disabled:opacity-35 disabled:cursor-not-allowed',
            !empty && !isLoading && 'hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]'
          )}
          style={{
            background: empty || isLoading ? '#1c1c22' : a.btnBg,
            color:      empty || isLoading ? '#44424e'  : a.btnColor,
          }}
        >
          {isLoading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running…</>
          ) : (
            <><ArrowUpRight className="w-3.5 h-3.5" /> Run Engine</>
          )}
        </button>
      </div>
    </div>
  )
}