import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { Header } from '../components/Header'
import { TeamCard } from '../components/TeamCard'
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 max-w-md w-full mx-4 border border-gray-700">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-white mb-2">加载失败</h2>
            <p className="text-gray-300 mb-4">{error}</p>
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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header totalVotes={totalVotes} totalTeams={teams.length} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" text="正在加载投票数据..." />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <h2 className="text-3xl font-bold text-white mb-2">参赛队伍</h2>
                <p className="text-gray-300 text-lg">
                  {hasVoted 
                    ? '感谢您的投票！您可以查看实时投票结果。' 
                    : '请为您喜欢的编程团队投票，每个设备只能投票一次。'
                  }
                </p>
              </div>
              
              {/* 查看结果按钮 */}
              <div className="flex-shrink-0">
                <Link
                  to="/results"
                  className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-lg"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>查看投票结果</span>
                </Link>
              </div>
            </div>
            
            {/* 投票状态提示 */}
            {hasVoted && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500/20 rounded-full p-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-300">投票成功！</h3>
                    <p className="text-green-400">
                      您已为 "{teams.find(team => team.id === votedTeamId)?.name}" 投票
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 队伍列表 */}
            {teams.length === 0 ? (
              <div className="bg-gray-900 rounded-xl shadow-lg p-12 text-center border border-gray-700">
                <div className="text-gray-400 text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-semibold text-white mb-4">暂无参赛队伍</h3>
                <p className="text-gray-300 text-lg">请等待管理员添加参赛队伍信息</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            
            {/* 底部提示 */}
            {!hasVoted && teams.length > 0 && (
              <div className="mt-12 text-center">
                <div className="bg-gray-900 rounded-xl shadow-lg p-8 max-w-2xl mx-auto border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    投票须知
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>每个设备只能投票一次</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>投票后无法修改</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>结果实时更新</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span>公平公正公开</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 text-sm">
            SOLO Hackathon, TRAE Friends@南京, 投票系统 &copy; 2025 | 
            <span className="text-primary-400 font-medium"> 公平 · 公正 · 公开</span>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            每个设备仅限投票一次
          </p>
        </div>
      </footer>
    </div>
  )
}