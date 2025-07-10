import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import KPICard from '@/components/KPICard'
import EventCard, { EventData } from '@/components/EventCard'

const Dashboard = () => {
  const [periodFilter, setPeriodFilter] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value)
    // 실제 데이터 필터링 로직이 여기에 들어갑니다
    console.log('Period filter changed to:', value)
  }
  
  // 샘플 데이터 - 추후 Supabase 연동 시 실제 데이터로 교체
  const kpiData = {
    totalContracts: { current: 234, target: 300, trend: 'up', trendValue: 12 },
    totalEstimates: { current: 567, target: 600, trend: 'up', trendValue: 8 },
    totalSqm: { current: 15420, target: 18000, trend: 'down', trendValue: -3 },
    monthlyRevenue: { current: 8500000, target: 10000000, trend: 'up', trendValue: 15 }
  }

  const recentEvents: EventData[] = [
    {
      id: '1',
      title: '신혼가구 타겟 라이브 쇼핑',
      type: '라이브커머스',
      status: '진행중',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      partner: '네이버 쇼핑라이브',
      targetContracts: 50,
      actualContracts: 32,
      targetEstimates: 120,
      actualEstimates: 95,
      targetSqm: 1500,
      actualSqm: 960,
      totalCost: 15000000,
      costPerSqm: 15625
    },
    {
      id: '2',
      title: '서울 베이비&키즈 페어 2024',
      type: '베이비페어',
      status: '완료',
      startDate: '2024-01-08',
      endDate: '2024-01-14',
      location: '킨텍스 제2전시장',
      partner: '베이비페어 조직위',
      targetContracts: 80,
      actualContracts: 95,
      targetEstimates: 200,
      actualEstimates: 215,
      targetSqm: 2400,
      actualSqm: 2850,
      totalCost: 28500000,
      costPerSqm: 10000
    },
    {
      id: '3',
      title: '분당 신도시 입주박람회',
      type: '입주박람회',
      status: '계획중',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      location: '분당 시티몰',
      partner: '분당신도시개발',
      targetContracts: 35,
      targetEstimates: 85,
      targetSqm: 1200,
      totalCost: 12000000,
      costPerSqm: 10000
    }
  ]

  const channelPerformanceData = [
    { channel: '라이브커머스', contracts: 145, estimates: 320, sqm: 4200, totalCost: 63000000, costPerSqm: 15000 },
    { channel: '베이비페어', contracts: 89, estimates: 180, sqm: 3100, totalCost: 46500000, costPerSqm: 15000 },
    { channel: '입주박람회', contracts: 67, estimates: 150, sqm: 2800, totalCost: 42000000, costPerSqm: 15000 },
    { channel: '인플루언서공구', contracts: 34, estimates: 90, sqm: 1500, totalCost: 22500000, costPerSqm: 15000 }
  ]

  const monthlyTrendData = [
    { month: '9월', contracts: 45, estimates: 120, sqm: 1200 },
    { month: '10월', contracts: 52, estimates: 135, sqm: 1350 },
    { month: '11월', contracts: 48, estimates: 125, sqm: 1280 },
    { month: '12월', contracts: 61, estimates: 148, sqm: 1580 },
    { month: '1월', contracts: 67, estimates: 165, sqm: 1720 }
  ]

  const getMaxValue = (data: typeof channelPerformanceData, key: keyof typeof channelPerformanceData[0]) => {
    return Math.max(...data.map(item => typeof item[key] === 'number' ? item[key] : 0))
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">외부채널 영업관리</h1>
          <p className="text-muted-foreground mt-2">
            제휴채널별 영업 성과와 주요 지표를 한눈에 확인하세요
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={periodFilter} onValueChange={handlePeriodChange}>
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
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded-md" 
            />
            <span>~</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded-md" 
            />
          </div>
        )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="총 계약건수"
          value={kpiData.totalContracts.current}
          target={kpiData.totalContracts.target}
          unit="건"
          trend={kpiData.totalContracts.trend as any}
          trendValue={kpiData.totalContracts.trendValue}
        />
        <KPICard
          title="총 견적건수"
          value={kpiData.totalEstimates.current}
          target={kpiData.totalEstimates.target}
          unit="건"
          trend={kpiData.totalEstimates.trend as any}
          trendValue={kpiData.totalEstimates.trendValue}
        />
        <KPICard
          title="총 계약장수"
          value={kpiData.totalSqm.current}
          target={kpiData.totalSqm.target}
          unit="장"
          trend={kpiData.totalSqm.trend as any}
          trendValue={kpiData.totalSqm.trendValue}
        />
        <KPICard
          title="장당비용"
          value={Math.round(kpiData.monthlyRevenue.current / kpiData.totalSqm.current)}
          unit="원"
          trend="down"
          trendValue={-5}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Channel Cost Per Unit */}
        <Card>
          <CardHeader>
            <CardTitle>채널별 장당비용</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelPerformanceData.map((item, index) => {
                const maxCost = Math.max(...channelPerformanceData.map(d => d.costPerSqm))
                const percentage = (item.costPerSqm / maxCost) * 100
                return (
                  <div key={item.channel} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{item.channel}</span>
                      <span className="text-muted-foreground">{item.costPerSqm.toLocaleString()}원/장</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>채널별 전체 성과</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {channelPerformanceData.map((channel) => (
              <div key={channel.channel} className="text-center space-y-2">
                <h4 className="font-semibold text-sm">{channel.channel}</h4>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-primary">{channel.contracts}건</div>
                  <div className="text-xs text-muted-foreground">계약건수</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">{channel.estimates}건</div>
                  <div className="text-xs text-muted-foreground">견적건수</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">{channel.sqm.toLocaleString()}장</div>
                  <div className="text-xs text-muted-foreground">계약장수</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">{channel.costPerSqm.toLocaleString()}원/장</div>
                  <div className="text-xs text-muted-foreground">장당비용</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>최근 이벤트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard