'use client'

import React from 'react'
import { 
  Users, 
  Activity, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap
} from 'lucide-react'

interface TeamMetricsProps {
  metrics: {
    totalAgents: number
    activeAgents: number
    sessionsToday: number
    sessionsThisWeek: number
    activeSessions: number
    completedSessions: number
    totalCost: number
    todayCost: number
    averageSessionTime: number
    successRate: number
  }
}

export const TeamMetrics: React.FC<TeamMetricsProps> = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Active Agents',
      value: `${metrics.activeAgents}/${metrics.totalAgents}`,
      icon: Users,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      change: '+2 this week'
    },
    {
      title: 'Sessions Today',
      value: metrics.sessionsToday.toString(),
      icon: Activity,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      change: `${metrics.sessionsThisWeek} this week`
    },
    {
      title: 'Running Now',
      value: metrics.activeSessions.toString(),
      icon: Zap,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      change: 'Live sessions'
    },
    {
      title: "Today's Cost",
      value: `$${metrics.todayCost.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      change: `$${metrics.totalCost.toFixed(2)} total`
    },
    {
      title: 'Avg Session',
      value: `${metrics.averageSessionTime}min`,
      icon: Clock,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
      change: 'Per session'
    },
    {
      title: 'Success Rate',
      value: `${metrics.successRate}%`,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      change: `${metrics.completedSessions} completed`
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Team Performance</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live monitoring</span>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-4">
        {metricCards.map((metric, index) => {
          const IconComponent = metric.icon
          
          return (
            <div
              key={metric.title}
              className="mission-card p-4 hover:border-gray-600 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <IconComponent className={`w-4 h-4 ${metric.color}`} />
                </div>
                
                {index < 2 && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400">+12%</span>
                  </div>
                )}
              </div>

              <div className="mb-1">
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {metric.title}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                {metric.change}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Quick Status Indicators */}
      <div className="mt-4 flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-400">All systems operational</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400">{metrics.activeSessions} agents working</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-400">Cost optimization active</span>
        </div>
        
        {metrics.todayCost > 5 && (
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400">High usage today</span>
          </div>
        )}
      </div>
    </div>
  )
}