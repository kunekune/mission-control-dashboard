'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Calendar, User, Tag, Clock } from 'lucide-react'

interface TaskCardProps {
  task: {
    _id: string
    title: string
    description?: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
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

const priorityColors = {
  urgent: 'border-red-500 bg-red-500/10',
  high: 'border-red-400 bg-red-400/10',
  medium: 'border-yellow-400 bg-yellow-400/10',
  low: 'border-green-400 bg-green-400/10',
}

const priorityDots = {
  urgent: 'bg-red-500',
  high: 'bg-red-400',
  medium: 'bg-yellow-400',
  low: 'bg-green-400',
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const timeAgo = formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })

  return (
    <div className={`mission-card p-4 mb-3 ${priorityColors[task.priority]}`}>
      {/* Priority indicator and project */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`} />
          {task.project && (
            <div 
              className="text-xs px-2 py-1 rounded text-white font-medium"
              style={{ backgroundColor: task.project.color }}
            >
              {task.project.name}
            </div>
          )}
        </div>
        
        {task.estimatedHours && (
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{task.estimatedHours}h</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-white font-medium mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
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
          {task.assignee && (
            <div className="flex items-center space-x-1">
              {task.assignee.avatar ? (
                <img
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white">
                  {task.assignee.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{task.assignee.name}</span>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
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