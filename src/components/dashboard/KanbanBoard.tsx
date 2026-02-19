'use client'

import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { KanbanColumn } from './KanbanColumn'

const columns = [
  { id: 'recurring', title: 'Recurring', status: 'recurring' as const },
  { id: 'backlog', title: 'Backlog', status: 'backlog' as const },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
  { id: 'review', title: 'Review', status: 'review' as const },
  { id: 'done', title: 'Done', status: 'done' as const },
]

export const KanbanBoard: React.FC = () => {
  const tasks = useQuery(api.tasks.getTasks)
  const metrics = useQuery(api.tasks.getDashboardMetrics)

  const handleAddTask = (status: string) => {
    // TODO: Open task creation modal
    console.log('Add task to', status)
  }

  if (!tasks || !metrics) {
    return (
      <div className="flex-1 p-6">
        <div className="flex space-x-6">
          {columns.map((column) => (
            <div key={column.id} className="flex-1 animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="mission-column p-3 h-96">
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = []
    }
    acc[task.status].push(task)
    return acc
  }, {} as Record<string, typeof tasks>)

  return (
    <div className="flex-1 p-6">
      <div className="flex space-x-6 min-h-screen">
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.status] || []
          const count = metrics.byStatus[column.status] || 0
          
          return (
            <KanbanColumn
              key={column.id}
              title={column.title}
              status={column.status}
              count={count}
              tasks={columnTasks}
              onAddTask={handleAddTask}
            />
          )
        })}
      </div>
    </div>
  )
}