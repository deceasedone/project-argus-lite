'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm     from 'remark-gfm'
import { type EngineResult, type EngineType } from '@/lib/api'
import { cn } from '@/lib/utils'
import { CheckCircle2, Zap, Clock, RotateCcw } from 'lucide-react'

const accentMap = {
  research: {
    color:  '#f59e0b',
    soft:   'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.14)',
    label:  'Research Engine',
  },
  finance: {
    color:  '#8b5cf6',
    soft:   'rgba(139,92,246,0.07)',
    border: 'rgba(139,92,246,0.14)',
    label:  'Financial Analyst',
  },
}

export default function ResultCard({
  result,
  engine,
  onReset,
}: {
  result:  EngineResult
  engine:  EngineType
  onReset: () => void
}) {
  const a       = accentMap[engine]
  const report  = result.final_report.replace(/\\n/g, '\n')
  const words   = report.split(/\s+/).filter(Boolean).length
  const readMin = Math.max(1, Math.ceil(words / 200))

  return (
    <div className="mt-8 space-y-4 animate-fade-up">

      {/* ── Meta bar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Done */}
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: a.color }} />
            <span className="font-outfit text-xs text-ae-sub font-medium">Analysis complete</span>
          </div>

          {/* Iterations badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] border"
            style={{ borderColor: a.border, background: a.soft, color: a.color }}
          >
            <Zap className="w-2.5 h-2.5" />
            {result.iterations} iteration{result.iterations !== 1 ? 's' : ''}
          </div>

          {/* Reading time */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] border border-ae-border text-ae-dim">
            <Clock className="w-2.5 h-2.5" />
            ~{readMin} min read
          </div>
        </div>

        {/* New query */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 font-outfit text-xs px-3 py-1.5 rounded-xl border border-ae-border text-ae-sub hover:text-ae-text hover:border-ae-border-hi transition-all duration-150"
        >
          <RotateCcw className="w-3 h-3" />
          New Query
        </button>
      </div>

      {/* ── Report card ── */}
      <div
        className={cn(
          'rounded-2xl border p-8 bg-ae-card',
          engine === 'finance' && 'finance-md'
        )}
        style={{ borderColor: a.border }}
      >
        {/* Top accent line */}
        <div
          className="h-px w-full mb-7 rounded-full"
          style={{ background: `linear-gradient(to right, ${a.color}60, ${a.color}15, transparent)` }}
        />

        <div className="md">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-ae-border flex items-center gap-2">
          <span className="font-mono text-[9px] text-ae-dim uppercase tracking-widest">
            Project Argus Lite
          </span>
          <span className="text-ae-border mx-1">·</span>
          <span
            className="font-mono text-[9px] uppercase tracking-widest"
            style={{ color: a.color, opacity: 0.5 }}
          >
            {a.label}
          </span>
        </div>
      </div>
    </div>
  )
}