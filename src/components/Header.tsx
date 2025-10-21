import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Trophy, Users, TrendingUp, Vote } from 'lucide-react'
import { Logo } from './Logo'

interface HeaderProps {
  totalVotes?: number
  totalTeams?: number
}

export const Header: React.FC<HeaderProps> = ({ totalVotes = 0, totalTeams = 0 }) => {
  const location = useLocation()
  const isResultsPage = location.pathname === '/results'

  return (
    <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Logo 区域 */}
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-2">
              <Logo size="md" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">TRAE Friends@南京</h1>
              <p className="text-primary-100 text-sm md:text-base">SOLO Hackathon</p>
            </div>
          </div>
          
          {/* 导航链接 */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                ${!isResultsPage 
                  ? 'bg-white bg-opacity-20 text-white font-medium' 
                  : 'text-primary-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }
              `}
            >
              <Vote className="w-4 h-4" />
              <span>投票页面</span>
            </Link>
            
            <div className="w-px h-4 bg-primary-300"></div>
            
            <Link
              to="/results"
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                ${isResultsPage 
                  ? 'bg-white bg-opacity-20 text-white font-medium' 
                  : 'text-primary-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                }
              `}
            >
              <TrendingUp className="w-4 h-4" />
              <span>投票结果</span>
            </Link>
          </div>
          
          {/* 统计信息 */}
          <div className="flex items-center space-x-6 text-sm md:text-base">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{totalTeams} 支队伍</span>
            </div>
            <div className="w-px h-4 bg-primary-300"></div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>{totalVotes} 票</span>
            </div>
          </div>
          
          {/* 说明文字 */}
          <p className="text-primary-100 text-sm max-w-md">
            {isResultsPage 
              ? '实时查看各参赛队伍的投票统计数据' 
              : '为您喜欢的编程团队投票，每个设备只能投票一次'
            }
          </p>
        </div>
      </div>
    </header>
  )
}