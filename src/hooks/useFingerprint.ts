import { useState, useEffect } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

interface FingerprintData {
  fingerprint: string | null
  isLoading: boolean
  error: string | null
}

export const useFingerprint = (): FingerprintData => {
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateFingerprint = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // 初始化 FingerprintJS
        const fp = await FingerprintJS.load()
        
        // 获取设备指纹
        const result = await fp.get()
        
        setFingerprint(result.visitorId)
      } catch (err) {
        console.error('Failed to generate fingerprint:', err)
        setError('无法生成设备指纹')
        
        // 如果指纹生成失败，使用备用方案
        const fallbackFingerprint = generateFallbackFingerprint()
        setFingerprint(fallbackFingerprint)
      } finally {
        setIsLoading(false)
      }
    }

    generateFingerprint()
  }, [])

  return { fingerprint, isLoading, error }
}

// 备用指纹生成方案
const generateFallbackFingerprint = (): string => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Device fingerprint fallback', 2, 2)
  }
  
  const canvasFingerprint = canvas.toDataURL()
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasFingerprint.slice(-50), // 取canvas指纹的最后50个字符
    Math.random().toString(36).substring(2) // 添加随机数确保唯一性
  ].join('|')
  
  // 生成简单的hash
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  
  return Math.abs(hash).toString(36)
}