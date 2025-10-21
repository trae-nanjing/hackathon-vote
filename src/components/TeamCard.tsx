import React from 'react'
import { Heart, Users, Trophy, CheckCircle } from 'lucide-react'
import { Team, VoteRecord } from '../lib/supabase'

interface TeamCardProps {
  team: Team
  voteRecord?: VoteRecord
  hasVoted: boolean
  isVotedTeam: boolean
  onVote: (teamId: string) => void
  isLoading?: boolean
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  voteRecord,
  hasVoted,
  isVotedTeam,
  onVote,
  isLoading = false
}) => {
  const voteCount = voteRecord?.vote_count || 0
  // 计算百分比需要从父组件传入总票数或在这里计算
  const percentage = 0 // 暂时设为0，需要从父组件传入计算好的百分比

  const handleVote = () => {
    if (!hasVoted && !isLoading) {
      onVote(team.id)
    }
  }

  return (
    <div className={`
      relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl
      ${isVotedTeam ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}
    `}>
      {/* 已投票标识 */}
      {isVotedTeam && (
        <div className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full p-2 shadow-lg">
          <CheckCircle className="w-5 h-5" />
        </div>
      )}
      
      <div className="p-6">
        {/* 队伍信息 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{team.description}</p>
          </div>
        </div>
        
        {/* 队伍成员 */}
        {team.members && team.members.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">队伍成员</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {team.members.map((member, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {member}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* 投票统计 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-700">得票数</span>
            </div>
            <span className="text-lg font-bold text-primary-600">{voteCount}</span>
          </div>
          
          {/* 进度条 */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-right mt-1">
            <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
          </div>
        </div>
        
        {/* 投票按钮 */}
        <button
          onClick={handleVote}
          disabled={hasVoted || isLoading}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
            ${hasVoted
              ? isVotedTeam
                ? 'bg-primary-500 text-white cursor-default'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600 text-white hover:shadow-lg active:scale-95'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>投票中...</span>
            </>
          ) : hasVoted ? (
            isVotedTeam ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>已投票</span>
              </>
            ) : (
              <span>已投过票</span>
            )
          ) : (
            <>
              <Heart className="w-5 h-5" />
              <span>投票支持</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}