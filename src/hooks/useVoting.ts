import { useState, useEffect, useCallback } from 'react'
import { supabase, Team, Vote, VoteRecord } from '../lib/supabase'
import { useFingerprint } from './useFingerprint'
import { toast } from 'sonner'

interface VotingState {
  teams: Team[]
  voteRecords: VoteRecord[]
  isLoading: boolean
  error: string | null
  hasVoted: boolean
  votedTeamId: string | null
}

interface VotingActions {
  vote: (teamId: string) => Promise<boolean>
  checkVoteStatus: () => Promise<void>
  refreshData: () => Promise<void>
}

export const useVoting = (): VotingState & VotingActions => {
  const [teams, setTeams] = useState<Team[]>([])
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [votedTeamId, setVotedTeamId] = useState<string | null>(null)
  
  const { fingerprint, isLoading: fingerprintLoading } = useFingerprint()

  // 获取队伍数据
  const fetchTeams = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name')
      
      if (error) throw error
      setTeams(data || [])
    } catch (err) {
      console.error('Failed to fetch teams:', err)
      setError('获取队伍信息失败')
    }
  }, [])

  // 获取投票统计数据
  const fetchVoteRecords = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vote_records')
        .select(`
          *,
          teams (
            id,
            name
          )
        `)
        .order('vote_count', { ascending: false })
      
      if (error) throw error
      setVoteRecords(data || [])
    } catch (err) {
      console.error('Failed to fetch vote records:', err)
      setError('获取投票统计失败')
    }
  }, [])

  // 检查用户是否已投票
  const checkVoteStatus = useCallback(async () => {
    if (!fingerprint) return
    
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('team_id')
        .eq('device_fingerprint', fingerprint)
        .limit(1)
      
      if (error) throw error
      
      if (data && data.length > 0) {
        setHasVoted(true)
        setVotedTeamId(data[0].team_id)
      } else {
        setHasVoted(false)
        setVotedTeamId(null)
      }
    } catch (err) {
      console.error('Failed to check vote status:', err)
    }
  }, [fingerprint])

  // 投票功能
  const vote = useCallback(async (teamId: string): Promise<boolean> => {
    console.log('开始投票流程，teamId:', teamId, 'fingerprint:', fingerprint)
    
    if (!fingerprint) {
      console.error('设备指纹获取失败')
      toast.error('设备指纹获取失败，无法投票')
      return false
    }

    if (hasVoted) {
      console.warn('用户已经投过票了')
      toast.error('您已经投过票了！')
      return false
    }

    try {
      setIsLoading(true)
      
      // 获取用户 User Agent
      const userAgent = navigator.userAgent
      console.log('准备插入投票数据:', { team_id: teamId, device_fingerprint: fingerprint, user_agent: userAgent })
      
      // 插入投票记录（不包含 ip_address 字段，因为在前端难以获取真实 IP）
      const { data, error } = await supabase
        .from('votes')
        .insert({
          team_id: teamId,
          device_fingerprint: fingerprint,
          user_agent: userAgent
        })
        .select()
      
      if (error) {
        console.error('Supabase 插入错误:', error)
        
        // 检查是否是重复投票错误
        if (error.message.includes('duplicate') || 
            error.message.includes('already exists') ||
            error.code === '23505') { // PostgreSQL unique violation error code
          console.warn('检测到重复投票')
          toast.error('您已经投过票了！')
          setHasVoted(true)
          setVotedTeamId(teamId)
          return false
        }
        
        // 检查是否是外键约束错误
        if (error.message.includes('foreign key') || error.code === '23503') {
          console.error('队伍ID不存在:', teamId)
          toast.error('选择的队伍不存在，请刷新页面重试')
          return false
        }
        
        throw error
      }
      
      console.log('投票插入成功:', data)
      
      // 投票成功
      setHasVoted(true)
      setVotedTeamId(teamId)
      toast.success('投票成功！感谢您的参与')
      
      // 刷新投票统计
      await fetchVoteRecords()
      
      return true
    } catch (err: any) {
      console.error('投票过程中发生错误:', err)
      console.error('错误详情:', {
        message: err.message,
        code: err.code,
        details: err.details,
        hint: err.hint
      })
      
      // 根据错误类型显示不同的错误信息
      if (err.message?.includes('network') || err.message?.includes('fetch')) {
        toast.error('网络连接失败，请检查网络后重试')
      } else if (err.message?.includes('permission') || err.message?.includes('unauthorized')) {
        toast.error('权限不足，请刷新页面重试')
      } else {
        toast.error(`投票失败：${err.message || '未知错误'}，请稍后重试`)
      }
      
      return false
    } finally {
      setIsLoading(false)
    }
  }, [fingerprint, hasVoted, fetchVoteRecords])

  // 刷新所有数据
  const refreshData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await Promise.all([
        fetchTeams(),
        fetchVoteRecords(),
        checkVoteStatus()
      ])
    } catch (err) {
      console.error('Failed to refresh data:', err)
      setError('数据刷新失败')
    } finally {
      setIsLoading(false)
    }
  }, [fetchTeams, fetchVoteRecords, checkVoteStatus])

  // 初始化数据
  useEffect(() => {
    if (!fingerprintLoading && fingerprint) {
      refreshData()
    }
  }, [fingerprintLoading, fingerprint, refreshData])

  // 设置实时订阅
  useEffect(() => {
    // 订阅投票统计变化
    const voteRecordsSubscription = supabase
      .channel('vote_records_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vote_records'
        },
        () => {
          fetchVoteRecords()
        }
      )
      .subscribe()

    return () => {
      voteRecordsSubscription.unsubscribe()
    }
  }, [fetchVoteRecords])

  return {
    teams,
    voteRecords,
    isLoading: isLoading || fingerprintLoading,
    error,
    hasVoted,
    votedTeamId,
    vote,
    checkVoteStatus,
    refreshData
  }
}