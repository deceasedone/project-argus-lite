'use client'

import { useState, useCallback } from 'react'
import TopNav      from '@/components/top-nav'
import HeroSection from '@/components/hero-section'
import QueryInput  from '@/components/query-input'
import LoadingState from '@/components/loading-state'
import ResultCard  from '@/components/result-card'
import { runEngine, type EngineType, type EngineResult } from '@/lib/api'
import { AlertCircle, RefreshCcw } from 'lucide-react'

type Status = 'idle' | 'loading' | 'result' | 'error'

export default function Home() {
  const [engine,  setEngine]  = useState<EngineType>('research')
  const [status,  setStatus]  = useState<Status>('idle')
  const [result,  setResult]  = useState<EngineResult | null>(null)
  const [error,   setError]   = useState<string | null>(null)

  const reset = useCallback(() => {
    setStatus('idle'); setResult(null); setError(null)
  }, [])

  const handleEngineChange = useCallback((next: EngineType) => {
    setEngine(next); reset()
  }, [reset])

  const handleSubmit = useCallback(async (query: string) => {
    setStatus('loading'); setResult(null); setError(null)
    try {
      const data = await runEngine(engine, query)
      setResult(data); setStatus('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.')
      setStatus('error')
    }
  }, [engine])

  const accentColor = engine === 'research' ? '#f59e0b' : '#8b5cf6'

  return (
    <div className="min-h-screen flex flex-col bg-ae-bg">

      {/* Top Navigation */}
      <TopNav activeEngine={engine} onEngineChange={handleEngineChange} />

      {/* Dot-grid background */}
      <div className="dot-grid fixed inset-0 pointer-events-none z-0" />

      {/* Ambient blobs */}
      <div
        className="fixed top-[-120px] right-[-120px] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none z-0 transition-colors duration-1000"
        style={{ background: engine === 'research' ? 'rgba(245,158,11,0.035)' : 'rgba(139,92,246,0.035)' }}
      />
      <div
        className="fixed bottom-[-80px] left-[10%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none z-0 transition-colors duration-1000"
        style={{ background: engine === 'research' ? 'rgba(234,88,12,0.025)' : 'rgba(109,40,217,0.025)' }}
      />

      {/* Page content */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 pt-14 pb-24">

          <HeroSection engine={engine} />

          {/* Divider */}
          <div
            className="h-px w-full mb-8 rounded-full"
            style={{ background: `linear-gradient(to right, ${accentColor}30, transparent)` }}
          />

          {/* Input — hidden when results are showing */}
          {status !== 'result' && (
            <QueryInput
              engine={engine}
              onSubmit={handleSubmit}
              isLoading={status === 'loading'}
            />
          )}

          {/* Loading */}
          {status === 'loading' && <LoadingState engine={engine} />}

          {/* Error */}
          {status === 'error' && error && (
            <div className="mt-6 rounded-2xl border border-red-900/40 bg-red-950/20 p-5 animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-xs text-red-400 font-medium mb-1">Engine Error</p>
                  <p className="font-mono text-[11px] text-red-600 break-words">{error}</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-red-700 hover:text-red-400 transition-colors"
              >
                <RefreshCcw className="w-3 h-3" /> Try again
              </button>
            </div>
          )}

          {/* Result */}
          {status === 'result' && result && (
            <ResultCard result={result} engine={engine} onReset={reset} />
          )}

        </div>
      </main>
    </div>
  )
}