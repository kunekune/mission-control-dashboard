'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  Play, 
  Pause, 
  Settings, 
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  Activity,
  Zap
} from 'lucide-react'

interface TeamMemberCardProps {
  member: {
    _id: string
    name: string
    role: string
    aiModel: string
    hierarchyLevel: 'lead' | 'senior' | 'specialist' | 'support'
    specialties: string[]
    description?: string
    avatar?: string
    color: string
    status: 'active' | 'busy' | 'idle' | 'maintenance'
    costPerHour?: number
    totalSessions: number
    totalHours: number
    successRate: number
    activeSessions: number
    recentSessions: any[]
    lastActive: number
  }
  isSelected: boolean
  onSelect: () => void
  onSpin: (taskTitle: string) => void
}

const statusConfig = {
  active: { 
    color: 'text-green-400', 
    bg: 'bg-green-400/10', 
    dot: 'bg-green-500',
    label: 'Active'
  },
  busy: { 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-400/10', 
    dot: 'bg-yellow-500 animate-pulse',
    label: 'Busy'
  },
  idle: { 
    color: 'text-gray-400', 
    bg: 'bg-gray-400/10', 
    dot: 'bg-gray-500',
    label: 'Idle'
  },
  maintenance: { 
    color: 'text-red-400', 
    bg: 'bg-red-400/10', 
    dot: 'bg-red-500',
    label: 'Maintenance'
  }
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  isSelected,
  onSelect,
  onSpin
}) => {
  const statusInfo = statusConfig[member.status]
  const timeAgo = formatDistanceToNow(new Date(member.lastActive), { addSuffix: true })
  
  const handleSpinClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const taskTitle = prompt(`What task should ${member.name} work on?`)
    if (taskTitle) {
      onSpin(taskTitle)
    }
  }

  return (
    <div 
      className={`mission-card p-6 cursor-pointer transition-all hover:border-gray-600 ${
        isSelected ? 'border-blue-500 bg-blue-500/5' : ''
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="text-2xl p-3 rounded-lg"
            style={{ backgroundColor: `${member.color}20` }}
          >
            {member.avatar}
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-1">{member.name}</h3>
            <p className="text-sm text-gray-400 mb-1">{member.role}</p>
            <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs ${statusInfo.bg} ${statusInfo.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></div>
              <span>{statusInfo.label}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleSpinClick}
            disabled={member.status === 'maintenance'}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Spin up agent"
          >
            <Play className="w-4 h-4" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Model */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-1">AI Model</div>
        <div className="text-sm font-medium" style={{ color: member.color }}>
          {member.aiModel}
        </div>
      </div>

      {/* Description */}
      {member.description && (
        <div className="mb-4">
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
            {member.description}
          </p>
        </div>
      )}

      {/* Specialties */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">Specialties</div>
        <div className="flex flex-wrap gap-1">
          {member.specialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded"
            >
              {specialty}
            </span>
          ))}
          {member.specialties.length > 3 && (
            <span className="text-xs text-gray-400">
              +{member.specialties.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Activity className="w-3 h-3 text-gray-400" />
            <span className="text-sm font-medium text-white">{member.totalSessions}</span>
          </div>
          <div className="text-xs text-gray-400">Sessions</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            <span className="text-sm font-medium text-white">{member.successRate}%</span>
          </div>
          <div className="text-xs text-gray-400">Success</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Clock className="w-3 h-3 text-purple-400" />
            <span className="text-sm font-medium text-white">{Math.round(member.totalHours * 10) / 10}h</span>
          </div>
          <div className="text-xs text-gray-400">Hours</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <DollarSign className="w-3 h-3 text-yellow-400" />
            <span className="text-sm font-medium text-white">
              ${((member.costPerHour || 0) * member.totalHours).toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-gray-400">Cost</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Last active {timeAgo}</span>
        </div>
        
        {member.activeSessions > 0 && (
          <div className="flex items-center space-x-1 text-yellow-400">
            <Zap className="w-3 h-3" />
            <span>{member.activeSessions} running</span>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isSelected && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">Recent Activity</div>
          {member.recentSessions.length > 0 ? (
            <div className="space-y-2">
              {member.recentSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800/50 p-2 rounded">
                  <span className="text-sm text-gray-300 line-clamp-1">
                    {session.taskTitle || 'Unnamed task'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-4">
              No recent activity
            </div>
          )}
        </div>
      )}
    </div>
  )
}