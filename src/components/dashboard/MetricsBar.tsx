'use client'

import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'

export const MetricsBar: React.FC = () => {
  const metrics = useQuery(api.tasks.getDashboardMetrics)

  if (!metrics) {
    return (
      <div className="flex items-center space-x-8 py-6 px-6 border-b border-gray-800">
        <div className="animate-pulse flex space-x-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="h-8 bg-gray-700 rounded w-12 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-12 py-6 px-6 border-b border-gray-800 bg-gray-900/50">
      {/* This Week */}
      <div className="flex flex-col">
        <div className="text-2xl font-bold text-green-400">
          {metrics.thisWeek}
        </div>
        <div className="text-sm text-gray-400">
          This week
        </div>
      </div>

      {/* In Progress */}
      <div className="flex flex-col">
        <div className="text-2xl font-bold text-blue-400">
          {metrics.inProgress}
        </div>
        <div className="text-sm text-gray-400">
          In progress
        </div>
      </div>

      {/* Total Tasks */}
      <div className="flex flex-col">
        <div className="text-2xl font-bold text-white">
          {metrics.total}
        </div>
        <div className="text-sm text-gray-400">
          Total
        </div>
      </div>

      {/* Completion Percentage */}
      <div className="flex flex-col">
        <div className="text-2xl font-bold text-yellow-400">
          {metrics.completionPercentage}%
        </div>
        <div className="text-sm text-gray-400">
          Completion
        </div>
      </div>

      {/* Add Task Button */}
      <div className="ml-auto">
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New task</span>
        </button>
      </div>

      {/* User Avatars */}
      <div className="flex items-center space-x-3">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
            A
          </div>
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
            H
          </div>
        </div>
        
        <select className="bg-gray-800 text-gray-300 text-sm border border-gray-700 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All projects</option>
          <option value="openclaw">OpenClaw</option>
          <option value="mission-control">Mission Control</option>
        </select>
      </div>
    </div>
  )
}