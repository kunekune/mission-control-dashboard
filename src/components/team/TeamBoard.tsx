'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { TeamHierarchy } from './TeamHierarchy'
import { TeamMetrics } from './TeamMetrics'
import { AgentSessionList } from './AgentSessionList'
import { DISTILLProcess } from './DISTILLProcess'
import { OpenClawTeamBridge } from './OpenClawIntegration'

export const TeamBoard: React.FC = () => {
  const teamMembers = useQuery(api.team.getTeamMembers)
  const teamMetrics = useQuery(api.team.getTeamMetrics)
  const teamHierarchy = useQuery(api.team.getTeamHierarchy)
  const agentSessions = useQuery(api.team.getAgentSessions, { limit: 10 })
  
  const initializeTeam = useMutation(api.seedTeam.initializeTeam)
  const createAgentSession = useMutation(api.team.createAgentSession)
  
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [showDISTILL, setShowDISTILL] = useState(true)
  const [spinError, setSpinError] = useState<string | null>(null)
  
  // Initialize team if empty
  useEffect(() => {
    if (teamMembers && teamMembers.length === 0) {
      initializeTeam()
        .then((result) => {
          console.log('Team initialized:', result)
        })
        .catch((error) => {
          console.error('Failed to initialize team:', error)
        })
    }
  }, [teamMembers, initializeTeam])

  const handleSpinAgent = async (agentId: string, taskTitle: string) => {
    setSpinError(null)
    try {
      // エージェント設定を取得（モデル情報など）
      const member = teamMembers?.find((m) => m._id === agentId)
      const agentConfig = member ? OpenClawTeamBridge.getAgentConfig(member.name) : undefined

      // OpenClaw APIでエージェントをスピンアップ
      await OpenClawTeamBridge.spinAgent({
        agentId,
        task: taskTitle,
        model: agentConfig?.model,
        thinking: agentConfig?.thinking,
      })

      // ConvexにもセッションをUIに反映するために記録
      await createAgentSession({
        agentId: agentId as any,
        taskTitle,
        priority: 'medium',
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to spin agent'
      console.error('Failed to spin agent:', error)
      setSpinError(message)
    }
  }

  if (!teamMembers || !teamMetrics || !teamHierarchy) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-6 w-64"></div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6">
      {/* Error Toast */}
      {spinError && (
        <div className="mb-4 flex items-center justify-between bg-red-900/80 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
          <span>{spinError}</span>
          <button onClick={() => setSpinError(null)} className="ml-4 text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">5段階エスカレーション構造</h1>
          <p className="text-gray-400 text-sm">
            OpenClaw Constitutional Hierarchy • {teamMetrics.totalAgents} レイヤー • {teamMetrics.activeAgents} アクティブ
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowDISTILL(!showDISTILL)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              showDISTILL 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            DISTILL Process
          </button>
          
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Escalate Task</span>
          </button>
          
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">
            Re-Sync Layers
          </button>
        </div>
      </div>

      {/* Team Metrics */}
      <div className="mb-8">
        <TeamMetrics metrics={teamMetrics} />
      </div>

      {/* DISTILL Process */}
      <DISTILLProcess isVisible={showDISTILL} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-5 gap-6">
        {/* Team Hierarchy - 4 columns */}
        <div className="col-span-4">
          <TeamHierarchy 
            hierarchy={teamHierarchy}
            teamMembers={teamMembers}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
            onSpinAgent={handleSpinAgent}
          />
        </div>

        {/* Activity Sidebar - 1 column */}
        <div className="col-span-1">
          <AgentSessionList 
            sessions={agentSessions || []}
            teamMembers={teamMembers}
          />
        </div>
      </div>
    </div>
  )
}