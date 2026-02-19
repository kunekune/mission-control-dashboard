import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/../convex/_generated/api'
import { Id } from '@/../convex/_generated/dataModel'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'list') {
      const sessions = await convex.query(api.team.getAgentSessions, { limit: 50 })
      const active = sessions.filter((s) => s.status === 'running')
      return NextResponse.json(active)
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, target, message } = body

    if (action === 'kill') {
      await convex.mutation(api.team.completeAgentSession, {
        sessionId: target as Id<'agent_sessions'>,
        status: 'cancelled',
      })
      return NextResponse.json({ success: true })
    }

    if (action === 'steer') {
      // Convexにメモとして結果を記録（steerはセッションのresultフィールドを更新）
      const sessions = await convex.query(api.team.getAgentSessions, { limit: 50 })
      const session = sessions.find((s) => s._id === target)
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }
      // steerメッセージをresultフィールドにメモとして追記
      await convex.mutation(api.team.completeAgentSession, {
        sessionId: target as Id<'agent_sessions'>,
        status: 'completed',
        result: `[Steered] ${message}`,
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
