import React from 'react'
import { Trophy, Users } from 'lucide-react'
import { Logo } from './Logo'

interface HeaderProps {
  totalVotes?: number
  totalTeams?: number
}

export const Header: React.FC<HeaderProps> = ({ totalVotes = 0, totalTeams = 0 }) => {
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
              <h1 className="text-2xl md:text-3xl font-bold">编程大赛投票</h1>
              <p className="text-primary-100 text-sm md:text-base">Programming Contest Voting</p>
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
            为您喜欢的编程团队投票，每个设备只能投票一次
          </p>
        </div>
      </div>
    </header>
  )
}