import React from 'react'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { VoteRecord } from '../lib/supabase'

interface VoteResultsProps {
  voteRecords: VoteRecord[]
  isLoading?: boolean
}

export const VoteResults: React.FC<VoteResultsProps> = ({ voteRecords, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-bold text-white">实时投票结果</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-2 bg-gray-700 rounded w-full"></div>
                </div>
                <div className="h-6 bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Award className="w-6 h-6 text-amber-500" />
      default:
        return (
          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-gray-200">
            {rank}
          </div>
        )
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
      default:
        return 'bg-gray-700 text-gray-200'
    }
  }

  const totalVotes = voteRecords.reduce((sum, record) => sum + record.vote_count, 0)

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-bold text-white">实时投票结果</h2>
        </div>
        <div className="text-sm text-gray-300">
          总票数: <span className="font-semibold text-primary-400">{totalVotes}</span>
        </div>
      </div>
      
      {voteRecords.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">暂无投票数据</p>
        </div>
      ) : (
        <div className="space-y-4">
          {voteRecords.map((record, index) => {
            const rank = index + 1
            const percentage = totalVotes > 0 ? (record.vote_count / totalVotes) * 100 : 0
            
            return (
              <div
                key={record.team_id}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-300
                  ${rank <= 3 
                    ? 'border-primary-500/30 bg-primary-900/20' 
                    : 'border-gray-600 bg-gray-800'
                  }
                `}
              >
                {/* 排名徽章 */}
                <div className={`
                  absolute -top-2 -left-2 px-3 py-1 rounded-full text-xs font-bold shadow-lg
                  ${getRankBadgeColor(rank)}
                `}>
                  #{rank}
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* 排名图标 */}
                  <div className="flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>
                  
                  {/* 队伍信息 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {record.teams?.name || `队伍 ${record.team_id}`}
                    </h3>
                    
                    {/* 进度条 */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-300">{record.vote_count} 票</span>
                        <span className="text-gray-300">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`
                            h-2 rounded-full transition-all duration-500
                            ${rank === 1 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                              : rank === 2
                              ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                              : rank === 3
                              ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                              : 'bg-gradient-to-r from-primary-400 to-primary-500'
                            }
                          `}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 票数显示 */}
                  <div className="flex-shrink-0 text-right">
                    <div className={`
                      text-2xl font-bold
                      ${rank === 1 ? 'text-yellow-400' : 
                        rank === 2 ? 'text-gray-300' : 
                        rank === 3 ? 'text-amber-400' : 'text-primary-400'}
                    `}>
                      {record.vote_count}
                    </div>
                    <div className="text-xs text-gray-400">票</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* 实时更新提示 */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          <span>数据实时更新中</span>
        </div>
      </div>
    </div>
  )
}