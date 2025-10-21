import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Trophy, Medal, Award, BarChart3, Users } from 'lucide-react'
import { Header } from '../components/Header'
import { VoteResults } from '../components/VoteResults'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useVoting } from '../hooks/useVoting'

export default function Results() {
  const {
    teams,
    voteRecords,
    isLoading,
    error,
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
            <div className="space-y-3">
              <button
                onClick={refreshData}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                重试
              </button>
              <Link
                to="/"
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors text-center"
              >
                返回投票页面
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header totalVotes={totalVotes} totalTeams={teams.length} />
      
      {/* Navigation */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回投票页面</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" text="正在加载投票结果..." />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-primary-500/20 rounded-full p-3">
                  <TrendingUp className="w-8 h-8 text-primary-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">实时投票结果</h1>
              </div>
              <p className="text-gray-300 text-lg">
                查看各参赛队伍的实时投票统计数据
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-center border border-gray-700">
                <div className="bg-blue-500/20 rounded-full p-3 w-fit mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{teams.length}</h3>
                <p className="text-gray-300">参赛队伍</p>
              </div>
              
              <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-center border border-gray-700">
                <div className="bg-green-500/20 rounded-full p-3 w-fit mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{totalVotes}</h3>
                <p className="text-gray-300">总投票数</p>
              </div>
              
              <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-center border border-gray-700">
                <div className="bg-yellow-500/20 rounded-full p-3 w-fit mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {voteRecords.length > 0 ? voteRecords[0]?.teams?.name || '暂无' : '暂无'}
                </h3>
                <p className="text-gray-300">当前领先</p>
              </div>
            </div>

            {/* Vote Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 主要结果区域 */}
              <div className="lg:col-span-2">
                <VoteResults voteRecords={voteRecords} isLoading={isLoading} />
              </div>
              
              {/* 侧边栏信息 */}
              <div className="lg:col-span-1 space-y-6">
                {/* 前三名快速预览 */}
                <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span>排行榜前三</span>
                  </h3>
                  
                  {voteRecords.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-400">暂无投票数据</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {voteRecords.slice(0, 3).map((record, index) => {
                        const rank = index + 1
                        const getRankIcon = () => {
                          switch (rank) {
                            case 1:
                              return <Trophy className="w-5 h-5 text-yellow-500" />
                            case 2:
                              return <Medal className="w-5 h-5 text-gray-400" />
                            case 3:
                              return <Award className="w-5 h-5 text-amber-600" />
                            default:
                              return null
                          }
                        }
                        
                        return (
                          <div key={record.team_id} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                            {getRankIcon()}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white truncate">
                                {record.teams?.name || `队伍 ${record.team_id}`}
                              </p>
                              <p className="text-sm text-gray-400">{record.vote_count} 票</p>
                            </div>
                            <div className="text-lg font-bold text-primary-400">
                              #{rank}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                
                {/* 投票提示 */}
                <div className="bg-primary-900/20 border border-primary-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-primary-300 mb-2">
                    想要投票？
                  </h3>
                  <p className="text-primary-400 text-sm mb-4">
                    返回投票页面为您喜欢的队伍投票
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>去投票</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300 text-sm">
            编程大赛投票系统 &copy; 2025 | 
            <span className="text-primary-400 font-medium"> 公平 · 公正 · 公开</span>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            数据实时更新，每个设备仅限投票一次
          </p>
        </div>
      </footer>
    </div>
  )
}