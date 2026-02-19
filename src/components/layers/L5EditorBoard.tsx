'use client'

import React from 'react'
import { Crown, FileText, Heart, Lightbulb, PenTool, BookOpen } from 'lucide-react'

export const L5EditorBoard: React.FC = () => {
  const editorTasks = [
    {
      id: 1,
      title: 'ブログ記事最終編集',
      description: 'Yokohama Bay記事の感情的な深みを追加し、人生の洞察に昇華',
      status: 'active',
      priority: 'high',
      type: 'blog-editing',
      emotion: '深い洞察',
      timeSpent: '45min',
      model: 'Opus 4.6'
    },
    {
      id: 2,
      title: '人生相談対応',
      description: 'ユーザーの複雑な感情状況を理解し、的確なアドバイスを提供',
      status: 'pending',
      priority: 'urgent',
      type: 'life-consultation',
      emotion: '共感と理解',
      timeSpent: '0min',
      model: 'Opus 4.6'
    },
    {
      id: 3,
      title: '日記の洞察昇華',
      description: '今日の出来事から人生の教訓を抽出し、成長の糧に変換',
      status: 'completed',
      priority: 'medium',
      type: 'journal-insights',
      emotion: '成長と学び',
      timeSpent: '32min',
      model: 'Opus 4.6'
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog-editing': return PenTool
      case 'life-consultation': return Heart
      case 'journal-insights': return Lightbulb
      default: return FileText
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-400/10'
      case 'pending': return 'text-red-400 bg-red-400/10'
      case 'completed': return 'text-green-400 bg-green-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-600/20 rounded-xl">
            <Crown className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-purple-400">L5: Editor</h1>
            <p className="text-gray-400">編集長 (魂と戦略) - Opus 4.6</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">$0.15</div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-gray-500">success rate</div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="mission-card p-6 mb-8 border-l-4 border-purple-500">
        <div className="flex items-start space-x-4">
          <BookOpen className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-purple-400 mb-2">使命</h3>
            <p className="text-gray-300 leading-relaxed">
              最高レベルの戦略的思考と感情理解を提供します。ブログの最終仕上げ、人生相談、
              複雑な感情の機微を読み取る返信、日記の「人生の洞察」への昇華を担当。
              <span className="text-purple-400 font-medium"> L5以外に「重要判断」をさせてはいけません。</span>
            </p>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Current Tasks</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {editorTasks.map((task) => {
            const TypeIcon = getTypeIcon(task.type)
            const statusClasses = getStatusColor(task.status)
            
            return (
              <div key={task.id} className="mission-card p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <TypeIcon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${statusClasses}`}>
                      {task.status}
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-gray-400">
                    <div>{task.model}</div>
                    <div>{task.timeSpent}</div>
                  </div>
                </div>

                <h3 className="text-white font-bold mb-2">{task.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{task.description}</p>

                <div className="border-t border-gray-800 pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-400">感情: {task.emotion}</span>
                    <span className="text-gray-500">優先度: {task.priority}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Capabilities */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="mission-card p-4 text-center">
          <PenTool className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-purple-400">ブログ最終仕上げ</div>
          <div className="text-xs text-gray-500">感情的な深み追加</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <Heart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-purple-400">人生相談</div>
          <div className="text-xs text-gray-500">複雑な感情理解</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <Lightbulb className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-purple-400">洞察昇華</div>
          <div className="text-xs text-gray-500">人生の教訓抽出</div>
        </div>
        
        <div className="mission-card p-4 text-center">
          <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-sm font-medium text-purple-400">戦略判断</div>
          <div className="text-xs text-gray-500">最終意思決定</div>
        </div>
      </div>

      {/* Warning */}
      <div className="mt-8 p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-red-400 font-medium text-sm">重要な制約</span>
        </div>
        <p className="text-red-300 text-sm mt-2">
          L5 (Opus) 以外に「日記の仕上げ」や「重要判断」をさせるな。
          下位モデルは素材提供に徹せよ。
        </p>
      </div>
    </div>
  )
}