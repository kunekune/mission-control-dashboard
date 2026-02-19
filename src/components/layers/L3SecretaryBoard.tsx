'use client'

import React from 'react'
import { Calendar, Mail, Clock, User } from 'lucide-react'
import { CalendarBoard } from '@/components/calendar/CalendarBoard'

export const L3SecretaryBoard: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-600/20 rounded-xl">
            <Calendar className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-400">L3: Secretary</h1>
            <p className="text-gray-400">秘書 (実務と実行) - GLM-4.7</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">$0.04</div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">97%</div>
            <div className="text-xs text-gray-500">success rate</div>
          </div>
        </div>
      </div>

      {/* Calendar Integration */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Calendar & Schedule Management</h2>
        <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-6 mb-6">
          <p className="text-green-300 mb-4">
            既存のCalendarシステムがここに統合されます。
            日常業務の実行とスケジュール管理を担当します。
          </p>
        </div>
        
        {/* Existing Calendar Board */}
        <CalendarBoard />
      </div>
    </div>
  )
}