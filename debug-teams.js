// 调试脚本：检查队伍数据
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugTeams() {
  try {
    console.log('正在获取队伍数据...')
    
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('获取数据失败:', error)
      return
    }
    
    console.log('队伍数据:')
    data.forEach((team, index) => {
      console.log(`\n队伍 ${index + 1}:`)
      console.log('  ID:', team.id)
      console.log('  名称:', team.name)
      console.log('  描述:', team.description)
      console.log('  队长:', team.captain_name)
      console.log('  成员:', team.members)
      console.log('  成员类型:', typeof team.members)
      console.log('  成员长度:', team.members ? team.members.length : 'null')
      console.log('  是否注册:', team.is_registered)
      console.log('  注册时间:', team.registration_date)
    })
    
  } catch (err) {
    console.error('调试过程中发生错误:', err)
  }
}

debugTeams()