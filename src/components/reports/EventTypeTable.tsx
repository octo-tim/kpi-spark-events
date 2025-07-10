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
    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-orange-800 dark:text-orange-200">
          <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-full">
            <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-300" />
          </div>
          이벤트 유형별 성과 분석
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-inner p-1">
          <Table className="rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-orange-100 dark:bg-orange-900 hover:bg-orange-100 dark:hover:bg-orange-900 border-orange-200 dark:border-orange-700">
                <TableHead className="font-bold text-orange-800 dark:text-orange-200">이벤트 유형</TableHead>
                <TableHead className="text-center font-bold text-orange-800 dark:text-orange-200">이벤트 수</TableHead>
                <TableHead className="text-center font-bold text-orange-800 dark:text-orange-200">목표 계약</TableHead>
                <TableHead className="text-center font-bold text-orange-800 dark:text-orange-200">실제 계약</TableHead>
                <TableHead className="text-center font-bold text-orange-800 dark:text-orange-200">달성률</TableHead>
                <TableHead className="text-center font-bold text-orange-800 dark:text-orange-200">목표 견적</TableHead>
                <TableHead className="text-center font-bold text-orange-800 dark:text-orange-200">실제 견적</TableHead>
                <TableHead className="text-right font-bold text-orange-800 dark:text-orange-200">총 비용</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventTypeStats.map((stat: any, index: number) => (
                <TableRow key={stat.type} className="hover:bg-orange-25 dark:hover:bg-orange-950/30 border-orange-100 dark:border-orange-800 transition-colors">
                  <TableCell className="font-semibold text-gray-800 dark:text-gray-200">{stat.type}</TableCell>
                  <TableCell className="text-center text-gray-700 dark:text-gray-300">{stat.count}개</TableCell>
                  <TableCell className="text-center text-gray-700 dark:text-gray-300">{formatNumber(stat.totalTargetContracts)}건</TableCell>
                  <TableCell className="text-center text-gray-700 dark:text-gray-300">{formatNumber(stat.totalActualContracts)}건</TableCell>
                  <TableCell className="text-center">{getAchievementBadge(stat.achievementRate)}</TableCell>
                  <TableCell className="text-center text-gray-700 dark:text-gray-300">{formatNumber(stat.totalTargetEstimates)}건</TableCell>
                  <TableCell className="text-center text-gray-700 dark:text-gray-300">{formatNumber(stat.totalActualEstimates)}건</TableCell>
                  <TableCell className="text-right font-semibold text-gray-800 dark:text-gray-200">{formatNumber(stat.totalCost)}원</TableCell>
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