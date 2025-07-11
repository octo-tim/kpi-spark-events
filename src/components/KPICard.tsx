import React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: number
  target?: number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
  className?: string
}

const KPICard = ({ 
  title, 
  value, 
  target, 
  unit = '', 
  trend, 
  trendValue,
  className 
}: KPICardProps) => {
  const achievementRate = target ? Math.round((value / target) * 100) : null
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-danger" />
      case 'stable':
        return <Minus className="w-4 h-4 text-muted-foreground" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success'
      case 'down':
        return 'text-danger'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className={cn(
      'bg-gradient-card p-4 sm:p-6 rounded-lg border border-border shadow-soft',
      className
    )}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</h3>
        {trend && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            {trendValue && (
              <span className={cn('text-xs font-medium', getTrendColor())}>
                {trendValue > 0 ? '+' : ''}{trendValue}%
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-xl sm:text-2xl font-bold text-foreground">
            {value.toLocaleString()}
          </span>
          {unit && <span className="text-xs sm:text-sm text-muted-foreground">{unit}</span>}
        </div>
        
        {target && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>목표: {target.toLocaleString()}{unit}</span>
              <span className={cn(
                'font-medium',
                achievementRate && achievementRate >= 100 
                  ? 'text-success' 
                  : achievementRate && achievementRate >= 80 
                    ? 'text-warning' 
                    : 'text-danger'
              )}>
                달성률: {achievementRate}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  achievementRate && achievementRate >= 100 
                    ? 'bg-gradient-success' 
                    : achievementRate && achievementRate >= 80 
                      ? 'bg-warning' 
                      : 'bg-danger'
                )}
                style={{ 
                  width: `${Math.min(achievementRate || 0, 100)}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KPICard