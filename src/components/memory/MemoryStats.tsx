'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  TrendingUp, 
  Calendar, 
  FileText,
  Brain,
  BookOpen,
  User,
  Archive,
  Clock
} from 'lucide-react'

interface MemoryStatsProps {
  stats: {
    total: number
    thisMonth: number
    thisWeek: number
    byCategory: {
      personal: number
      project: number
      learning: number
      reference: number
      archived: number
    }
    totalWordCount: number
  }
  recentDocuments: Array<{
    _id: string
    title: string
    content: string
    summary?: string
    category: 'personal' | 'project' | 'learning' | 'reference' | 'archived'
    tags?: string[]
    wordCount?: number
    createdAt: number
    updatedAt: number
    author?: {
      name: string
      avatar?: string
    }
  }>
}

const categoryConfig = {
  personal: { icon: User, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  project: { icon: FileText, color: 'text-green-400', bg: 'bg-green-400/10' },
  learning: { icon: BookOpen, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  reference: { icon: Brain, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  archived: { icon: Archive, color: 'text-gray-400', bg: 'bg-gray-400/10' },
}

export const MemoryStats: React.FC<MemoryStatsProps> = ({
  stats,
  recentDocuments
}) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-4">Overview</h3>
        <div className="space-y-3">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-400">
                  Total Documents
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats.thisWeek}
                </div>
                <div className="text-xs text-gray-400">
                  This Week
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Brain className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {(stats.totalWordCount / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-gray-400">
                  Total Words
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Breakdown */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-4">Categories</h3>
        <div className="space-y-3">
          {Object.entries(stats.byCategory).map(([category, count]) => {
            const config = categoryConfig[category as keyof typeof categoryConfig]
            const IconComponent = config.icon
            const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0
            
            return (
              <div 
                key={category}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded ${config.bg}`}>
                    <IconComponent className={`w-3 h-3 ${config.color}`} />
                  </div>
                  <span className="text-sm text-gray-300 capitalize">{category}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white">{count}</span>
                  <span className="text-xs text-gray-400">({percentage}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentDocuments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent documents</p>
            </div>
          ) : (
            recentDocuments.map((doc) => {
              const config = categoryConfig[doc.category]
              const IconComponent = config.icon
              const timeAgo = formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })
              
              return (
                <div 
                  key={doc._id}
                  className="p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-1.5 rounded ${config.bg} flex-shrink-0`}>
                      <IconComponent className={`w-3 h-3 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white line-clamp-1 mb-1">
                        {doc.title}
                      </h4>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{timeAgo}</span>
                        {doc.wordCount && (
                          <>
                            <span>•</span>
                            <span>{doc.wordCount} words</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full text-left bg-gray-800/50 hover:bg-gray-800 text-gray-300 p-3 rounded-lg text-sm transition-colors">
            📝 Create New Document
          </button>
          
          <button className="w-full text-left bg-gray-800/50 hover:bg-gray-800 text-gray-300 p-3 rounded-lg text-sm transition-colors">
            📂 Import Documents
          </button>
          
          <button className="w-full text-left bg-gray-800/50 hover:bg-gray-800 text-gray-300 p-3 rounded-lg text-sm transition-colors">
            🔍 Advanced Search
          </button>
          
          <button className="w-full text-left bg-gray-800/50 hover:bg-gray-800 text-gray-300 p-3 rounded-lg text-sm transition-colors">
            📊 Export Data
          </button>
        </div>
      </div>

      {/* Memory Health */}
      <div className="p-4 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-blue-400" />
          <h4 className="text-sm font-medium text-blue-300">Memory Health</h4>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          Your memory is growing steadily. {stats.thisMonth} documents added this month.
        </p>
        <div className="text-xs text-blue-400">
          ✨ Keep building your external brain!
        </div>
      </div>
    </div>
  )
}