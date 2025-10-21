import React, { useEffect } from 'react'
import { useIsMobile, useIsTouchDevice } from '../hooks/useMediaQuery'

interface MobileOptimizedProps {
  children: React.ReactNode
}

export const MobileOptimized: React.FC<MobileOptimizedProps> = ({ children }) => {
  const isMobile = useIsMobile()
  const isTouchDevice = useIsTouchDevice()

  useEffect(() => {
    // 设置移动端视口
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    } else {
      const newViewport = document.createElement('meta')
      newViewport.name = 'viewport'
      newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      document.head.appendChild(newViewport)
    }

    // 防止移动端双击缩放
    let lastTouchEnd = 0
    const preventZoom = (e: TouchEvent) => {
      const now = new Date().getTime()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }

    if (isTouchDevice) {
      document.addEventListener('touchend', preventZoom, { passive: false })
    }

    // 设置移动端样式类
    if (isMobile) {
      document.body.classList.add('mobile-device')
    } else {
      document.body.classList.remove('mobile-device')
    }

    if (isTouchDevice) {
      document.body.classList.add('touch-device')
    } else {
      document.body.classList.remove('touch-device')
    }

    return () => {
      if (isTouchDevice) {
        document.removeEventListener('touchend', preventZoom)
      }
    }
  }, [isMobile, isTouchDevice])

  return (
    <div className={`
      ${isMobile ? 'mobile-layout' : 'desktop-layout'}
      ${isTouchDevice ? 'touch-interface' : 'mouse-interface'}
    `}>
      {children}
    </div>
  )
}