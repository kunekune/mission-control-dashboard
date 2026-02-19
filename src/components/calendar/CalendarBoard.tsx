'use client'

import React, { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { CalendarWeekView } from './CalendarWeekView'
import { CalendarUpcoming } from './CalendarUpcoming'

export const CalendarBoard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')

  // Calculate date range for current week
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))

  const events = useQuery(api.calendar.getScheduledEvents, {
    startDate: startOfWeek.getTime(),
    endDate: endOfWeek.getTime()
  })
  const metrics = useQuery(api.calendar.getCalendarMetrics)
  const cronJobs = useQuery(api.calendar.getCronJobs)

  const handleAddEvent = () => {
    // TODO: Open event creation modal
    console.log('Add new event')
  }

  if (!events || !metrics || !cronJobs) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4 w-64"></div>
          <div className="grid grid-cols-7 gap-4 mb-8">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Scheduled Tasks</h1>
          <p className="text-gray-400 text-sm">Henry's automated routines</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'week'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'month'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Today
            </button>
          </div>
          
          <button 
            onClick={handleAddEvent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Schedule Task</span>
          </button>
        </div>
      </div>

      {/* Always Running Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-medium text-gray-300">Always Running</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {cronJobs.slice(0, 3).map((job, index) => (
            <div
              key={job._id}
              className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm border border-blue-500/30"
            >
              {job.title} • every 30 min
            </div>
          ))}
        </div>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="col-span-3">
          <CalendarWeekView 
            events={events}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="col-span-1">
          <CalendarUpcoming 
            events={events}
            metrics={metrics}
          />
        </div>
      </div>
    </div>
  )
}