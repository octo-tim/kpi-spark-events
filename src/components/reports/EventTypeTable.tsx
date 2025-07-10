import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BarChart3 } from 'lucide-react'
import { Event } from '@/hooks/useEvents'

interface EventTypeTableProps {
  events: Event[]
  title: string
}

export const EventTypeTable: React.FC<EventTypeTableProps> = ({ events, title }) => {
  const getEventTypeStats = () => {
    const stats: { [key: string]: any } = {}
    
    events.forEach(event => {
      if (!stats[event.type]) {
        stats[event.type] = {
          type: event.type,
          count: 0,
          totalTargetContracts: 0,
          totalActualContracts: 0,
          totalTargetEstimates: 0,
          totalActualEstimates: 0,
          totalCost: 0,
          achievementRate: 0
        }
      }
      
      stats[event.type].count += 1
      stats[event.type].totalTargetContracts += event.target_contracts || 0
      stats[event.type].totalActualContracts += event.actual_contracts || 0
      stats[event.type].totalTargetEstimates += event.target_estimates || 0
      stats[event.type].totalActualEstimates += event.actual_estimates || 0
      stats[event.type].totalCost += event.total_cost || 0
    })
    
    // 달성률 계산
    Object.values(stats).forEach((stat: any) => {
      stat.achievementRate = stat.totalTargetContracts > 0 
        ? Math.round((stat.totalActualContracts / stat.totalTargetContracts) * 100) 
        : 0
    })
    
    return Object.values(stats)
  }

  const eventTypeStats = getEventTypeStats()

  const getAchievementBadge = (rate: number) => {
    if (rate >= 100) return <Badge className="bg-success text-success-foreground">{rate}%</Badge>
    if (rate >= 80) return <Badge className="bg-warning text-warning-foreground">{rate}%</Badge>
    return <Badge variant="destructive">{rate}%</Badge>
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이벤트 유형</TableHead>
                <TableHead className="text-center">이벤트 수</TableHead>
                <TableHead className="text-center">목표 계약</TableHead>
                <TableHead className="text-center">실제 계약</TableHead>
                <TableHead className="text-center">달성률</TableHead>
                <TableHead className="text-center">목표 견적</TableHead>
                <TableHead className="text-center">실제 견적</TableHead>
                <TableHead className="text-right">총 비용</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventTypeStats.map((stat: any) => (
                <TableRow key={stat.type}>
                  <TableCell className="font-medium">{stat.type}</TableCell>
                  <TableCell className="text-center">{stat.count}개</TableCell>
                  <TableCell className="text-center">{formatNumber(stat.totalTargetContracts)}건</TableCell>
                  <TableCell className="text-center">{formatNumber(stat.totalActualContracts)}건</TableCell>
                  <TableCell className="text-center">{getAchievementBadge(stat.achievementRate)}</TableCell>
                  <TableCell className="text-center">{formatNumber(stat.totalTargetEstimates)}건</TableCell>
                  <TableCell className="text-center">{formatNumber(stat.totalActualEstimates)}건</TableCell>
                  <TableCell className="text-right">{formatNumber(stat.totalCost)}원</TableCell>
                </TableRow>
              ))}
              {eventTypeStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    해당 기간에 이벤트가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}