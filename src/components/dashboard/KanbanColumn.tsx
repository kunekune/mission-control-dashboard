'use client'

import React from 'react'
import { TaskCard } from './TaskCard'
import { Plus, MoreHorizontal } from 'lucide-react'

interface KanbanColumnProps {
  title: string
  status: 'recurring' | 'backlog' | 'in_progress' | 'review' | 'done'
  count: number
  tasks: Array<{
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
  }>
  onAddTask?: (status: string) => void
}

const statusIcons = {
  recurring: '🔄',
  backlog: '📋',
  in_progress: '🔵',
  review: '👁️',
  done: '✅',
}

const statusColors = {
  recurring: 'text-purple-400',
  backlog: 'text-gray-400', 
  in_progress: 'text-blue-400',
  review: 'text-yellow-400',
  done: 'text-green-400',
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  count,
  tasks,
  onAddTask
}) => {
  return (
    <div className="flex-1 min-w-80">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{statusIcons[status]}</span>
          <h2 className={`font-medium ${statusColors[status]}`}>
            {title}
          </h2>
          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
            {count}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onAddTask?.(status)}
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
        {/* Tasks */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="text-4xl mb-2">{statusIcons[status]}</div>
              <p className="text-sm">No tasks</p>
              <button
                onClick={() => onAddTask?.(status)}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                Add a task
              </button>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))
          )}
        </div>

        {/* Add Task Button (when tasks exist) */}
        {tasks.length > 0 && (
          <button
            onClick={() => onAddTask?.(status)}
            className="w-full mt-3 p-3 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg text-gray-400 hover:text-gray-300 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add a task</span>
          </button>
        )}
      </div>
    </div>
  )
}