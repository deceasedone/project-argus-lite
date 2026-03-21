'use client'

import { useEffect, useState } from 'react'
import { type EngineType } from '@/lib/api'
import { cn } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

const steps: Record<EngineType, { label: string; detail: string; icon: string }[]> = {
  research: [
    { label: 'Planner Agent',      detail: 'Extracting entities and decomposing the query',   icon: '◎' },
    { label: 'Researcher Agent',   detail: 'Fetching live data from the web via Tavily',      icon: '◎' },
    { label: 'Fact-Checker Agent', detail: 'Cross-referencing claims across sources',         icon: '◎' },
    { label: 'Reviewer Agent',     detail: 'Evaluating quality and flagging gaps',            icon: '◎' },
    { label: 'Formatter Agent',    detail: 'Applying Markdown structure to the final report', icon: '◎' },
  ],
  finance: [
    { label: 'Planner Agent',      detail: 'Identifying tickers and decomposing the query',  icon: '◎' },
    { label: 'Researcher Agent',   detail: 'Pulling live market data via yFinance',           icon: '◎' },
    { label: 'Fact-Checker Agent', detail: 'Verifying figures and news accuracy',             icon: '◎' },
    { label: 'Reviewer Agent',     detail: 'Writing the investment thesis',                   icon: '◎' },
    { label: 'Formatter Agent',    detail: 'Applying Markdown structure to the final report', icon: '◎' },
  ],
}

const messages: Record<EngineType, string[]> = {
  research: [
    'Planner Agent: extracting entities from query…',
    'Researcher Agent: fetching live data via Tavily…',
    'Researcher Agent: reading and parsing web pages…',
    'Fact-Checker Agent: cross-referencing claims…',
    'Fact-Checker Agent: flagging inconsistencies…',
    'Reviewer Agent: evaluating report quality…',
    'Reviewer Agent: sending feedback to researcher…',
    'Formatter Agent: applying Markdown structure…',
  ],
  finance: [
    'Planner Agent: identifying tickers and intent…',
    'Researcher Agent: pulling live data via yFinance…',
    'Researcher Agent: scanning financial news feeds…',
    'Fact-Checker Agent: verifying figures and dates…',
    'Fact-Checker Agent: cross-checking news accuracy…',
    'Reviewer Agent: writing the investment thesis…',
    'Reviewer Agent: stress-testing the analysis…',
    'Formatter Agent: applying Markdown structure…',
  ],
}

const skeletonWidths = [92, 74, 88, 58, 96, 70, 42, 80, 54, 36]

const accentMap = {
  research: { color: '#f59e0b', soft: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)', done: 'rgba(245,158,11,0.3)' },
  finance:  { color: '#8b5cf6', soft: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.18)', done: 'rgba(139,92,246,0.3)' },
}

export default function LoadingState({ engine }: { engine: EngineType }) {
  const [step,    setStep]    = useState(0)
  const [msgIdx,  setMsgIdx]  = useState(0)
  const [elapsed, setElapsed] = useState(0)

  const a    = accentMap[engine]
  const list = steps[engine]
  const msgs = messages[engine]

  useEffect(() => {
    const id = setInterval(() => setStep((p) => Math.min(p + 1, list.length - 1)), 4000)
    return () => clearInterval(id)
  }, [list.length])

  useEffect(() => {
    const id = setInterval(() => setMsgIdx((p) => (p + 1) % msgs.length), 2500)
    return () => clearInterval(id)
  }, [msgs.length])

  useEffect(() => {
    const id = setInterval(() => setElapsed((p) => p + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mt-8 space-y-4 animate-fade-in">

      {/* Status bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
            style={{ background: a.color }}
          />
          <p
            key={msgIdx}
            className="font-mono text-xs truncate animate-fade-in"
            style={{ color: a.color }}
          >
            {msgs[msgIdx]}
          </p>
        </div>
        <span className="font-mono text-[10px] text-ae-dim flex-shrink-0">
          {elapsed}s
        </span>
      </div>

      {/* Pipeline tracker */}
      <div className="rounded-2xl border border-ae-border bg-ae-card overflow-hidden">
        <div className="px-5 py-3 border-b border-ae-border flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ae-dim">
            Agent Pipeline
          </span>
          <span className="font-mono text-[9px] text-ae-dim">
            {step + 1}/{list.length}
          </span>
        </div>

        {list.map((s, i) => {
          const isDone   = i < step
          const isActive = i === step

          return (
            <div
              key={s.label}
              className={cn(
                'flex items-center gap-4 px-5 py-3.5 border-b border-ae-border last:border-0',
                'transition-all duration-500',
                isDone && 'opacity-40',
              )}
              style={isActive ? { background: a.soft } : undefined}
            >
              {/* State dot */}
              <div className="w-5 flex items-center justify-center flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: a.done }} />
                ) : isActive ? (
                  <span className="relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: a.color }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ background: a.color }}
                    />
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-ae-border block" />
                )}
              </div>

              {/* Labels */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-outfit text-xs font-semibold leading-none"
                  style={{
                    color: isActive ? a.color : isDone ? a.done : '#44424e',
                  }}
                >
                  {s.label}
                </p>
                <p className="text-[10px] text-ae-dim mt-1">{s.detail}</p>
              </div>

              {/* Status label */}
              <div className="w-14 text-right flex-shrink-0">
                {isDone && (
                  <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: a.done }}>
                    Done
                  </span>
                )}
                {isActive && (
                  <span
                    className="font-mono text-[9px] uppercase tracking-wider animate-pulse"
                    style={{ color: a.color }}
                  >
                    Running
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Skeleton preview */}
      <div className="rounded-2xl border border-ae-border bg-ae-card overflow-hidden">
        <div className="px-5 py-3 border-b border-ae-border">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ae-dim">
            Awaiting Report
          </span>
        </div>
        <div className="p-6 space-y-2.5">
          <div className="h-5 w-48 rounded-lg shimmer-skel mb-5" />
          {skeletonWidths.map((w, i) => (
            <div
              key={i}
              className="h-2 rounded-full shimmer-skel"
              style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }}
            />
          ))}
          <div className="pt-4 space-y-2.5">
            <div className="h-4 w-36 rounded-lg shimmer-skel mb-3" />
            {[82, 64, 73].map((w, i) => (
              <div
                key={i}
                className="h-2 rounded-full shimmer-skel"
                style={{ width: `${w}%`, animationDelay: `${(i + 10) * 90}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}