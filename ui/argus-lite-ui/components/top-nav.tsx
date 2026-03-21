'use client'

import { type EngineType } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Globe, TrendingUp, Activity, Cpu, Zap, Search, Wind } from 'lucide-react'

interface TopNavProps {
  activeEngine: EngineType
  onEngineChange: (e: EngineType) => void
}

const sharedStack = [
  { label: 'LangGraph', icon: Activity, color: '#a78bfa' },
  { label: 'FastAPI',   icon: Zap,      color: '#34d399' },
  { label: 'Gemini',    icon: Cpu,      color: '#60a5fa' },
]

const engineStack: Record<string, { label: string; icon: typeof Activity; color: string }> = {
  research: { label: 'Tavily',   icon: Search, color: '#f59e0b' },
  finance:  { label: 'yFinance', icon: Wind,   color: '#fb923c' },
}

export default function TopNav({ activeEngine, onEngineChange }: TopNavProps) {
  const isResearch = activeEngine === 'research'

  return (
    <header className="relative z-20 border-b border-ae-border bg-ae-surface/80 backdrop-blur-xl flex-shrink-0">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-6">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
          >
            <Activity className="w-3.5 h-3.5 text-ae-bg" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="font-outfit text-sm font-700 tracking-tight"
              style={{ color: '#e8e6e1', fontWeight: 700 }}
            >
              Argus
            </span>
            <span className="font-mono text-[9px] text-ae-dim tracking-widest uppercase">
              Lite
            </span>
          </div>
        </div>

        {/* ── Engine tabs ── */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-ae-card border border-ae-border">
          {(['research', 'finance'] as EngineType[]).map((eng) => {
            const isActive = activeEngine === eng
            const Icon = eng === 'research' ? Globe : TrendingUp
            const label = eng === 'research' ? 'Research Engine' : 'Financial Analyst'
            const accentColor = eng === 'research' ? '#f59e0b' : '#8b5cf6'

            return (
              <button
                key={eng}
                onClick={() => onEngineChange(eng)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium',
                  'transition-all duration-200 font-outfit',
                  isActive
                    ? 'text-ae-bg shadow-sm'
                    : 'text-ae-sub hover:text-ae-text hover:bg-ae-card-hi'
                )}
                style={
                  isActive
                    ? { background: accentColor, color: eng === 'research' ? '#1a0f00' : '#1a1033' }
                    : {}
                }
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {label}
              </button>
            )
          })}
        </nav>

        {/* ── Stack pills ── */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {sharedStack.map(({ label, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-ae-border bg-ae-card"
            >
              <Icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color }} />
              <span className="font-mono text-[9px] text-ae-dim">{label}</span>
            </div>
          ))}
          {/* Conditional: Tavily for research, yFinance for finance */}
          {(() => {
            const e = engineStack[activeEngine]
            const Icon = e.icon
            return (
              <div
                key={e.label}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-ae-border bg-ae-card transition-all duration-200"
              >
                <Icon className="w-2.5 h-2.5 flex-shrink-0" style={{ color: e.color }} />
                <span className="font-mono text-[9px] text-ae-dim">{e.label}</span>
              </div>
            )
          })()}
        </div>
      </div>
    </header>
  )
}