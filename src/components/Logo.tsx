import React from 'react'
import traeLogo from '../assets/trae logo.png'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img
        src={traeLogo}
        alt="Trae Logo"
        className="w-full h-full object-contain rounded-full"
      />
    </div>
  )
}