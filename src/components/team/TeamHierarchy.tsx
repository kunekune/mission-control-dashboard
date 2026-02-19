'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  Crown, 
  Search, 
  Code, 
  PenTool, 
  Monitor, 
  BarChart3,
  Play,
  Pause,
  Settings,
  Activity,
  Cpu,
  DollarSign
} from 'lucide-react'

interface TeamMember {
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
  lastActiveAt?: number
  createdAt: number
  updatedAt: number
  activeSessions: number
  lastActive: number
}

interface TeamHierarchyProps {
  hierarchy: {
    lead: TeamMember[]
    senior: TeamMember[]
    specialist: TeamMember[]
    support: TeamMember[]
  }
  teamMembers: TeamMember[]
  selectedAgent: string | null
  onSelectAgent: (agentId: string | null) => void
  onSpinAgent: (agentId: string, taskTitle: string) => void
}

const getAgentIcon = (name: string) => {
  const icons = {
    'L5: Editor': Crown,
    'L4: Writer': PenTool,
    'L3: Secretary': Monitor,
    'L2: Gatekeeper': Search,
    'L1: Engineer': Code,
  }
  return icons[name as keyof typeof icons] || Crown
}

const statusConfig = {
  active: { color: 'text-green-400', bg: 'bg-green-400/10', dot: 'bg-green-500' },
  busy: { color: 'text-blue-400', bg: 'bg-blue-400/10', dot: 'bg-blue-500' },
  idle: { color: 'text-gray-400', bg: 'bg-gray-400/10', dot: 'bg-gray-500' },
  maintenance: { color: 'text-orange-400', bg: 'bg-orange-400/10', dot: 'bg-orange-500' },
}

const AgentCard: React.FC<{
  agent: TeamMember
  isSelected: boolean
  onSelect: () => void
  onSpin: (taskTitle: string) => void
}> = ({ agent, isSelected, onSelect, onSpin }) => {
  const IconComponent = getAgentIcon(agent.name)
  const statusInfo = statusConfig[agent.status]
  const lastActiveTime = formatDistanceToNow(new Date(agent.lastActive), { addSuffix: true })

  const handleSpinClick = () => {
    const taskTitle = prompt(`What task should ${agent.name} work on?`)
    if (taskTitle) {
      onSpin(taskTitle)
    }
  }

  return (
    <div 
      className={`mission-card p-6 cursor-pointer transition-all hover:border-gray-600 ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Agent Avatar */}
          <div 
            className={`p-3 rounded-xl ${statusInfo.bg}`}
            style={{ borderColor: agent.color }}
          >
            {agent.avatar ? (
              <span className="text-2xl">{agent.avatar}</span>
            ) : (
              <IconComponent className={`w-6 h-6 ${statusInfo.color}`} />
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-bold text-lg">{agent.name}</h3>
              <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
            </div>
            <p className="text-gray-400 text-sm">{agent.role}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {agent.status === 'active' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSpinClick()
              }}
              className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          
          {agent.status === 'busy' && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Model & Status */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-gray-400" />
            <span className="text-gray-300">{agent.aiModel}</span>
          </div>
          
          <div className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
            {agent.status}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {agent.description || 'No description available'}
      </p>

      {/* Specialties */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {agent.specialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded"
            >
              {specialty}
            </span>
          ))}
          {agent.specialties.length > 3 && (
            <span className="text-xs text-gray-400">
              +{agent.specialties.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div>
          <div className="text-white font-medium">{agent.totalSessions}</div>
          <div className="text-gray-500">Sessions</div>
        </div>
        <div>
          <div className="text-white font-medium">{Math.round(agent.totalHours)}h</div>
          <div className="text-gray-500">Runtime</div>
        </div>
        <div>
          <div className="text-white font-medium">{agent.successRate}%</div>
          <div className="text-gray-500">Success</div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1 text-gray-400">
          <Activity className="w-3 h-3" />
          <span>Active {lastActiveTime}</span>
        </div>
        
        {agent.costPerHour && (
          <div className="flex items-center space-x-1 text-gray-400">
            <DollarSign className="w-3 h-3" />
            <span>${agent.costPerHour}/hr</span>
          </div>
        )}
      </div>
    </div>
  )
}

export const TeamHierarchy: React.FC<TeamHierarchyProps> = ({
  hierarchy,
  teamMembers,
  selectedAgent,
  onSelectAgent,
  onSpinAgent
}) => {
  const hierarchyLevels = [
    { 
      key: 'lead', 
      title: 'L5: 編集長 (魂と戦略)', 
      members: hierarchy.lead,
      color: 'text-purple-400'
    },
    { 
      key: 'senior', 
      title: 'L4: 執筆官 (論理と構成)', 
      members: hierarchy.senior,
      color: 'text-blue-400'
    },
    { 
      key: 'specialist', 
      title: 'L3-L2: 秘書・門番 (実務と整理)', 
      members: hierarchy.specialist,
      color: 'text-green-400'
    },
    { 
      key: 'support', 
      title: 'L1: 工兵 (システム操作)', 
      members: hierarchy.support,
      color: 'text-red-400'
    },
  ]

  return (
    <div className="space-y-8">
      {hierarchyLevels.map((level) => (
        <div key={level.key}>
          <div className="flex items-center space-x-3 mb-4">
            <h2 className={`text-lg font-medium ${level.color}`}>
              {level.title}
            </h2>
            <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
              {level.members.length}
            </span>
          </div>
          
          <div className={`grid gap-4 ${
            level.key === 'lead' ? 'grid-cols-1' : 
            level.key === 'specialist' ? 'grid-cols-4' : 'grid-cols-2'
          }`}>
            {level.members.map((agent) => (
              <AgentCard
                key={agent._id}
                agent={agent}
                isSelected={selectedAgent === agent._id}
                onSelect={() => onSelectAgent(
                  selectedAgent === agent._id ? null : agent._id
                )}
                onSpin={(taskTitle) => onSpinAgent(agent._id, taskTitle)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}