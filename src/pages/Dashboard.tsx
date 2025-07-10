import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import KPICard from '@/components/KPICard'
import EventCard, { EventData } from '@/components/EventCard'

const Dashboard = () => {
  const [periodFilter, setPeriodFilter] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
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

  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value)
    if (value !== 'custom') {
      setStartDate('')
      setEndDate('')
      setFilteredData(null)
    }
  }

  const filterData = (period: string, start: string, end: string) => {
    let multiplier = 1
    
    // 기간별 데이터 조정 배율 설정
    if (period === 'monthly' && start) {
      multiplier = 0.8 // 월간은 80%
    } else if (period === 'quarterly' && start) {
      multiplier = 1.2 // 분기별은 120%
    } else if (period === 'custom' && start && end) {
      multiplier = 0.9 // 사용자 정의는 90%
    } else {
      if (period === 'custom' && (!start || !end)) {
        setFilteredData(null)
      }
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
      totalCost: Math.round(channel.totalCost * multiplier)
    }))

    // 필터링된 이벤트 데이터 (기간에 따라 실제 필터링 적용)
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
      message = `${year}년 ${parseInt(month)}월 데이터로 필터링됨`
    } else if (period === 'quarterly' && start) {
      const quarterMap = {
        '2024-Q1': '2024년 1분기',
        '2024-Q2': '2024년 2분기',
        '2024-Q3': '2024년 3분기',
        '2024-Q4': '2024년 4분기'
      }
      message = `${quarterMap[start as keyof typeof quarterMap]} 데이터로 필터링됨`
    } else if (period === 'custom' && start && end) {
      message = `${start}부터 ${end}까지 데이터로 필터링됨`
    }

    console.log('=== 필터링 실행 ===', {
      message,
      originalContracts: kpiData.totalContracts.current,
      filteredContracts: filteredKpiData.totalContracts,
      multiplier,
      period,
      start,
      end
    })

    const newFilteredData = {
      message,
      kpiData: filteredKpiData,
      channelData: filteredChannelData,
      recentEvents: filteredEvents
    }

    console.log('새로 설정할 filteredData:', newFilteredData)
    setFilteredData(newFilteredData)
  }

  // filteredData 변화 모니터링
  React.useEffect(() => {
    console.log('filteredData 상태 변경됨:', filteredData)
  }, [filteredData])

  // 날짜 변경시 자동 필터링
  React.useEffect(() => {
    if (periodFilter === 'custom' && startDate && endDate) {
      filterData(periodFilter, startDate, endDate)
    }
  }, [startDate, endDate, periodFilter])
  
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredData && (
          <div className="col-span-full">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex justify-between items-center">
              <div>
                <p className="text-blue-800 font-medium">{filteredData.message}</p>
                <p className="text-blue-600 text-sm">필터링된 계약건수: {filteredData.kpiData.totalContracts}건</p>
              </div>
              <button 
                onClick={() => setFilteredData(null)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
              >
                필터 초기화
              </button>
            </div>
          </div>
        )}
        
        <KPICard
          title="총 계약건수"
          value={(() => {
            const value = filteredData?.kpiData.totalContracts ?? kpiData.totalContracts.current
            console.log('=== KPI Card 렌더링 - 총 계약건수 ===', { 
              hasFilteredData: !!filteredData,
              filteredValue: filteredData?.kpiData.totalContracts, 
              originalValue: kpiData.totalContracts.current, 
              finalValue: value,
              filteredDataObject: filteredData
            })
            return value
          })()}
          target={kpiData.totalContracts.target}
          unit="건"
          trend={kpiData.totalContracts.trend as any}
          trendValue={kpiData.totalContracts.trendValue}
        />
        <KPICard
          title="총 견적건수"
          value={(() => {
            const value = filteredData?.kpiData.totalEstimates ?? kpiData.totalEstimates.current
            console.log('=== KPI Card 렌더링 - 총 견적건수 ===', { 
              hasFilteredData: !!filteredData,
              filteredValue: filteredData?.kpiData.totalEstimates, 
              originalValue: kpiData.totalEstimates.current, 
              finalValue: value 
            })
            return value
          })()}
          target={kpiData.totalEstimates.target}
          unit="건"
          trend={kpiData.totalEstimates.trend as any}
          trendValue={kpiData.totalEstimates.trendValue}
        />
        <KPICard
          title="총 계약장수"
          value={(() => {
            const value = filteredData?.kpiData.totalSqm ?? kpiData.totalSqm.current
            console.log('=== KPI Card 렌더링 - 총 계약장수 ===', { 
              hasFilteredData: !!filteredData,
              filteredValue: filteredData?.kpiData.totalSqm, 
              originalValue: kpiData.totalSqm.current, 
              finalValue: value 
            })
            return value
          })()}
          target={kpiData.totalSqm.target}
          unit="장"
          trend={kpiData.totalSqm.trend as any}
          trendValue={kpiData.totalSqm.trendValue}
        />
        <KPICard
          title="장당비용"
          value={(() => {
            const value = filteredData?.kpiData.monthlyRevenue ? Math.round(filteredData.kpiData.monthlyRevenue / filteredData.kpiData.totalSqm) : Math.round(kpiData.monthlyRevenue.current / kpiData.totalSqm.current)
            console.log('=== KPI Card 렌더링 - 장당비용 ===', { 
              hasFilteredData: !!filteredData,
              filteredRevenue: filteredData?.kpiData.monthlyRevenue,
              filteredSqm: filteredData?.kpiData.totalSqm,
              originalRevenue: kpiData.monthlyRevenue.current,
              originalSqm: kpiData.totalSqm.current,
              finalValue: value 
            })
            return value
          })()}
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
              {(filteredData?.channelData ?? channelPerformanceData).map((item, index) => {
                const dataToUse = filteredData?.channelData ?? channelPerformanceData
                const maxCost = Math.max(...dataToUse.map(d => d.costPerSqm))
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
            {(filteredData?.channelData ?? channelPerformanceData).map((channel) => (
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
            {(filteredData?.recentEvents ?? recentEvents).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard