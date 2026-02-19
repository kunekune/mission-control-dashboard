'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Calendar, User, Tag, Clock, FileText, Video, Mic, Share2, Paperclip } from 'lucide-react'

interface ContentCardProps {
  content: {
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
  }
}

const contentTypeIcons = {
  video: Video,
  blog: FileText,
  podcast: Mic,
  social: Share2,
}

const contentTypeColors = {
  video: 'bg-red-500/10 text-red-400 border-red-500/30',
  blog: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  podcast: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  social: 'bg-green-500/10 text-green-400 border-green-500/30',
}

export const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const timeAgo = formatDistanceToNow(new Date(content.updatedAt), { addSuffix: true })
  const ContentTypeIcon = contentTypeIcons[content.contentType]

  return (
    <div className="mission-card p-4 mb-3 border border-gray-700 hover:border-gray-600 transition-colors">
      {/* Content Type and Project */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs border ${contentTypeColors[content.contentType]}`}>
            <ContentTypeIcon className="w-3 h-3" />
            <span className="capitalize">{content.contentType}</span>
          </div>
          
          {content.project && (
            <div 
              className="text-xs px-2 py-1 rounded text-white font-medium"
              style={{ backgroundColor: content.project.color }}
            >
              {content.project.name}
            </div>
          )}
        </div>
        
        {content.estimatedHours && (
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{content.estimatedHours}h</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-white font-medium mb-2 line-clamp-2">
        {content.title}
      </h3>

      {/* Description */}
      {content.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {content.description}
        </p>
      )}

      {/* Script Preview */}
      {content.script && (
        <div className="bg-gray-800/50 p-2 rounded mb-3">
          <div className="flex items-center space-x-1 mb-1">
            <FileText className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">Script</span>
          </div>
          <p className="text-gray-300 text-xs line-clamp-2">
            {content.script.substring(0, 100)}...
          </p>
        </div>
      )}

      {/* Attachments */}
      {content.attachments && content.attachments.length > 0 && (
        <div className="flex items-center space-x-1 mb-3">
          <Paperclip className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">
            {content.attachments.length} attachment{content.attachments.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {content.tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded"
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-3">
          {/* Assignee */}
          {content.assignee && (
            <div className="flex items-center space-x-1">
              {content.assignee.avatar ? (
                <img
                  src={content.assignee.avatar}
                  alt={content.assignee.name}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white">
                  {content.assignee.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{content.assignee.name}</span>
            </div>
          )}

          {/* Due Date */}
          {content.dueDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(content.dueDate), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        {/* Last updated */}
        <div className="text-gray-500">
          {timeAgo}
        </div>
      </div>
    </div>
  )
}