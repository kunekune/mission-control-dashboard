'use client'

import React from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'

interface CalendarWeekViewProps {
  events: Array<{
    _id: string
    title: string
    description?: string
    eventType: 'cron' | 'task' | 'meeting' | 'deadline'
    scheduledAt: number
    duration?: number
    priority: 'low' | 'medium' | 'high' | 'urgent'
    color?: string
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
    assignee?: {
      name: string
      avatar?: string
    }
    relatedTask?: any
  }>
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

const eventTypeColors = {
  cron: 'bg-blue-500',
  task: 'bg-green-500', 
  meeting: 'bg-yellow-500',
  deadline: 'bg-red-500',
}

const eventTypeLabels = {
  cron: 'ai scarcity research',
  task: 'morning brief',
  meeting: 'competitor youtube scan',
  deadline: 'newsletter reminder',
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  events,
  selectedDate,
  onDateSelect
}) => {
  const weekStart = startOfWeek(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Mock events for demonstration (matching the image)
  const mockEvents = {
    0: [ // Sunday
      { type: 'cron', time: '5:00 AM', color: 'bg-purple-500', label: 'ai scarcity research' },
      { type: 'task', time: '8:00 AM', color: 'bg-yellow-500', label: 'morning brief' },
      { type: 'deadline', time: '9:00 AM', color: 'bg-red-500', label: 'competitor youtube scan' },
    ],
    1: [ // Monday
      { type: 'cron', time: '5:00 AM', color: 'bg-purple-500', label: 'ai scarcity research' },
      { type: 'task', time: '8:00 AM', color: 'bg-yellow-500', label: 'morning brief' },
      { type: 'deadline', time: '9:00 AM', color: 'bg-red-500', label: 'competitor youtube scan' },
    ],
    2: [ // Tuesday
      { type: 'cron', time: '5:00 AM', color: 'bg-purple-500', label: 'ai scarcity research' },
      { type: 'task', time: '8:00 AM', color: 'bg-yellow-500', label: 'morning brief' },
      { type: 'meeting', time: '2:00 PM', color: 'bg-green-500', label: 'newsletter reminder' },
      { type: 'deadline', time: '10:00 AM', color: 'bg-red-500', label: 'competitor youtube scan' },
    ],
    3: [ // Wednesday - Today
      { type: 'cron', time: '5:00 AM', color: 'bg-purple-500', label: 'ai scarcity research' },
      { type: 'task', time: '8:00 AM', color: 'bg-yellow-500', label: 'morning brief' },
      { type: 'deadline', time: '9:00 AM', color: 'bg-red-500', label: 'competitor youtube scan' },
    ],
    4: [ // Thursday
      { type: 'cron', time: '5:00 AM', color: 'bg-purple-500', label: 'ai scarcity research' },
      { type: 'task', time: '8:00 AM', color: 'bg-yellow-500', label: 'morning brief' },
      { type: 'deadline', time: '9:00 AM', color: 'bg-red-500', label: 'competitor youtube scan' },
    ],
    5: [ // Friday
      { type: 'cron', time: '5:00 AM', color: 'bg-purple-500', label: 'ai scarcity research' },
      { type: 'task', time: '8:00 AM', color: 'bg-yellow-500', label: 'morning brief' },
      { type: 'deadline', time: '9:00 AM', color: 'bg-red-500', label: 'competitor youtube scan' },
    ],
    6: [ // Saturday
      { type: 'cron', time: '5:00 AM', color: 'bg-purple-500', label: 'ai scarcity research' },
      { type: 'task', time: '8:00 AM', color: 'bg-yellow-500', label: 'morning brief' },
      { type: 'deadline', time: '9:00 AM', color: 'bg-red-500', label: 'competitor youtube scan' },
    ],
  }

  return (
    <div>
      {/* Week Header */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekDays.map((day, index) => (
          <div key={day.toISOString()} className="text-center">
            <div className="text-gray-400 text-sm mb-1">
              {dayLabels[day.getDay()]}
            </div>
            <div 
              className={`text-lg font-medium cursor-pointer rounded-lg p-2 transition-colors ${
                index === 3 // Wednesday (today)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => onDateSelect(day)}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, dayIndex) => {
          const dayEvents = mockEvents[dayIndex as keyof typeof mockEvents] || []
          
          return (
            <div
              key={day.toISOString()}
              className="min-h-64 border border-gray-800 rounded-lg p-2 space-y-2"
            >
              {dayEvents.map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className={`${event.color} text-white text-xs p-2 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                >
                  <div className="font-medium mb-1">{event.label}</div>
                  <div className="opacity-75">{event.time}</div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}