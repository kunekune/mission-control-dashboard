'use client'

import React, { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { MemorySearch } from './MemorySearch'
import { MemoryDocumentList } from './MemoryDocumentList'
import { MemoryStats } from './MemoryStats'

export const MemoryBoard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // Fetch memory documents based on current filters
  const documents = useQuery(
    searchQuery 
      ? api.memory.searchMemoryDocuments 
      : api.memory.getMemoryDocuments, 
    searchQuery 
      ? {
          searchQuery,
          category: selectedCategory === 'all' ? undefined : selectedCategory as any,
          limit: 50
        }
      : {
          category: selectedCategory === 'all' ? undefined : selectedCategory as any,
          limit: 50
        }
  )
  
  const stats = useQuery(api.memory.getMemoryStats)
  const recentDocs = useQuery(api.memory.getRecentDocuments, { limit: 5 })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSearchQuery('') // Reset search when changing category
  }

  const handleAddDocument = () => {
    // TODO: Open document creation modal
    console.log('Add new memory document')
  }

  if (!documents || !stats || !recentDocs) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-6 w-64"></div>
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="col-span-1 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-700 rounded"></div>
              ))}
            </div>
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
          <h1 className="text-2xl font-bold text-white">Memory</h1>
          <p className="text-gray-400 text-sm">
            {stats.total} documents • {stats.totalWordCount.toLocaleString()} words
          </p>
        </div>
        
        <button 
          onClick={handleAddDocument}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Document</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="col-span-3 space-y-6">
          {/* Search Component */}
          <MemorySearch 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            stats={stats}
          />

          {/* Document List */}
          <MemoryDocumentList 
            documents={documents}
            isSearchMode={searchQuery.length > 0}
            searchQuery={searchQuery}
          />
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          <MemoryStats 
            stats={stats}
            recentDocuments={recentDocs}
          />
        </div>
      </div>
    </div>
  )
}