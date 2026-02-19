// OpenClaw Subagents Integration Layer
// This module bridges Team Structure UI with actual OpenClaw subagents functionality

export interface OpenClawSubagent {
  id: string
  status: 'active' | 'idle' | 'busy' | 'error'
  task: string
  startTime: number
  estimatedCompletion?: number
}

export interface SpinAgentRequest {
  agentId: string
  task: string
  model?: string
  timeoutSeconds?: number
  thinking?: string
}

export class OpenClawTeamBridge {
  /**
   * Spin up a subagent using actual OpenClaw sessions_spawn
   */
  static async spinAgent(request: SpinAgentRequest): Promise<string> {
    try {
      const result = await fetch('/api/sessions/spawn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: request.agentId,
          taskTitle: request.task,
          taskDescription: request.task,
          priority: 'medium',
          model: request.model,
        }),
      })

      if (!result.ok) {
        const err = await result.json()
        throw new Error(err.error || 'Failed to spawn agent')
      }

      const data = await result.json()
      console.log('Spinning agent:', request.agentId, 'for task:', request.task)
      return data.sessionId
    } catch (error) {
      console.error('Failed to spin agent:', error)
      throw error
    }
  }

  /**
   * Get current subagent status from OpenClaw
   */
  static async getSubagentStatus(): Promise<OpenClawSubagent[]> {
    try {
      const result = await fetch('/api/subagents?action=list')

      if (!result.ok) {
        const err = await result.json()
        throw new Error(err.error || 'Failed to fetch subagent status')
      }

      const sessions = await result.json()
      console.log('Fetching subagent status...')

      return sessions.map((s: any) => ({
        id: s._id,
        status: s.status === 'running' ? 'active' : s.status,
        task: s.taskTitle,
        startTime: s.startedAt,
        estimatedCompletion: s.estimatedDuration
          ? s.startedAt + s.estimatedDuration * 60 * 1000
          : undefined,
      }))
    } catch (error) {
      console.error('Failed to get subagent status:', error)
      return []
    }
  }

  /**
   * Kill a running subagent
   */
  static async killSubagent(sessionId: string): Promise<boolean> {
    try {
      const result = await fetch('/api/subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'kill',
          target: sessionId,
        }),
      })

      if (!result.ok) {
        const err = await result.json()
        throw new Error(err.error || 'Failed to kill subagent')
      }

      console.log('Killing subagent:', sessionId)
      return true
    } catch (error) {
      console.error('Failed to kill subagent:', error)
      return false
    }
  }

  /**
   * Send steering message to a subagent
   */
  static async steerSubagent(sessionId: string, message: string): Promise<boolean> {
    try {
      const result = await fetch('/api/subagents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'steer',
          target: sessionId,
          message,
        }),
      })

      if (!result.ok) {
        const err = await result.json()
        throw new Error(err.error || 'Failed to steer subagent')
      }

      console.log('Steering subagent:', sessionId, 'message:', message)
      return true
    } catch (error) {
      console.error('Failed to steer subagent:', error)
      return false
    }
  }

  /**
   * Map our 5-layer escalation structure to OpenClaw agent configurations
   */
  static getAgentConfig(teamMemberName: string) {
    const agentConfigs = {
      'L5: Editor': {
        model: 'anthropic/claude-opus-20240229',
        thinking: 'high',
        capabilities: ['strategic-thinking', 'emotional-intelligence', 'life-insights', 'final-editing']
      },
      'L4: Writer': {
        model: 'anthropic/claude-sonnet-4-20250514',
        thinking: 'high',
        capabilities: ['logical-composition', 'business-writing', 'para-organization', 'program-design']
      },
      'L3: Secretary': {
        model: 'glm-4',
        thinking: 'medium',
        capabilities: ['calendar-integration', 'gmail-operations', 'morning-briefing', 'schedule-management']
      },
      'L2: Gatekeeper': {
        model: 'deepseek/deepseek-chat',
        thinking: 'low',
        capabilities: ['daily-chat', 'task-classification', 'email-summarization', 'content-structuring']
      },
      'L1: Engineer': {
        model: 'anthropic/claude-code',
        thinking: 'minimal',
        capabilities: ['file-organization', 'script-execution', 'api-verification', 'system-operations']
      }
    }

    return agentConfigs[teamMemberName as keyof typeof agentConfigs] || agentConfigs['L5: Editor']
  }
}

// Export types and utilities for use in components
export { OpenClawTeamBridge as TeamBridge }
