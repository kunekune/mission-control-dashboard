'use client'

import React from 'react'
import { formatDistanceToNow, format } from 'date-fns'

interface CalendarUpcomingProps {
  events: Array<{
    _id: string
    title: string
    description?: string
    eventType: 'cron' | 'task' | 'meeting' | 'deadline'
    scheduledAt: number
    duration?: number
    priority: 'low' | 'medium' | 'high' | 'urgent'
    color?: string
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
    assignee?: {
      name: string
      avatar?: string
    }
    relatedTask?: any
  }>
  metrics: {
    thisWeek: number
    overdue: number
    total: number
    byType: {
      cron: number
      task: number
      meeting: number
      deadline: number
    }
  }
}

const upcomingTasks = [
  { 
    name: 'mission control check', 
    time: 'in 13 min',
    type: 'cron',
    color: 'text-blue-400'
  },
  { 
    name: 'competitor youtube scan', 
    time: 'in 1 hour',
    type: 'task',
    color: 'text-red-400'
  },
  { 
    name: 'ai scarcity research', 
    time: 'in 30 min',
    type: 'research',
    color: 'text-purple-400'
  },
  { 
    name: 'morning brief', 
    time: 'in 3 hours',
    type: 'brief',
    color: 'text-yellow-400'
  },
  { 
    name: 'newsletter reminder', 
    time: 'in 6 hours',
    type: 'reminder',
    color: 'text-green-400'
  },
]

export const CalendarUpcoming: React.FC<CalendarUpcomingProps> = ({
  events,
  metrics
}) => {
  return (
    <div className="space-y-6">
      {/* Next Up Section */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-300">Next Up</h3>
        </div>
        
        <div className="space-y-3">
          {upcomingTasks.map((task, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div>
                <div className={`font-medium text-sm ${task.color}`}>
                  {task.name}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {task.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-4">This Week</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {metrics.thisWeek}
            </div>
            <div className="text-xs text-gray-400">
              Scheduled
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {metrics.overdue}
            </div>
            <div className="text-xs text-gray-400">
              Overdue
            </div>
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-4">Event Types</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300">Cron Jobs</span>
            </div>
            <span className="text-gray-400">{metrics.byType.cron}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Tasks</span>
            </div>
            <span className="text-gray-400">{metrics.byType.task}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Meetings</span>
            </div>
            <span className="text-gray-400">{metrics.byType.meeting}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">Deadlines</span>
            </div>
            <span className="text-gray-400">{metrics.byType.deadline}</span>
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="space-y-3">
        <div className="relative">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full bg-gray-800 text-white text-sm pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
          <span>Pause</span>
        </button>

        <button className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
          <span>Ping Henry</span>
        </button>
      </div>
    </div>
  )
}