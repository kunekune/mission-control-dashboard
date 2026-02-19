'use client'

import React from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Play,
  Pause,
  DollarSign,
  Activity
} from 'lucide-react'

interface AgentSession {
  _id: string
  agentId: string
  taskTitle: string
  taskDescription?: string
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedDuration?: number
  estimatedCost?: number
  actualCost?: number
  duration?: number
  result?: string
  startedAt: number
  completedAt?: number
  createdAt: number
  updatedAt: number
  agent?: {
    name: string
    role: string
    avatar?: string
    color: string
  }
}

interface TeamMember {
  _id: string
  name: string
  role: string
  avatar?: string
  color: string
  status: 'active' | 'busy' | 'idle' | 'maintenance'
}

interface AgentSessionListProps {
  sessions: AgentSession[]
  teamMembers: TeamMember[]
}

const statusConfig = {
  running: { 
    icon: Play, 
    color: 'text-blue-400', 
    bg: 'bg-blue-400/10',
    label: 'Running'
  },
  completed: { 
    icon: CheckCircle, 
    color: 'text-green-400', 
    bg: 'bg-green-400/10',
    label: 'Completed'
  },
  failed: { 
    icon: XCircle, 
    color: 'text-red-400', 
    bg: 'bg-red-400/10',
    label: 'Failed'
  },
  cancelled: { 
    icon: AlertCircle, 
    color: 'text-orange-400', 
    bg: 'bg-orange-400/10',
    label: 'Cancelled'
  },
}

const priorityConfig = {
  urgent: { color: 'text-red-400', bg: 'bg-red-400/20' },
  high: { color: 'text-orange-400', bg: 'bg-orange-400/20' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
  low: { color: 'text-gray-400', bg: 'bg-gray-400/20' },
}

export const AgentSessionList: React.FC<AgentSessionListProps> = ({
  sessions,
  teamMembers
}) => {
  const runningSessions = sessions.filter(s => s.status === 'running')
  const completedSessions = sessions.filter(s => s.status !== 'running')

  if (sessions.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent sessions</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Running Sessions */}
      {runningSessions.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h3 className="text-sm font-medium text-blue-300">Currently Running</h3>
            <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full">
              {runningSessions.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {runningSessions.map((session) => {
              const statusInfo = statusConfig[session.status]
              const priorityInfo = priorityConfig[session.priority]
              const StatusIcon = statusInfo.icon
              const runningTime = Date.now() - session.startedAt
              const runningMinutes = Math.round(runningTime / 1000 / 60)
              
              return (
                <div
                  key={session._id}
                  className="mission-card p-3 border border-blue-500/30 hover:border-blue-500/50 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${statusInfo.bg}`}>
                        <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
                      </div>
                      
                      {session.agent?.avatar && (
                        <span className="text-sm">{session.agent.avatar}</span>
                      )}
                      
                      <span className="text-sm font-medium text-white">
                        {session.agent?.name || 'Unknown Agent'}
                      </span>
                    </div>
                    
                    <div className={`px-2 py-1 rounded text-xs ${priorityInfo.bg} ${priorityInfo.color}`}>
                      {session.priority}
                    </div>
                  </div>

                  {/* Task */}
                  <h4 className="text-sm font-medium text-gray-200 mb-2 line-clamp-2">
                    {session.taskTitle}
                  </h4>

                  {/* Running Time */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Running {runningMinutes}min</span>
                    </div>
                    
                    {session.estimatedCost && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>~${session.estimatedCost.toFixed(3)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-4">Recent Sessions</h3>
        
        <div className="space-y-3">
          {completedSessions.slice(0, 10).map((session) => {
            const statusInfo = statusConfig[session.status]
            const priorityInfo = priorityConfig[session.priority]
            const StatusIcon = statusInfo.icon
            const timeAgo = formatDistanceToNow(new Date(session.completedAt || session.updatedAt), { addSuffix: true })
            
            return (
              <div
                key={session._id}
                className="mission-card p-3 hover:border-gray-600 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${statusInfo.bg}`}>
                      <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
                    </div>
                    
                    {session.agent?.avatar && (
                      <span className="text-sm">{session.agent.avatar}</span>
                    )}
                    
                    <span className="text-xs text-gray-400">
                      {session.agent?.name || 'Unknown Agent'}
                    </span>
                  </div>
                  
                  <span className="text-xs text-gray-500">{timeAgo}</span>
                </div>

                {/* Task */}
                <h4 className="text-sm text-gray-300 mb-1 line-clamp-1">
                  {session.taskTitle}
                </h4>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    {session.duration && (
                      <span>{session.duration}min</span>
                    )}
                    
                    <div className={`px-1 py-0.5 rounded text-xs ${priorityInfo.bg} ${priorityInfo.color}`}>
                      {session.priority}
                    </div>
                  </div>
                  
                  {session.actualCost && (
                    <span>${session.actualCost.toFixed(3)}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mission-card p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Session Stats</h4>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Total Today</span>
            <span className="text-white">{sessions.length}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Success Rate</span>
            <span className="text-green-400">
              {sessions.length > 0 
                ? Math.round((sessions.filter(s => s.status === 'completed').length / sessions.length) * 100)
                : 100
              }%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Total Cost</span>
            <span className="text-purple-400">
              ${sessions.reduce((sum, s) => sum + (s.actualCost || s.estimatedCost || 0), 0).toFixed(3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}