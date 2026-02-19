'use client'

import React from 'react'
import { Search, Filter } from 'lucide-react'

interface MemorySearchProps {
  searchQuery: string
  selectedCategory: string
  onSearch: (query: string) => void
  onCategoryChange: (category: string) => void
  stats: {
    total: number
    thisMonth: number
    thisWeek: number
    byCategory: {
      personal: number
      project: number
      learning: number
      reference: number
      archived: number
    }
    totalWordCount: number
  }
}

const categories = [
  { id: 'all', label: 'All Documents', count: 0 },
  { id: 'personal', label: 'Personal', count: 0 },
  { id: 'project', label: 'Projects', count: 0 },
  { id: 'learning', label: 'Learning', count: 0 },
  { id: 'reference', label: 'Reference', count: 0 },
  { id: 'archived', label: 'Archived', count: 0 },
]

export const MemorySearch: React.FC<MemorySearchProps> = ({
  searchQuery,
  selectedCategory,
  onSearch,
  onCategoryChange,
  stats
}) => {
  // Update category counts
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: cat.id === 'all' ? stats.total : stats.byCategory[cat.id as keyof typeof stats.byCategory] || 0
  }))

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search through all your memories..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">⌘</kbd>
            <kbd className="bg-gray-700 px-2 py-1 rounded text-xs">K</kbd>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {categoriesWithCounts.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{category.label}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="flex items-center justify-between py-2 border-b border-gray-800">
          <div className="text-sm text-gray-400">
            Searching for <span className="text-white font-medium">"{searchQuery}"</span>
            {selectedCategory !== 'all' && (
              <span> in <span className="text-blue-400 capitalize">{selectedCategory}</span></span>
            )}
          </div>
          <button 
            onClick={() => onSearch('')}
            className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}