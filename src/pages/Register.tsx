import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { Users, User, Mail, FileText, Trophy, Plus, X } from 'lucide-react'

interface TeamFormData {
  name: string
  description: string
  captainName: string
  members: string[]
  contactInfo: string
  projectDescription: string
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    description: '',
    captainName: '',
    members: [''],
    contactInfo: '',
    projectDescription: ''
  })

  const [errors, setErrors] = useState<Partial<TeamFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<TeamFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = '队伍名称不能为空'
    } else if (formData.name.length < 2) {
      newErrors.name = '队伍名称至少需要2个字符'
    }

    if (!formData.description.trim()) {
      newErrors.description = '队伍描述不能为空'
    } else if (formData.description.length < 10) {
      newErrors.description = '队伍描述至少需要10个字符'
    }

    if (!formData.captainName.trim()) {
      newErrors.captainName = '队长姓名不能为空'
    }

    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = '联系方式不能为空'
    } else if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(formData.contactInfo) && !/^1[3-9]\d{9}$/.test(formData.contactInfo)) {
      newErrors.contactInfo = '请输入有效的邮箱或手机号'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof TeamFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...formData.members]
    newMembers[index] = value
    setFormData(prev => ({
      ...prev,
      members: newMembers
    }))
  }

  const addMember = () => {
    if (formData.members.length < 5) {
      setFormData(prev => ({
        ...prev,
        members: [...prev.members, '']
      }))
    }
  }

  const removeMember = (index: number) => {
    if (formData.members.length > 1) {
      const newMembers = formData.members.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        members: newMembers
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('请检查表单信息')
      return
    }

    setLoading(true)

    try {
      // 过滤空的成员名称
      const filteredMembers = formData.members.filter(member => member.trim() !== '')
      
      // 插入队伍数据
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim(),
          captain_name: formData.captainName.trim(),
          members: filteredMembers,
          contact_info: formData.contactInfo.trim(),
          project_description: formData.projectDescription.trim() || null,
          is_registered: true,
          registration_date: new Date().toISOString()
        })
        .select()

      if (error) {
        if (error.code === '23505') {
          toast.error('队伍名称已存在，请选择其他名称')
        } else {
          console.error('Registration error:', error)
          toast.error('注册失败，请稍后重试')
        }
        return
      }

      if (data && data.length > 0) {
        // 初始化投票统计
        await supabase
          .from('vote_records')
          .insert({
            team_id: data[0].id,
            vote_count: 0
          })

        toast.success('队伍注册成功！')
        
        // 延迟跳转，让用户看到成功消息
        setTimeout(() => {
          navigate('/')
        }, 1500)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('注册过程中发生错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">队伍注册</h1>
          <p className="text-gray-400">加入 SOLO Hackathon，展示你的编程实力</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 space-y-6">
          {/* 队伍名称 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <Users className="w-4 h-4 mr-2" />
              队伍名称 <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.name ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="输入你的队伍名称"
              maxLength={100}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* 队伍描述 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              队伍描述 <span className="text-red-400 ml-1">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="简单介绍你的队伍特色和技术栈"
              rows={3}
              maxLength={500}
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            <p className="text-gray-500 text-xs mt-1">{formData.description.length}/500</p>
          </div>

          {/* 队长姓名 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <User className="w-4 h-4 mr-2" />
              队长姓名 <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.captainName}
              onChange={(e) => handleInputChange('captainName', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.captainName ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="输入队长的真实姓名"
              maxLength={100}
            />
            {errors.captainName && <p className="text-red-400 text-sm mt-1">{errors.captainName}</p>}
          </div>

          {/* 队员姓名 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <Users className="w-4 h-4 mr-2" />
              队员姓名 <span className="text-gray-500">(可选)</span>
            </label>
            <div className="space-y-2">
              {formData.members.map((member, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={`队员 ${index + 1} 姓名`}
                    maxLength={100}
                  />
                  {formData.members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {formData.members.length < 5 && (
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center text-primary-400 hover:text-primary-300 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  添加队员
                </button>
              )}
            </div>
            <p className="text-gray-500 text-xs mt-1">最多可添加5名队员</p>
          </div>

          {/* 联系方式 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <Mail className="w-4 h-4 mr-2" />
              联系方式 <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => handleInputChange('contactInfo', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.contactInfo ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="邮箱或手机号"
              maxLength={200}
            />
            {errors.contactInfo && <p className="text-red-400 text-sm mt-1">{errors.contactInfo}</p>}
          </div>

          {/* 项目简介 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              项目简介 <span className="text-gray-500">(可选)</span>
            </label>
            <textarea
              value={formData.projectDescription}
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="简单介绍你们的参赛项目（可后续补充）"
              rows={4}
              maxLength={1000}
            />
            <p className="text-gray-500 text-xs mt-1">{formData.projectDescription.length}/1000</p>
          </div>

          {/* 提交按钮 */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-3 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '注册中...' : '注册队伍'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>注册即表示同意遵守比赛规则和行为准则</p>
        </div>
      </div>
    </div>
  )
}

export default Register