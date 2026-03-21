export type EngineType = 'research' | 'finance'

export interface EngineResult {
  final_report: string
  iterations:   number
}

const API_BASE = 'http://localhost:8000/api/v1'

export async function runEngine(engine: EngineType, query: string): Promise<EngineResult> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}/${engine}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
  } catch {
    throw new Error('Cannot reach the backend. Is FastAPI running on localhost:8000?')
  }

  if (!response.ok) {
    const body = await response.text().catch(() => response.statusText)
    throw new Error(`Backend error ${response.status}: ${body}`)
  }

  return response.json() as Promise<EngineResult>
}