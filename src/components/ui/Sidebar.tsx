'use client'

import React from 'react'
import { 
  CheckSquare, 
  FileText, 
  Users, 
  Calendar, 
  Folder, 
  Brain, 
  Book, 
  User, 
  Building,
  UserCheck,
  Command,
  Crown
} from 'lucide-react'

interface SidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

const navigationItems = [
  // L5: Editor - 編集長 (魂と戦略)
  { 
    id: 'l5-editor', 
    label: 'L5: Editor', 
    subtitle: '編集長 (魂と戦略)',
    icon: Crown, 
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    features: ['ブログ最終仕上げ', '人生相談', '複雑な感情の機微', '日記の洞察昇華']
  },
  
  // L4: Writer - 執筆官 (論理と構成)
  { 
    id: 'l4-writer', 
    label: 'L4: Writer', 
    subtitle: '執筆官 (論理と構成)',
    icon: FileText, 
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    features: ['記事初稿作成', '高度ビジネスメール', 'PARA構成整理', 'プログラム設計']
  },
  
  // L3: Secretary - 秘書 (実務と実行)
  { 
    id: 'l3-secretary', 
    label: 'L3: Secretary', 
    subtitle: '秘書 (実務と実行)',
    icon: Calendar, 
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    features: ['カレンダー連携', 'Gmail操作', '朝のブリーフィング', 'スケジュール調整']
  },
  
  // L2: Gatekeeper - 門番 (整理と速度)
  { 
    id: 'l2-gatekeeper', 
    label: 'L2: Gatekeeper', 
    subtitle: '門番 (整理と速度)',
    icon: CheckSquare, 
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    features: ['日常チャット', 'タスク一次分類', '大量メール要約', '日記素材構造化']
  },
  
  // L1: Engineer - 工兵 (システム操作)
  { 
    id: 'l1-engineer', 
    label: 'L1: Engineer', 
    subtitle: '工兵 (システム操作)',
    icon: Command, 
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    features: ['ファイル整理', 'スクリプト実行', 'API検証', 'システム操作']
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection = 'l2-gatekeeper', // デフォルトをL2に変更
  onSectionChange 
}) => {
  return (
    <div className="mission-sidebar w-80 h-screen fixed left-0 top-0 z-10 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Mission Control</h1>
            <p className="text-xs text-gray-400">5段階エスカレーション構造</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-3">
        {navigationItems.map((item) => {
          const isActive = activeSection === item.id
          const IconComponent = item.icon
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange?.(item.id)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                isActive
                  ? `${item.bg} ${item.color} border border-current/30 shadow-lg`
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${isActive ? item.bg : 'bg-gray-800'}`}>
                  <IconComponent className={`w-4 h-4 ${isActive ? item.color : 'text-gray-400'}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1">
                    {item.label}
                  </div>
                  <div className="text-xs opacity-75 mb-2">
                    {item.subtitle}
                  </div>
                  
                  {/* Features list - only show when active */}
                  {isActive && item.features && (
                    <div className="space-y-1">
                      {item.features.map((feature, index) => (
                        <div key={index} className="text-xs opacity-60 flex items-center space-x-1">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* DISTILL Process Quick Reference */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 mb-2 font-medium">DISTILL Process</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div>1. Dump (L2) → 情報収集</div>
          <div>2. Identify (L4) → 構造分析</div>
          <div>3. Integrate (L5) → 価値観注入</div>
          <div>4. Layout (L3) → 最終配置</div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          OpenClaw Constitutional Hierarchy
          <br />
          v2.0.0 - 5-Layer Architecture
        </div>
      </div>
    </div>
  )
}