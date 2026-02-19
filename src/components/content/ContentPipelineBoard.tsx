'use client'

import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { ContentColumn } from './ContentColumn'

const pipelineStages = [
  { id: 'ideas', title: 'Ideas', icon: '💡', color: 'text-yellow-400' },
  { id: 'scripting', title: 'Scripting', icon: '📝', color: 'text-blue-400' },
  { id: 'thumbnail', title: 'Thumbnail', icon: '🖼️', color: 'text-purple-400' },
  { id: 'filming', title: 'Filming', icon: '🎬', color: 'text-red-400' },
  { id: 'editing', title: 'Editing', icon: '✂️', color: 'text-orange-400' },
  { id: 'published', title: 'Published', icon: '🎉', color: 'text-green-400' },
]

export const ContentPipelineBoard: React.FC = () => {
  const content = useQuery(api.content.getContent)
  const metrics = useQuery(api.content.getContentMetrics)

  const handleAddContent = (stage: string) => {
    // TODO: Open content creation modal
    console.log('Add content to', stage)
  }

  if (!content || !metrics) {
    return (
      <div className="flex-1 p-6">
        <div className="flex space-x-4 overflow-x-auto">
          {pipelineStages.map((stage) => (
            <div key={stage.id} className="flex-1 min-w-80 animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="mission-column p-3 h-96">
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Group content by stage
  const contentByStage = content.reduce((acc, item) => {
    if (!acc[item.stage]) {
      acc[item.stage] = []
    }
    acc[item.stage].push(item)
    return acc
  }, {} as Record<string, typeof content>)

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Pipeline</h1>
          <p className="text-gray-400 text-sm">Ideas → Scripts → Thumbnails → Published</p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Content</span>
        </button>
      </div>

      {/* Pipeline Board */}
      <div className="flex space-x-4 overflow-x-auto pb-6">
        {pipelineStages.map((stage) => {
          const stageContent = contentByStage[stage.id] || []
          const count = metrics.byStage[stage.id as keyof typeof metrics.byStage] || 0
          
          return (
            <ContentColumn
              key={stage.id}
              title={stage.title}
              stage={stage.id as any}
              icon={stage.icon}
              color={stage.color}
              count={count}
              content={stageContent}
              onAddContent={handleAddContent}
            />
          )
        })}
      </div>
    </div>
  )
}