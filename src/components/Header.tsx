import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Trophy, Users, TrendingUp, Vote, UserPlus } from 'lucide-react'
import { Logo } from './Logo'

interface HeaderProps {
  totalVotes?: number
  totalTeams?: number
}

export const Header: React.FC<HeaderProps> = ({ totalVotes = 0, totalTeams = 0 }) => {
  const location = useLocation()
  const isResultsPage = location.pathname === '/results'
  const isRegisterPage = location.pathname === '/register'

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
          <div className="flex items-center justify-center">
            <div className="flex items-center bg-white bg-opacity-10 rounded-lg p-1 space-x-1 sm:space-x-2">
              <Link
                to="/"
                className={`
                  flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md transition-all duration-200 text-xs sm:text-sm
                  ${location.pathname === '/' 
                    ? 'bg-white bg-opacity-20 text-white font-medium' 
                    : 'text-primary-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }
                `}
              >
                <Vote className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">投票页面</span>
              </Link>
              
              <div className="w-px h-4 bg-primary-300 hidden sm:block"></div>
              
              <Link
                to="/results"
                className={`
                  flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md transition-all duration-200 text-xs sm:text-sm
                  ${isResultsPage 
                    ? 'bg-white bg-opacity-20 text-white font-medium' 
                    : 'text-primary-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }
                `}
              >
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">投票结果</span>
              </Link>
              
              <div className="w-px h-4 bg-primary-300 hidden sm:block"></div>
              
              <Link
                to="/register"
                className={`
                  flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md transition-all duration-200 text-xs sm:text-sm
                  ${isRegisterPage 
                    ? 'bg-white bg-opacity-20 text-white font-medium' 
                    : 'text-primary-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }
                `}
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="whitespace-nowrap">队伍注册</span>
              </Link>
            </div>
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
              : isRegisterPage
              ? '注册您的参赛队伍，加入 SOLO Hackathon'
              : '为您喜欢的编程团队投票，每个设备只能投票一次'
            }
          </p>
        </div>
      </div>
    </header>
  )
}