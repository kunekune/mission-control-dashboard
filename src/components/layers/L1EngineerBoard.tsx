'use client'

import React from 'react'
import { Command, Folder, Play, Shield, Database } from 'lucide-react'
import { MemoryBoard } from '@/components/memory/MemoryBoard'

export const L1EngineerBoard: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-600/20 rounded-xl">
            <Command className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-red-400">L1: Engineer</h1>
            <p className="text-gray-400">工兵 (システム操作) - Claude Code</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">$0.01</div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-xs text-gray-500">success rate</div>
          </div>
        </div>
      </div>

      {/* System Operations */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">System Operations & Memory Management</h2>
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-6 mb-6">
          <p className="text-red-300 mb-4">
            既存のMemoryシステムがここに統合されます。
            システムレベルの操作とファイル管理を担当します。
          </p>
        </div>
        
        {/* System Capabilities */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="mission-card p-4 text-center">
            <Folder className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-red-400">ファイル整理</div>
            <div className="text-xs text-gray-500">システムファイル管理</div>
          </div>
          
          <div className="mission-card p-4 text-center">
            <Play className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-red-400">スクリプト実行</div>
            <div className="text-xs text-gray-500">自動化タスク</div>
          </div>
          
          <div className="mission-card p-4 text-center">
            <Shield className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-red-400">API検証</div>
            <div className="text-xs text-gray-500">セキュリティチェック</div>
          </div>
          
          <div className="mission-card p-4 text-center">
            <Database className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-sm font-medium text-red-400">システム操作</div>
            <div className="text-xs text-gray-500">低レベル制御</div>
          </div>
        </div>
        
        {/* Memory System Integration */}
        <MemoryBoard />
      </div>
    </div>
  )
}