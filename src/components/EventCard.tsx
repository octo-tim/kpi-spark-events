import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Calendar, MapPin, Users, Target, Eye, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'

export type EventType = '라이브커머스' | '베이비페어' | '입주박람회' | '인플루언서공구'
export type EventStatus = '계획중' | '진행중' | '완료' | '취소'

export interface EventData {
  id: string
  title: string
  type: EventType
  status: EventStatus
  startDate: string
  endDate: string
  location?: string
  partner: string
  targetContracts: number
  actualContracts?: number
  targetEstimates: number
  actualEstimates?: number
  targetSqm: number
  actualSqm?: number
  totalCost?: number
  costPerSqm?: number
  description?: string
  manager?: string
}

interface EventCardProps {
  event: EventData
  className?: string
}

const EventCard = ({ event, className }: EventCardProps) => {
  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case '계획중':
        return 'bg-muted text-muted-foreground'
      case '진행중':
        return 'bg-primary text-primary-foreground'
      case '완료':
        return 'bg-success text-success-foreground'
      case '취소':
        return 'bg-danger text-danger-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case '라이브커머스':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case '베이비페어':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case '입주박람회':
        return 'bg-green-100 text-green-800 border-green-200'
      case '인플루언서공구':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const calculateAchievementRate = () => {
    if (event.status !== '완료' || !event.actualContracts) return null
    return Math.round((event.actualContracts / event.targetContracts) * 100)
  }

  const achievementRate = calculateAchievementRate()

  return (
    <Card className={cn('hover:shadow-medium transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge className={getTypeColor(event.type)}>
                {event.type}
              </Badge>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg text-foreground line-clamp-2">
              {event.title}
            </h3>
          </div>
          {achievementRate && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">달성률</div>
              <div className={cn(
                'text-lg font-bold',
                achievementRate >= 100 ? 'text-success' : 
                achievementRate >= 80 ? 'text-warning' : 'text-danger'
              )}>
                {achievementRate}%
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {event.startDate} ~ {event.endDate}
        </div>
        
        {event.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          {event.partner}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">계약건수</div>
            <div className="font-semibold text-sm">
              {event.actualContracts || 0}/{event.targetContracts}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">견적건수</div>
            <div className="font-semibold text-sm">
              {event.actualEstimates || 0}/{event.targetEstimates}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">계약장수</div>
            <div className="font-semibold text-sm">
              {(event.actualSqm || 0).toLocaleString()}/{event.targetSqm.toLocaleString()}
            </div>
          </div>
          {event.costPerSqm && (
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">장당비용</div>
              <div className="font-semibold text-sm">
                {event.costPerSqm.toLocaleString()}원
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link to={`/events/${event.id}`}>
            <Eye className="w-4 h-4 mr-1" />
            상세보기
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link to={`/events/${event.id}/edit`}>
            <Edit className="w-4 h-4 mr-1" />
            수정
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default EventCard