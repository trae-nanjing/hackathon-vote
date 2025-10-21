import React from 'react'
import { Header } from '../components/Header'
import { TeamCard } from '../components/TeamCard'
import { VoteResults } from '../components/VoteResults'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useVoting } from '../hooks/useVoting'

export default function Home() {
  const {
    teams,
    voteRecords,
    isLoading,
    error,
    hasVoted,
    votedTeamId,
    vote,
    refreshData
  } = useVoting()

  const totalVotes = voteRecords.reduce((sum, record) => sum + record.vote_count, 0)

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">加载失败</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header totalVotes={totalVotes} totalTeams={teams.length} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" text="正在加载投票数据..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 投票区域 */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">参赛队伍</h2>
                <p className="text-gray-600">
                  {hasVoted 
                    ? '感谢您的投票！您可以查看实时投票结果。' 
                    : '请为您喜欢的编程团队投票，每个设备只能投票一次。'
                  }
                </p>
              </div>
              
              {teams.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">暂无参赛队伍</h3>
                  <p className="text-gray-500">请等待管理员添加参赛队伍信息</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teams.map((team) => {
                    const voteRecord = voteRecords.find(record => record.team_id === team.id)
                    const isVotedTeam = votedTeamId === team.id
                    
                    return (
                      <TeamCard
                        key={team.id}
                        team={team}
                        voteRecord={voteRecord}
                        hasVoted={hasVoted}
                        isVotedTeam={isVotedTeam}
                        onVote={vote}
                        isLoading={isLoading}
                      />
                    )
                  })}
                </div>
              )}
            </div>
            
            {/* 投票结果区域 */}
            <div className="lg:col-span-1">
              <VoteResults voteRecords={voteRecords} isLoading={isLoading} />
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            编程大赛投票系统 &copy; 2025 | 
            <span className="text-primary-600 font-medium"> 公平 · 公正 · 公开</span>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            每个设备仅限投票一次
          </p>
        </div>
      </footer>
    </div>
  )
}