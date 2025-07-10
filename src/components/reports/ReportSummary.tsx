import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, FileText, TrendingUp, Target, DollarSign, Calendar } from 'lucide-react'
import { Event } from '@/hooks/useEvents'

interface ReportSummaryProps {
  events: Event[]
  periodType: 'month' | 'quarter' | 'range'
  selectedPeriod: string
  title: string
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ 
  events, 
  periodType, 
  selectedPeriod, 
  title 
}) => {
  const getSummaryStats = () => {
    const totalEvents = events.length
    const totalTargetContracts = events.reduce((sum, e) => sum + (e.target_contracts || 0), 0)
    const totalActualContracts = events.reduce((sum, e) => sum + (e.actual_contracts || 0), 0)
    const totalTargetEstimates = events.reduce((sum, e) => sum + (e.target_estimates || 0), 0)
    const totalActualEstimates = events.reduce((sum, e) => sum + (e.actual_estimates || 0), 0)
    const totalCost = events.reduce((sum, e) => sum + (e.total_cost || 0), 0)
    
    const contractAchievementRate = totalTargetContracts > 0 
      ? Math.round((totalActualContracts / totalTargetContracts) * 100) 
      : 0
    
    const estimateAchievementRate = totalTargetEstimates > 0 
      ? Math.round((totalActualEstimates / totalTargetEstimates) * 100) 
      : 0

    const avgEfficiency = events.length > 0 
      ? Math.round(events.reduce((sum, e) => sum + (e.efficiency || 0), 0) / events.length)
      : 0

    return {
      totalEvents,
      totalTargetContracts,
      totalActualContracts,
      totalTargetEstimates,
      totalActualEstimates,
      totalCost,
      contractAchievementRate,
      estimateAchievementRate,
      avgEfficiency
    }
  }

  const stats = getSummaryStats()

  const getAchievementBadge = (rate: number) => {
    if (rate >= 100) return <Badge className="bg-success text-success-foreground">{rate}%</Badge>
    if (rate >= 80) return <Badge className="bg-warning text-warning-foreground">{rate}%</Badge>
    return <Badge variant="destructive">{rate}%</Badge>
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num)
  }

  const formatPeriod = () => {
    if (periodType === 'month') {
      const [year, month] = selectedPeriod.split('-')
      return `${year}년 ${parseInt(month)}월`
    } else if (periodType === 'quarter') {
      const [year, quarter] = selectedPeriod.split('-Q')
      return `${year}년 ${quarter}분기`
    } else {
      if (selectedPeriod === '2024') return '2024년 전체'
      if (selectedPeriod === '2024-H1') return '2024년 상반기'
      if (selectedPeriod === '2024-H2') return '2024년 하반기'
      return selectedPeriod
    }
  }

  const handleDownloadReport = () => {
    const reportContent = `
${title}
생성일: ${new Date().toLocaleDateString('ko-KR')}
조회기간: ${formatPeriod()}

=== 종합 성과 요약 ===
총 이벤트 수: ${stats.totalEvents}개
목표 계약: ${formatNumber(stats.totalTargetContracts)}건
실제 계약: ${formatNumber(stats.totalActualContracts)}건
계약 달성률: ${stats.contractAchievementRate}%

목표 견적: ${formatNumber(stats.totalTargetEstimates)}건
실제 견적: ${formatNumber(stats.totalActualEstimates)}건
견적 달성률: ${stats.estimateAchievementRate}%

총 비용: ${formatNumber(stats.totalCost)}원
평균 효율성: ${stats.avgEfficiency}%

=== 이벤트 상세 ===
${events.map(event => `
- ${event.title} (${event.type})
  기간: ${event.start_date} ~ ${event.end_date}
  목표/실제 계약: ${event.target_contracts}/${event.actual_contracts}건
  비용: ${formatNumber(event.total_cost || 0)}원
  효율성: ${event.efficiency || 0}%
`).join('')}
    `
    
    const element = document.createElement('a')
    const file = new Blob([reportContent], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `${title.replace(/\s+/g, '_')}_${selectedPeriod}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="space-y-6">
      {/* 리포트 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6" />
                {title}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  조회기간: {formatPeriod()}
                </div>
                <div>생성일: {new Date().toLocaleDateString('ko-KR')}</div>
              </div>
            </div>
            <Button onClick={handleDownloadReport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              리포트 다운로드
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* 종합 성과 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 이벤트</p>
                <p className="text-2xl font-bold">{stats.totalEvents}개</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">계약 달성률</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{stats.contractAchievementRate}%</p>
                  {getAchievementBadge(stats.contractAchievementRate)}
                </div>
              </div>
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 비용</p>
                <p className="text-2xl font-bold">{formatNumber(Math.round(stats.totalCost / 1000000))}M</p>
                <p className="text-xs text-muted-foreground">백만원</p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">평균 효율성</p>
                <p className="text-2xl font-bold">{stats.avgEfficiency}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 성과 지표 */}
      <Card>
        <CardHeader>
          <CardTitle>상세 성과 지표</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">계약 성과</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">목표 계약</span>
                  <span>{formatNumber(stats.totalTargetContracts)}건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">실제 계약</span>
                  <span className="font-medium">{formatNumber(stats.totalActualContracts)}건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">달성률</span>
                  {getAchievementBadge(stats.contractAchievementRate)}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">견적 성과</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">목표 견적</span>
                  <span>{formatNumber(stats.totalTargetEstimates)}건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">실제 견적</span>
                  <span className="font-medium">{formatNumber(stats.totalActualEstimates)}건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">달성률</span>
                  {getAchievementBadge(stats.estimateAchievementRate)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}