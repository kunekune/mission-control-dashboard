'use client'

import React from 'react'
import { ArrowDown, ArrowRight } from 'lucide-react'

interface DISTILLProcessProps {
  isVisible: boolean
}

export const DISTILLProcess: React.FC<DISTILLProcessProps> = ({ isVisible }) => {
  if (!isVisible) return null

  const distillSteps = [
    {
      step: 'Dump',
      layer: 'L2 (DeepSeek)',
      description: 'Discordメモから生の情報をどばっと集める',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      step: 'Identify',
      layer: 'L4 (Sonnet)',
      description: 'そのメモから「今日の核心」と「感情の論点」を抽出',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      step: 'Integrate',
      layer: 'L5 (Opus)',
      description: 'Opus召喚。構造に価値観を注入して執筆',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    {
      step: 'Layout',
      layer: 'L3 (GLM)',
      description: '完成した日記をObsidian Daily Noteに書き込み',
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
  ]

  return (
    <div className="mission-card p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <ArrowDown className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-bold text-white">DISTILL Process</h3>
        <div className="text-sm text-purple-400">思考の蒸留ルート</div>
      </div>

      <p className="text-gray-400 text-sm mb-6">
        日記や重要アウトプット生成時に必須の4段階プロセス
      </p>

      <div className="space-y-4">
        {distillSteps.map((step, index) => (
          <div key={index}>
            <div className="flex items-start space-x-4">
              {/* Step Indicator */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${step.bg} ${step.color} flex items-center justify-center font-bold text-sm`}>
                {index + 1}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className={`font-bold ${step.color}`}>{step.step}</h4>
                  <div className="text-sm text-gray-400">
                    {step.layer}
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Arrow to next step */}
            {index < distillSteps.length - 1 && (
              <div className="flex justify-center my-3">
                <ArrowDown className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Warning Box */}
      <div className="mt-6 p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-red-400 font-medium text-sm">重要</span>
        </div>
        <p className="text-red-300 text-sm">
          L5 (Opus) 以外に「日記の仕上げ」や「重要判断」をさせるな。
          下位モデルは素材提供に徹せよ。
        </p>
      </div>
    </div>
  )
}