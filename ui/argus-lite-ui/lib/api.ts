export type EngineType = 'research' | 'finance'

export interface EngineResult {
  final_report: string
  iterations:   number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_BASE = `${API_URL}/api/v1`

export async function runEngine(engine: EngineType, query: string): Promise<EngineResult> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}/${engine}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
  } catch {
    throw new Error(`Cannot reach the backend. Ensure the API is running at ${API_BASE}`)
  }

  if (!response.ok) {
    const body = await response.text().catch(() => response.statusText)
    throw new Error(`Backend error ${response.status}: ${body}`)
  }

  return response.json() as Promise<EngineResult>
}