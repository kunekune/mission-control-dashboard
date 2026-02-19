import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/../convex/_generated/api'

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, taskTitle, taskDescription, priority, model } = body

    const sessionId = await convex.mutation(api.team.createAgentSession, {
      agentId,
      taskTitle,
      taskDescription,
      priority: priority || 'medium',
    })

    return NextResponse.json({ sessionId, status: 'running' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message, status: 'failed' }, { status: 500 })
  }
}
