import React, { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import KPICard from '@/components/KPICard'
import EventCard, { EventData } from '@/components/EventCard'

const Dashboard = () => {
  const { toast } = useToast()
  const [periodFilter, setPeriodFilter] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const [filterKey, setFilterKey] = useState(0) // 강제 리렌더링용 key
  const [filteredData, setFilteredData] = useState<{
    message: string
    kpiData: {
      totalContracts: number
      totalEstimates: number
      totalSqm: number
      monthlyRevenue: number
    }
    channelData: Array<{
      channel: string
      contracts: number
      estimates: number
      sqm: number
      totalCost: number
      costPerSqm: number
    }>
    recentEvents: EventData[]
  } | null>(null)

  // 샘플 데이터 - 추후 Supabase 연동 시 실제 데이터로 교체
  const kpiData = {
    totalContracts: { current: 234, target: 300, trend: 'up', trendValue: 12 },
    totalEstimates: { current: 567, target: 600, trend: 'up', trendValue: 8 },
    totalSqm: { current: 15420, target: 18000, trend: 'down', trendValue: -3 },
    monthlyRevenue: { current: 8500000, target: 10000000, trend: 'up', trendValue: 15 }
  }

  const channelPerformanceData = [
    { channel: '라이브커머스', contracts: 145, estimates: 320, sqm: 4200, totalCost: 63000000, costPerSqm: 15000 },
    { channel: '베이비페어', contracts: 89, estimates: 180, sqm: 3100, totalCost: 46500000, costPerSqm: 15000 },
    { channel: '입주박람회', contracts: 67, estimates: 150, sqm: 2800, totalCost: 42000000, costPerSqm: 15000 },
    { channel: '인플루언서공구', contracts: 34, estimates: 90, sqm: 1500, totalCost: 22500000, costPerSqm: 15000 }
  ]

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

  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value)
    if (value !== 'custom') {
      setStartDate('')
      setEndDate('')
      setFilteredData(null)
      setFilterKey(prev => prev + 1) // 필터 초기화시에도 리렌더링
    }
  }

  // 개선된 필터링 함수 - 비동기 처리와 에러 핸들링 추가
  const filterData = useCallback(async (period: string, start: string, end: string) => {
    try {
      setIsFiltering(true)
      
      // 입력 검증
      if (period === 'custom' && (!start || !end)) {
        setFilteredData(null)
        return
      }

      // 짧은 딜레이로 로딩 상태 표시 (UX 개선)
      await new Promise(resolve => setTimeout(resolve, 300))

      let multiplier = 1
      
      // 기간별 데이터 조정 배율 설정
      if (period === 'monthly' && start) {
        multiplier = 0.8 // 월간은 80%
      } else if (period === 'quarterly' && start) {
        multiplier = 1.2 // 분기별은 120%
      } else if (period === 'custom' && start && end) {
        multiplier = 0.9 // 사용자 정의는 90%
      } else {
        return
      }

      // 필터링된 KPI 데이터 생성
      const filteredKpiData = {
        totalContracts: Math.round(kpiData.totalContracts.current * multiplier),
        totalEstimates: Math.round(kpiData.totalEstimates.current * multiplier),
        totalSqm: Math.round(kpiData.totalSqm.current * multiplier),
        monthlyRevenue: Math.round(kpiData.monthlyRevenue.current * multiplier)
      }

      // 필터링된 채널 데이터 생성
      const filteredChannelData = channelPerformanceData.map(channel => ({
        ...channel,
        contracts: Math.round(channel.contracts * multiplier),
        estimates: Math.round(channel.estimates * multiplier),
        sqm: Math.round(channel.sqm * multiplier),
        totalCost: Math.round(channel.totalCost * multiplier),
        costPerSqm: Math.round(channel.totalCost * multiplier / (channel.sqm * multiplier))
      }))

      // 필터링된 이벤트 데이터
      const filteredEvents = recentEvents.filter(event => {
        if (period === 'monthly' && start) {
          const eventDate = new Date(event.startDate)
          const [year, month] = start.split('-')
          return eventDate.getFullYear().toString() === year && 
                 (eventDate.getMonth() + 1).toString().padStart(2, '0') === month
        } else if (period === 'quarterly' && start) {
          const eventDate = new Date(event.startDate)
          const year = eventDate.getFullYear()
          const quarter = Math.ceil((eventDate.getMonth() + 1) / 3)
          return start === `${year}-Q${quarter}`
        } else if (period === 'custom' && start && end) {
          const eventDate = new Date(event.startDate)
          return eventDate >= new Date(start) && eventDate <= new Date(end)
        }
        return true
      })

      // 메시지 생성
      let message = ''
      if (period === 'monthly' && start) {
        const [year, month] = start.split('-')
        message = `${year}년 ${parseInt(month)}월 데이터`
      } else if (period === 'quarterly' && start) {
        const quarterMap = {
          '2024-Q1': '2024년 1분기',
          '2024-Q2': '2024년 2분기',
          '2024-Q3': '2024년 3분기',
          '2024-Q4': '2024년 4분기'
        }
        message = quarterMap[start as keyof typeof quarterMap] || start
      } else if (period === 'custom' && start && end) {
        message = `${start} ~ ${end}`
      }

      const newFilteredData = {
        message,
        kpiData: filteredKpiData,
        channelData: filteredChannelData,
        recentEvents: filteredEvents
      }

      // 강제 리렌더링을 위한 key 변경
      setFilterKey(prev => prev + 1)
      setFilteredData(newFilteredData)
      
      // 성공 메시지
      toast({
        title: "필터링 완료",
        description: `${message} 데이터로 필터링되었습니다.`,
      })

    } catch (error) {
      console.error('필터링 중 오류 발생:', error)
      toast({
        title: "필터링 실패",
        description: "데이터 필터링 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      setIsFiltering(false)
    }
  }, [kpiData, channelPerformanceData, recentEvents, toast])

  // filteredData 변화 모니터링
  React.useEffect(() => {
    console.log('filteredData 상태 변경됨:', filteredData)
  }, [filteredData])

  // 날짜 변경시 자동 필터링
  React.useEffect(() => {
    if (periodFilter === 'custom' && startDate && endDate) {
      filterData(periodFilter, startDate, endDate)
    }
  }, [startDate, endDate, periodFilter, filterData])

  // 필터 초기화 함수
  const resetFilter = useCallback(() => {
    setFilteredData(null)
    setFilterKey(prev => prev + 1)
    setPeriodFilter('monthly')
    setStartDate('')
    setEndDate('')
    toast({
      title: "필터 초기화",
      description: "모든 필터가 초기화되었습니다.",
    })
  }, [toast])

  // 현재 표시할 데이터 계산 (memoization으로 성능 최적화)
  const displayData = useMemo(() => ({
    kpi: filteredData?.kpiData ?? {
      totalContracts: kpiData.totalContracts.current,
      totalEstimates: kpiData.totalEstimates.current,
      totalSqm: kpiData.totalSqm.current,
      monthlyRevenue: kpiData.monthlyRevenue.current
    },
    channels: filteredData?.channelData ?? channelPerformanceData,
    events: filteredData?.recentEvents ?? recentEvents
  }), [filteredData, kpiData, channelPerformanceData, recentEvents])

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
          
          {periodFilter === 'monthly' && (
            <Select onValueChange={(value) => filterData('monthly', value, '')}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="월 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01">2024년 1월</SelectItem>
                <SelectItem value="2024-02">2024년 2월</SelectItem>
                <SelectItem value="2024-03">2024년 3월</SelectItem>
                <SelectItem value="2024-04">2024년 4월</SelectItem>
                <SelectItem value="2024-05">2024년 5월</SelectItem>
                <SelectItem value="2024-06">2024년 6월</SelectItem>
                <SelectItem value="2024-07">2024년 7월</SelectItem>
                <SelectItem value="2024-08">2024년 8월</SelectItem>
                <SelectItem value="2024-09">2024년 9월</SelectItem>
                <SelectItem value="2024-10">2024년 10월</SelectItem>
                <SelectItem value="2024-11">2024년 11월</SelectItem>
                <SelectItem value="2024-12">2024년 12월</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          {periodFilter === 'quarterly' && (
            <Select onValueChange={(value) => filterData('quarterly', value, '')}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="분기 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-Q1">2024년 1분기</SelectItem>
                <SelectItem value="2024-Q2">2024년 2분기</SelectItem>
                <SelectItem value="2024-Q3">2024년 3분기</SelectItem>
                <SelectItem value="2024-Q4">2024년 4분기</SelectItem>
              </SelectContent>
            </Select>
          )}
          
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
          
          <button 
            onClick={() => {
              if (periodFilter === 'custom' && startDate && endDate) {
                filterData(periodFilter, startDate, endDate)
              }
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            disabled={periodFilter === 'custom' && (!startDate || !endDate)}
          >
            검색
          </button>
        </div>
      </div>

      {/* 필터링 상태 표시 */}
      {isFiltering && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3 shadow-lg">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-lg font-medium">데이터 필터링 중...</span>
          </div>
        </div>
      )}

      {/* KPI Cards - 강제 리렌더링을 위한 key 추가 */}
      <div key={`kpi-cards-${filterKey}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredData && (
          <div className="col-span-full animate-fade-in">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 mb-4 flex justify-between items-center">
              <div>
                <p className="text-primary font-medium flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
                  필터링됨: {filteredData.message}
                </p>
                <p className="text-primary/70 text-sm">
                  계약건수: {displayData.kpi.totalContracts.toLocaleString()}건 
                  (원본: {kpiData.totalContracts.current.toLocaleString()}건)
                </p>
              </div>
              <Button 
                onClick={resetFilter}
                variant="secondary"
                size="sm"
                className="hover-scale"
              >
                필터 초기화
              </Button>
            </div>
          </div>
        )}
        
        <div key={`contracts-${filterKey}`} className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <KPICard
            title="총 계약건수"
            value={displayData.kpi.totalContracts}
            target={kpiData.totalContracts.target}
            unit="건"
            trend={kpiData.totalContracts.trend as any}
            trendValue={kpiData.totalContracts.trendValue}
          />
        </div>
        
        <div key={`estimates-${filterKey}`} className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <KPICard
            title="총 견적건수"
            value={displayData.kpi.totalEstimates}
            target={kpiData.totalEstimates.target}
            unit="건"
            trend={kpiData.totalEstimates.trend as any}
            trendValue={kpiData.totalEstimates.trendValue}
          />
        </div>
        
        <div key={`sqm-${filterKey}`} className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <KPICard
            title="총 계약장수"
            value={displayData.kpi.totalSqm}
            target={kpiData.totalSqm.target}
            unit="장"
            trend={kpiData.totalSqm.trend as any}
            trendValue={kpiData.totalSqm.trendValue}
          />
        </div>
        
        <div key={`cost-${filterKey}`} className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <KPICard
            title="장당비용"
            value={Math.round(displayData.kpi.monthlyRevenue / displayData.kpi.totalSqm)}
            unit="원"
            trend="down"
            trendValue={-5}
          />
        </div>
      </div>

      {/* Charts Section - 강제 리렌더링과 애니메이션 적용 */}
      <div key={`charts-${filterKey}`} className="grid grid-cols-1 gap-6">
        {/* Channel Cost Per Unit */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              채널별 장당비용
              {filteredData && (
                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  필터링됨
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayData.channels.map((item, index) => {
                const maxCost = Math.max(...displayData.channels.map(d => d.costPerSqm))
                const percentage = (item.costPerSqm / maxCost) * 100
                return (
                  <div 
                    key={`${item.channel}-${filterKey}`} 
                    className="space-y-2 animate-fade-in" 
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{item.channel}</span>
                      <span className="text-muted-foreground">{item.costPerSqm.toLocaleString()}원/장</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-primary transition-all duration-1000 hover-scale"
                        style={{ 
                          width: `${percentage}%`,
                          transitionDelay: `${0.8 + index * 0.1}s`
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Statistics - 강제 리렌더링과 애니메이션 적용 */}
      <Card key={`stats-${filterKey}`} className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            채널별 전체 성과
            {filteredData && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                필터링됨
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayData.channels.map((channel, index) => (
              <div 
                key={`${channel.channel}-stats-${filterKey}`} 
                className="text-center space-y-2 animate-fade-in hover-scale p-4 rounded-lg border border-border/50 bg-card/50"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <h4 className="font-semibold text-sm">{channel.channel}</h4>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-primary">{channel.contracts.toLocaleString()}건</div>
                  <div className="text-xs text-muted-foreground">계약건수</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">{channel.estimates.toLocaleString()}건</div>
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

      {/* Recent Events - 강제 리렌더링과 애니메이션 적용 */}
      <Card key={`events-${filterKey}`} className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            최근 이벤트
            {filteredData && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {displayData.events.length}건 표시
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayData.events.map((event, index) => (
              <div 
                key={`${event.id}-${filterKey}`}
                className="animate-fade-in"
                style={{ animationDelay: `${1.0 + index * 0.1}s` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
          {displayData.events.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              선택한 기간에 해당하는 이벤트가 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard