import { useState, useEffect } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // 设置初始值
    setMatches(media.matches)
    
    // 监听变化
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    
    // 添加监听器
    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      // 兼容旧版本浏览器
      media.addListener(listener)
    }
    
    // 清理函数
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [query])

  return matches
}

// 常用的媒体查询 hooks
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')
export const useIsTouchDevice = () => useMediaQuery('(hover: none) and (pointer: coarse)')