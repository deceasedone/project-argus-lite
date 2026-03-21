import { type EngineType } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Globe, TrendingUp, ArrowRight } from 'lucide-react'

const config = {
  research: {
    icon:        Globe,
    tag:         'General Intelligence',
    headline:    'Web Research',
    headlineSub: 'Engine',
    body:        'Deploys a swarm of specialized agents to scrape, read, and triangulate information from across the live web — returning a clean, structured intelligence brief.',
    stats: [
      { value: '∞',  label: 'Live Sources'      },
      { value: '5',  label: 'Agent Roles'        },
      { value: '30s', label: 'Avg. Run Time'     },
    ],
    pills:  ['Web scraping', 'Multi-source synthesis', 'Fact validation', 'Structured brief'],
    accent: '#f59e0b',
    accentDark: '#92400e',
    accentSoft: 'rgba(245,158,11,0.07)',
    accentBorder: 'rgba(245,158,11,0.18)',
    gradient: 'from-amber-500 to-orange-500',
  },
  finance: {
    icon:        TrendingUp,
    tag:         'Financial Intelligence',
    headline:    'Financial',
    headlineSub: 'Analyst Engine',
    body:        'Wall Street-grade agents pull live ticker data, earnings releases, and breaking news — synthesizing it all into an actionable, citation-backed investment thesis.',
    stats: [
      { value: '$∞', label: 'Markets Covered'  },
      { value: '5',  label: 'Analyst Agents'   },
      { value: '25s', label: 'Avg. Run Time'   },
    ],
    pills:  ['Live market data', 'Earnings analysis', 'News sentiment', 'Investment thesis'],
    accent: '#8b5cf6',
    accentDark: '#4c1d95',
    accentSoft: 'rgba(139,92,246,0.07)',
    accentBorder: 'rgba(139,92,246,0.18)',
    gradient: 'from-violet-500 to-purple-600',
  },
}

export default function HeroSection({ engine }: { engine: EngineType }) {
  const c = config[engine]
  const Icon = c.icon

  return (
    <section className="mb-10 animate-fade-up">

      {/* Top tag row */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: c.accentSoft, border: `1px solid ${c.accentBorder}` }}
        >
          <Icon className="w-4 h-4" style={{ color: c.accent }} />
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.22em] font-medium"
          style={{ color: c.accent }}
        >
          {c.tag}
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-outfit text-[3.5rem] font-800 leading-[1.02] tracking-[-0.035em] mb-4" style={{ fontWeight: 800 }}>
        <span style={{ color: '#e8e6e1' }}>{c.headline}{' '}</span>
        <span
          className={cn('bg-gradient-to-r bg-clip-text text-transparent', c.gradient)}
        >
          {c.headlineSub}
        </span>
      </h1>

      {/* Body */}
      <p className="text-ae-sub text-sm leading-relaxed max-w-xl mb-7">
        {c.body}
      </p>

      {/* Stats row */}
      <div className="flex items-stretch gap-3 mb-7">
        {c.stats.map((s) => (
          <div
            key={s.label}
            className="flex-1 rounded-xl px-4 py-3 border"
            style={{ background: c.accentSoft, borderColor: c.accentBorder }}
          >
            <p
              className="font-outfit text-xl font-bold leading-none mb-1"
              style={{ color: c.accent, fontWeight: 700 }}
            >
              {s.value}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-ae-dim">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Capability pills */}
      <div className="flex flex-wrap gap-2">
        {c.pills.map((pill) => (
          <div
            key={pill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] border transition-all duration-150 hover:scale-[1.02]"
            style={{
              borderColor: c.accentBorder,
              color: c.accent,
              background: c.accentSoft,
            }}
          >
            <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" />
            {pill}
          </div>
        ))}
      </div>
    </section>
  )
}