import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users,
  Target,
  Calendar,
  Download
} from 'lucide-react'

const Analytics = () => {
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
        <Button>
          <Download className="w-4 h-4 mr-2" />
          리포트 다운로드
        </Button>
      </div>

      {/* 전체 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 이벤트</p>
                <p className="text-2xl font-bold">36개</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 계약건수</p>
                <p className="text-2xl font-bold">335건</p>
              </div>
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">평균 달성률</p>
                <p className="text-2xl font-bold">76.8%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">활성 파트너</p>
                <p className="text-2xl font-bold">18개</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 채널별 상세 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>채널별 상세 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {channelStats.map((channel, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{channel.channel}</h3>
                    <Badge variant="secondary">
                      {channel.completedEvents}/{channel.totalEvents} 완료
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(channel.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(channel.trend)}`}>
                      {channel.trendValue > 0 ? '+' : ''}{channel.trendValue}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{channel.totalContracts}</div>
                    <div className="text-sm text-muted-foreground">계약건수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{channel.totalEstimates}</div>
                    <div className="text-sm text-muted-foreground">견적건수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{channel.totalSqm.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">계약장수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{channel.avgContractRate}%</div>
                    <div className="text-sm text-muted-foreground">평균 달성률</div>
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

        {/* 상위 파트너 */}
        <Card>
          <CardHeader>
            <CardTitle>상위 성과 파트너</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((partner, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{partner.partner}</div>
                      <div className="text-sm text-muted-foreground">
                        {partner.contracts}건 계약
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-success">{partner.rate}%</div>
                    <div className="text-xs text-muted-foreground">달성률</div>
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