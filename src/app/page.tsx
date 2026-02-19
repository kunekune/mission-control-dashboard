'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/ui/Sidebar'
import { MetricsBar } from '@/components/dashboard/MetricsBar'
import { KanbanBoard } from '@/components/dashboard/KanbanBoard'
import { ContentPipelineBoard } from '@/components/content/ContentPipelineBoard'
import { CalendarBoard } from '@/components/calendar/CalendarBoard'
import { MemoryBoard } from '@/components/memory/MemoryBoard'
import { TeamBoard } from '@/components/team/TeamBoard'

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('tasks')

  const renderContent = () => {
    switch (activeSection) {
      case 'tasks':
        return <KanbanBoard />
      case 'content':
        return <ContentPipelineBoard />
      case 'calendar':
        return <CalendarBoard />
      case 'memory':
        return <MemoryBoard />
      case 'team':
        return <TeamBoard />
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <h2 className="text-2xl font-bold mb-4 capitalize">
                {activeSection}
              </h2>
              <p>This section is coming soon...</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-mission-dark">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Metrics Bar - Only show for tasks */}
        {activeSection === 'tasks' && <MetricsBar />}
        
        {/* Content Area */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}