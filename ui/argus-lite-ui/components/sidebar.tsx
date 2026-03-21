'use client'

import { type EngineType } from '@/lib/api'
import { cn } from '@/lib/utils'
import {
  Globe,
  TrendingUp,
  Activity,
  Cpu,
  Zap,
  Wind,
  Search,
} from 'lucide-react'

interface SidebarProps {
  activeEngine: EngineType
  onEngineChange: (engine: EngineType) => void
}

const engines = [
  {
    id: 'research' as EngineType,
    label: 'Research Engine',
    sublabel: 'General Web Intelligence',
    icon: Globe,
    description:
      'Scrapes the live web and synthesizes multi-source factual reports.',
    accent: 'cyan',
  },
  {
    id: 'finance' as EngineType,
    label: 'Financial Analyst',
    sublabel: 'Market & Investment Engine',
    icon: TrendingUp,
    description:
      'Pulls live market data and produces investment-grade analysis.',
    accent: 'emerald',
  },
]

const techStack = [
  { label: 'LangGraph',  icon: Activity, color: 'text-violet-400' },
  { label: 'FastAPI',    icon: Zap,      color: 'text-teal-400'   },
  { label: 'Gemini',     icon: Cpu,      color: 'text-blue-400'   },
  { label: 'Tavily',     icon: Search,   color: 'text-amber-400'  },
  { label: 'yFinance',   icon: Wind,     color: 'text-emerald-400' },
]

export default function Sidebar({ activeEngine, onEngineChange }: SidebarProps) {
  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col border-r border-argus-border bg-argus-surface">
      {/* ── Logo ── */}
      <div className="px-5 py-5 border-b border-argus-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Activity className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="font-syne text-[11px] font-bold text-argus-text tracking-[0.15em] uppercase leading-none">
              Project Argus
            </p>
            <p className="font-mono text-[9px] text-argus-dim mt-0.5 tracking-widest uppercase">
              Lite v1.0
            </p>
          </div>
        </div>
      </div>

      {/* ── Engine Selection ── */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-argus-dim px-2 mb-3">
          Select Engine
        </p>

        {engines.map((engine) => {
          const Icon = engine.icon
          const isActive = activeEngine === engine.id
          const isCyan = engine.accent === 'cyan'

          return (
            <button
              key={engine.id}
              onClick={() => onEngineChange(engine.id)}
              className={cn(
                'w-full text-left px-3 py-3 rounded-xl border transition-all duration-200 group relative overflow-hidden',
                isActive
                  ? isCyan
                    ? 'border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-cyan-500/5'
                    : 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-emerald-500/5'
                  : 'border-argus-border hover:border-argus-border-mid hover:bg-argus-card'
              )}
            >
              {/* Active glow strip */}
              {isActive && (
                <div
                  className={cn(
                    'absolute left-0 top-0 bottom-0 w-0.5 rounded-full',
                    isCyan ? 'bg-cyan-400' : 'bg-emerald-400'
                  )}
                />
              )}

              <div className="flex items-start gap-2.5 pl-1">
                <Icon
                  className={cn(
                    'w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-colors',
                    isActive
                      ? isCyan
                        ? 'text-cyan-400'
                        : 'text-emerald-400'
                      : 'text-argus-dim group-hover:text-argus-muted'
                  )}
                />
                <div className="min-w-0">
                  <p
                    className={cn(
                      'font-syne text-xs font-semibold leading-none transition-colors',
                      isActive
                        ? isCyan
                          ? 'text-cyan-300'
                          : 'text-emerald-300'
                        : 'text-argus-muted group-hover:text-argus-text'
                    )}
                  >
                    {engine.label}
                  </p>
                  <p className="text-[10px] text-argus-dim mt-1 leading-tight">
                    {engine.sublabel}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* ── System Status ── */}
      <div className="px-5 py-3 border-t border-argus-border">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-argus-dim mb-2">
          System Status
        </p>
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] text-argus-dim">
            localhost:8000
          </span>
        </div>
      </div>

      {/* ── Tech Stack ── */}
      <div className="px-5 py-4 border-t border-argus-border">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-argus-dim mb-3">
          Powered By
        </p>
        <div className="space-y-1.5">
          {techStack.map(({ label, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-2 py-1 rounded-md"
            >
              <Icon className={cn('w-3 h-3 flex-shrink-0', color)} />
              <span className="font-mono text-[10px] text-argus-dim">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}