'use client'

import React from 'react'
import { ContentCard } from './ContentCard'
import { Plus, MoreHorizontal } from 'lucide-react'

interface ContentColumnProps {
  title: string
  stage: 'ideas' | 'scripting' | 'thumbnail' | 'filming' | 'editing' | 'published'
  icon: string
  color: string
  count: number
  content: Array<{
    _id: string
    title: string
    description?: string
    contentType: 'video' | 'blog' | 'podcast' | 'social'
    script?: string
    notes?: string
    attachments?: string[]
    dueDate?: number
    tags?: string[]
    estimatedHours?: number
    assignee?: {
      name: string
      avatar?: string
    }
    project?: {
      name: string
      color: string
    }
    createdAt: number
    updatedAt: number
  }>
  onAddContent?: (stage: string) => void
}

export const ContentColumn: React.FC<ContentColumnProps> = ({
  title,
  stage,
  icon,
  color,
  count,
  content,
  onAddContent
}) => {
  return (
    <div className="flex-1 min-w-80">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{icon}</span>
          <h2 className={`font-medium ${color}`}>
            {title}
          </h2>
          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onAddContent?.(stage)}
            className="p-1 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Column Content */}
      <div className="mission-column p-3 min-h-96">
        {/* Content Items */}
        <div className="space-y-3">
          {content.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="text-4xl mb-2">{icon}</div>
              <p className="text-sm">No items</p>
              <button
                onClick={() => onAddContent?.(stage)}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Add content
              </button>
            </div>
          ) : (
            content.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))
          )}
        </div>

        {/* Add Content Button (when items exist) */}
        {content.length > 0 && (
          <button
            onClick={() => onAddContent?.(stage)}
            className="w-full mt-3 p-3 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg text-gray-400 hover:text-gray-300 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add content</span>
          </button>
        )}
      </div>
    </div>
  )
}