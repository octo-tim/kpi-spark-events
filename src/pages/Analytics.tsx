import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import KPICard from '@/components/KPICard'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users,
  Target,
  Calendar,
  Download,
  DollarSign,
  CalendarRange
} from 'lucide-react'

const Analytics = () => {
  const [periodFilter, setPeriodFilter] = useState('monthly')
  
  // 샘플 데이터 - 추후 Supabase 연동 시 실제 데이터로 교체
  const channelStats = [
    {
      channel: '라이브커머스',
      totalEvents: 12,
      completedEvents: 8,
      totalContracts: 145,
      totalEstimates: 320,
      totalSqm: 4200,
      avgContractRate: 45.3,
      trend: 'up',
      trendValue: 12
    },
    {
      channel: '베이비페어',
      totalEvents: 8,
      completedEvents: 6,
      totalContracts: 89,
      totalEstimates: 180,
      totalSqm: 3100,
      avgContractRate: 49.4,
      trend: 'up',
      trendValue: 8
    },
    {
      channel: '입주박람회',
      totalEvents: 6,
      completedEvents: 4,
      totalContracts: 67,
      totalEstimates: 150,
      totalSqm: 2800,
      avgContractRate: 44.7,
      trend: 'down',
      trendValue: -3
    },
    {
      channel: '인플루언서공구',
      totalEvents: 10,
      completedEvents: 7,
      totalContracts: 34,
      totalEstimates: 90,
      totalSqm: 1500,
      avgContractRate: 37.8,
      trend: 'up',
      trendValue: 15
    }
  ]

  const periodStats = [
    { period: '2023년 4분기', contracts: 89, estimates: 201, sqm: 2850 },
    { period: '2024년 1분기', contracts: 145, estimates: 275, sqm: 3920 },
    { period: '2024년 2분기', contracts: 112, estimates: 245, sqm: 3120 },
    { period: '2024년 3분기', contracts: 178, estimates: 312, sqm: 4680 }
  ]

  const topPerformers = [
    { partner: '네이버 쇼핑라이브', contracts: 45, rate: 89.2 },
    { partner: '베이비페어 조직위', contracts: 38, rate: 87.5 },
    { partner: '분당신도시개발', contracts: 32, rate: 85.1 },
    { partner: '카카오 쇼핑라이브', contracts: 29, rate: 82.3 },
    { partner: '롯데 베이비페어', contracts: 25, rate: 78.9 }
  ]

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-success" /> : 
      <TrendingDown className="w-4 h-4 text-danger" />
  }

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-success' : 'text-danger'
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">통계 분석</h1>
          <p className="text-muted-foreground mt-2">
            채널별 성과 분석과 트렌드를 확인하세요
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="조회기간" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">월간</SelectItem>
              <SelectItem value="quarterly">분기별</SelectItem>
              <SelectItem value="custom">기간설정</SelectItem>
            </SelectContent>
          </Select>
          {periodFilter === 'custom' && (
            <div className="flex items-center space-x-2">
              <Input type="date" className="w-40" />
              <span>~</span>
              <Input type="date" className="w-40" />
            </div>
          )}
          <Button onClick={() => window.print()}>
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* 전체 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="총 이벤트"
          value={36}
          unit="개"
          trend="up"
          trendValue={12}
        />
        <KPICard
          title="총 계약건수"
          value={335}
          unit="건"
          trend="up"
          trendValue={8}
        />
        <KPICard
          title="평균 달성률"
          value={76.8}
          unit="%"
          trend="down"
          trendValue={-3}
        />
        <KPICard
          title="장당비용"
          value={12500}
          unit="원/장"
          trend="down"
          trendValue={-8}
        />
      </div>

      {/* 이벤트별 상세 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>이벤트별 상세분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { name: '신혼가구 타겟 라이브 쇼핑', type: '라이브커머스', contracts: 32, estimates: 95, sqm: 960, efficiency: 82, costPerSqm: 15625 },
              { name: '서울 베이비&키즈 페어 2024', type: '베이비페어', contracts: 95, estimates: 215, sqm: 2850, efficiency: 88, costPerSqm: 10000 },
              { name: '분당 신도시 입주박람회', type: '입주박람회', contracts: 35, estimates: 85, sqm: 1200, efficiency: 75, costPerSqm: 10000 }
            ].map((event) => (
              <div key={event.name} className="p-4 border border-border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-semibold">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">{event.type}</p>
                  </div>
                  <Badge 
                    className={
                      event.efficiency >= 85 ? "bg-success text-success-foreground" :
                      event.efficiency >= 70 ? "bg-warning text-warning-foreground" :
                      "bg-danger text-danger-foreground"
                    }
                  >
                    효율성 {event.efficiency}%
                  </Badge>
                </div>
                <div className="grid grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">계약건수</p>
                    <p className="font-semibold">{event.contracts}건</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">견적건수</p>
                    <p className="font-semibold">{event.estimates}건</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">계약장수</p>
                    <p className="font-semibold">{event.sqm.toLocaleString()}장</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">전환율</p>
                    <p className="font-semibold">{((event.contracts / event.estimates) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">장당비용</p>
                    <p className="font-semibold">{event.costPerSqm.toLocaleString()}원/장</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 채널별 월간 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>채널별 금월 현황 및 실적 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {channelStats.map((channel, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{channel.channel}</h3>
                  <Badge variant="secondary">금월 현황</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">전월 대비</div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(channel.trend)}
                      <span className={`font-bold ${getTrendColor(channel.trend)}`}>
                        {channel.trendValue > 0 ? '+' : ''}{channel.trendValue}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      전월: {Math.round(channel.totalContracts * 0.9)}건
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">목표 대비</div>
                    <div className="font-bold text-primary">
                      {Math.round((channel.totalContracts / (channel.totalContracts * 1.2)) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      목표: {Math.round(channel.totalContracts * 1.2)}건
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">현재 실적</div>
                    <div className="font-bold text-success">{channel.totalContracts}건</div>
                    <div className="text-xs text-muted-foreground">
                      달성률: {channel.avgContractRate}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 익월 목표 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarRange className="w-5 h-5" />
            <span>익월 목표</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {channelStats.map((channel, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{channel.channel}</h4>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-primary">
                    {Math.round(channel.totalContracts * 1.15)}건
                  </div>
                  <div className="text-xs text-muted-foreground">목표 계약</div>
                  <div className="text-sm">
                    {Math.round(channel.totalEstimates * 1.1)}건 견적
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 기간별 성과 */}
        <Card>
          <CardHeader>
            <CardTitle>분기별 성과 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {periodStats.map((period, index) => {
                const maxContracts = Math.max(...periodStats.map(p => p.contracts))
                const percentage = (period.contracts / maxContracts) * 100
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{period.period}</span>
                      <span className="text-sm text-muted-foreground">
                        {period.contracts}건
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>견적: {period.estimates}건</span>
                      <span>장수: {period.sqm.toLocaleString()}장</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 성과(계약장수) 상위 이벤트 */}
        <Card>
          <CardHeader>
            <CardTitle>성과(계약장수) 상위 이벤트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: '서울 베이비&키즈 페어 2024', sqm: 2850, change: 18 },
                { name: '분당 신도시 입주박람회', sqm: 1200, change: -5 },
                { name: '신혼가구 타겟 라이브 쇼핑', sqm: 960, change: 12 },
                { name: '인플루언서 협업 프로모션', sqm: 750, change: 8 }
              ].map((event, index) => (
                <div key={event.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{event.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{event.sqm.toLocaleString()}장</p>
                    <p className={`text-xs ${event.change >= 0 ? 'text-success' : 'text-danger'}`}>
                      {event.change >= 0 ? '+' : ''}{event.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics