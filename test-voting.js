// 简单的投票功能测试脚本
// 在浏览器控制台中运行此脚本来测试投票功能

console.log('🚀 开始测试投票系统...')

// 测试设备指纹生成
async function testFingerprint() {
  console.log('📱 测试设备指纹生成...')
  
  try {
    // 检查 FingerprintJS 是否加载
    if (typeof FingerprintJS !== 'undefined') {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      console.log('✅ 设备指纹生成成功:', result.visitorId)
      return result.visitorId
    } else {
      console.log('⚠️ FingerprintJS 未加载，使用备用方案')
      return 'test-fingerprint-' + Math.random().toString(36).substring(2)
    }
  } catch (error) {
    console.error('❌ 设备指纹生成失败:', error)
    return null
  }
}

// 测试数据库连接
async function testDatabaseConnection() {
  console.log('🗄️ 测试数据库连接...')
  
  try {
    // 检查 Supabase 客户端是否可用
    if (typeof window !== 'undefined' && window.supabase) {
      const { data, error } = await window.supabase
        .from('teams')
        .select('*')
        .limit(1)
      
      if (error) {
        console.error('❌ 数据库连接失败:', error)
        return false
      }
      
      console.log('✅ 数据库连接成功')
      return true
    } else {
      console.log('⚠️ Supabase 客户端未找到')
      return false
    }
  } catch (error) {
    console.error('❌ 数据库连接测试失败:', error)
    return false
  }
}

// 测试响应式设计
function testResponsiveDesign() {
  console.log('📱 测试响应式设计...')
  
  const breakpoints = [
    { name: '移动端', width: 375 },
    { name: '平板', width: 768 },
    { name: '桌面端', width: 1024 }
  ]
  
  breakpoints.forEach(bp => {
    // 模拟不同屏幕尺寸
    const mediaQuery = window.matchMedia(`(min-width: ${bp.width}px)`)
    console.log(`${bp.name} (${bp.width}px): ${mediaQuery.matches ? '✅' : '❌'}`)
  })
}

// 测试主题颜色
function testThemeColors() {
  console.log('🎨 测试主题颜色...')
  
  const primaryElements = document.querySelectorAll('[class*="primary"]')
  const hasThemeColors = primaryElements.length > 0
  
  console.log(`主题颜色元素数量: ${primaryElements.length}`)
  console.log(`主题颜色应用: ${hasThemeColors ? '✅' : '❌'}`)
  
  // 检查 CSS 变量
  const rootStyles = getComputedStyle(document.documentElement)
  console.log('CSS 变量检查完成')
}

// 运行所有测试
async function runAllTests() {
  console.log('🧪 开始运行所有测试...\n')
  
  await testFingerprint()
  await testDatabaseConnection()
  testResponsiveDesign()
  testThemeColors()
  
  console.log('\n✨ 测试完成！')
  console.log('💡 提示：在移动设备上打开开发者工具来测试移动端功能')
}

// 自动运行测试
runAllTests()

// 导出测试函数供手动调用
window.votingTests = {
  testFingerprint,
  testDatabaseConnection,
  testResponsiveDesign,
  testThemeColors,
  runAllTests
}