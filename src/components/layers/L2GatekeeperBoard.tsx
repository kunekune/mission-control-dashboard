'use client'

import React from 'react'
import { CheckSquare, MessageCircle, Mail, FolderOpen, BarChart3 } from 'lucide-react'
import { KanbanBoard } from '@/components/dashboard/KanbanBoard'

export const L2GatekeeperBoard: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-yellow-600/20 rounded-xl">
            <CheckSquare className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">L2: Gatekeeper</h1>
            <p className="text-gray-400">門番 (整理と速度) - DeepSeek V3</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">$0.02</div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">95%</div>
            <div className="text-xs text-gray-500">success rate</div>
          </div>
        </div>
      </div>

      {/* Task Management Integration */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Task Management & Information Processing</h2>
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-6 mb-6">
          <p className="text-yellow-300 mb-4">
            既存のTask Managementシステムがここに統合されます。
            日常チャットやタスクの一次分類を高速で処理します。
          </p>
        </div>
        
        {/* Existing Kanban Board */}
        <KanbanBoard />
      </div>

      {/* Processing Capabilities */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="mission-card p-4 text-center">
          <MessageCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-yellow-400">日常チャット</div>
          <div className="text-xs text-gray-500">高速応答処理</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <CheckSquare className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-yellow-400">タスク一次分類</div>
          <div className="text-xs text-gray-500">自動カテゴリ分け</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <Mail className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-yellow-400">大量メール要約</div>
          <div className="text-xs text-gray-500">効率的な情報抽出</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <FolderOpen className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-yellow-400">日記素材構造化</div>
          <div className="text-xs text-gray-500">情報の事前整理</div>
        </div>
      </div>

      {/* Processing Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="mission-card p-4 text-center">
          <BarChart3 className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">1,247</div>
          <div className="text-xs text-gray-500">今日処理したメッセージ</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <CheckSquare className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">89</div>
          <div className="text-xs text-gray-500">分類したタスク</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <Mail className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">156</div>
          <div className="text-xs text-gray-500">要約したメール</div>
        </div>
      </div>
    </div>
  )
}