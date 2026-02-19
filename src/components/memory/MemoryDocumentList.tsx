'use client'

import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  FileText, 
  User, 
  Calendar, 
  Tag, 
  ExternalLink,
  Paperclip,
  Search,
  Brain,
  BookOpen,
  Archive
} from 'lucide-react'

interface MemoryDocumentListProps {
  documents: Array<{
    _id: string
    title: string
    content: string
    summary?: string
    category: 'personal' | 'project' | 'learning' | 'reference' | 'archived'
    tags?: string[]
    authorId?: string
    sourceUrl?: string
    attachments?: string[]
    relatedDocuments?: string[]
    wordCount?: number
    createdAt: number
    updatedAt: number
    author?: {
      name: string
      avatar?: string
    }
    relevanceScore?: number // Only present in search results
  }>
  isSearchMode: boolean
  searchQuery: string
}

const categoryConfig = {
  personal: { icon: User, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  project: { icon: FileText, color: 'text-green-400', bg: 'bg-green-400/10' },
  learning: { icon: BookOpen, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  reference: { icon: Brain, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  archived: { icon: Archive, color: 'text-gray-400', bg: 'bg-gray-400/10' },
}

const highlightSearchTerm = (text: string, searchQuery: string) => {
  if (!searchQuery) return text
  
  const regex = new RegExp(`(${searchQuery})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-400/30 text-yellow-300 px-1 rounded">
        {part}
      </mark>
    ) : part
  )
}

export const MemoryDocumentList: React.FC<MemoryDocumentListProps> = ({
  documents,
  isSearchMode,
  searchQuery
}) => {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <Search className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">
          {isSearchMode ? 'No results found' : 'No documents yet'}
        </h3>
        <p className="text-sm text-center max-w-md">
          {isSearchMode 
            ? `No documents match "${searchQuery}". Try adjusting your search terms or filters.`
            : 'Start building your external memory by creating your first document.'
          }
        </p>
        {!isSearchMode && (
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Create Document
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {documents.length} document{documents.length !== 1 ? 's' : ''}
          {isSearchMode && (
            <span className="ml-2 text-blue-400">
              sorted by relevance
            </span>
          )}
        </div>
        
        {!isSearchMode && (
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400">Sort by:</span>
            <select className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
            </select>
          </div>
        )}
      </div>

      {/* Document Cards */}
      <div className="space-y-3">
        {documents.map((doc) => {
          const categoryInfo = categoryConfig[doc.category]
          const CategoryIcon = categoryInfo.icon
          const timeAgo = formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })

          return (
            <div
              key={doc._id}
              className="mission-card p-6 hover:border-gray-600 transition-all cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${categoryInfo.bg}`}>
                    <CategoryIcon className={`w-4 h-4 ${categoryInfo.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1 group-hover:text-blue-300 transition-colors">
                      {isSearchMode ? highlightSearchTerm(doc.title, searchQuery) : doc.title}
                    </h3>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-400">
                      <span className={`capitalize ${categoryInfo.color}`}>
                        {doc.category}
                      </span>
                      
                      {doc.wordCount && (
                        <span>{doc.wordCount.toLocaleString()} words</span>
                      )}
                      
                      <span>{timeAgo}</span>
                      
                      {isSearchMode && doc.relevanceScore && (
                        <span className="text-yellow-400">
                          Relevance: {doc.relevanceScore}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-300" />
                </div>
              </div>

              {/* Content Preview */}
              <div className="mb-4">
                {doc.summary ? (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {isSearchMode ? highlightSearchTerm(doc.summary, searchQuery) : doc.summary}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {isSearchMode 
                      ? highlightSearchTerm(doc.content.substring(0, 200) + '...', searchQuery)
                      : doc.content.substring(0, 200) + '...'
                    }
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Tags */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <div className="flex space-x-1">
                        {doc.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded"
                          >
                            {isSearchMode ? highlightSearchTerm(tag, searchQuery) : tag}
                          </span>
                        ))}
                        {doc.tags.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{doc.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {doc.attachments && doc.attachments.length > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Paperclip className="w-3 h-3" />
                      <span>{doc.attachments.length} attachment{doc.attachments.length > 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {/* Source URL */}
                  {doc.sourceUrl && (
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <ExternalLink className="w-3 h-3" />
                      <span>Source</span>
                    </div>
                  )}
                </div>

                {/* Author */}
                {doc.author && (
                  <div className="flex items-center space-x-2">
                    {doc.author.avatar ? (
                      <img
                        src={doc.author.avatar}
                        alt={doc.author.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white">
                        {doc.author.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs text-gray-400">{doc.author.name}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Load More */}
      {documents.length >= 50 && (
        <div className="flex justify-center py-6">
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg text-sm transition-colors">
            Load More Documents
          </button>
        </div>
      )}
    </div>
  )
}