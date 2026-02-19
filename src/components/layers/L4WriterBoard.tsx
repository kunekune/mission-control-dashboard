'use client'

import React from 'react'
import { PenTool, FileText, Mail, Folder, Code } from 'lucide-react'

export const L4WriterBoard: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600/20 rounded-xl">
            <PenTool className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-400">L4: Writer</h1>
            <p className="text-gray-400">執筆官 (論理と構成) - Sonnet 4</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">$0.12</div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">99%</div>
            <div className="text-xs text-gray-500">success rate</div>
          </div>
        </div>
      </div>

      {/* Content Pipeline Integration */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Content Pipeline</h2>
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-6">
          <p className="text-blue-300 mb-4">
            既存のContent Pipelineシステムがここに統合されます。
            論理的構成と高品質な執筆を担当します。
          </p>
          <div className="flex space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              記事初稿作成
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              PARA構成整理
            </button>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="mission-card p-4 text-center">
          <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-blue-400">記事初稿作成</div>
          <div className="text-xs text-gray-500">構造化された執筆</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-blue-400">ビジネスメール</div>
          <div className="text-xs text-gray-500">高度な文書作成</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <Folder className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-blue-400">PARA構成</div>
          <div className="text-xs text-gray-500">情報整理システム</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <Code className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-blue-400">プログラム設計</div>
          <div className="text-xs text-gray-500">システム設計書</div>
        </div>
      </div>
    </div>
  )
}