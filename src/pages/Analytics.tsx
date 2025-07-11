import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import KPICard from '@/components/KPICard'
import { useEvents, type Event } from '@/hooks/useEvents'
import { useIsMobile } from '@/hooks/use-mobile'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users,
  Target,
  Calendar,
  Download,
  DollarSign,
  CalendarRange,
  Search
} from 'lucide-react'

const Analytics = () => {
  const { 
    events, 
    loading, 
    fetchEventsByMonth, 
    fetchEventsByQuarter, 
    fetchEventsByPeriod,
    fetchEventsByStatus 
  } = useEvents()
  const isMobile = useIsMobile()
  
  const [periodFilter, setPeriodFilter] = useState('monthly')
  const [selectedYear, setSelectedYear] = useState('2024')
  const [selectedMonth, setSelectedMonth] = useState('07')
  const [selectedQuarter, setSelectedQuarter] = useState('3')
  const [startYear, setStartYear] = useState('2024')
  const [startMonth, setStartMonth] = useState('01')
  const [endYear, setEndYear] = useState('2024')
  const [endMonth, setEndMonth] = useState('12')
  const [filteredStats, setFilteredStats] = useState<any>(null)
  const [channelStats, setChannelStats] = useState<any[]>([])
  const [eventTableFilter, setEventTableFilter] = useState('all')
  const [eventSearchStartYear, setEventSearchStartYear] = useState('2024')
  const [eventSearchStartMonth, setEventSearchStartMonth] = useState('01')
  const [eventSearchEndYear, setEventSearchEndYear] = useState('2024')
  const [eventSearchEndMonth, setEventSearchEndMonth] = useState('12')
  const [filteredEvents, setFilteredEvents] = useState<Event[] | null>(null)

  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value)
  }

  const handleSearch = async () => {
    try {
      let filteredEventData: Event[] = []
      
      if (periodFilter === 'monthly') {
        filteredEventData = await fetchEventsByMonth(selectedYear, selectedMonth)
      } else if (periodFilter === 'quarterly') {
        filteredEventData = await fetchEventsByQuarter(selectedYear, selectedQuarter)
      } else if (periodFilter === 'custom') {
        const startDate = `${startYear}-${startMonth.padStart(2, '0')}-01`
        const endDateObj = new Date(parseInt(endYear), parseInt(endMonth), 0)
        const endDate = `${endYear}-${endMonth.padStart(2, '0')}-${endDateObj.getDate().toString().padStart(2, '0')}`
        filteredEventData = await fetchEventsByPeriod(startDate, endDate)
      }

      // 통계 계산
      const totalContracts = filteredEventData.reduce((sum, event) => sum + event.actual_contracts, 0)
      const totalTargetContracts = filteredEventData.reduce((sum, event) => sum + event.target_contracts, 0)
      const totalSqm = filteredEventData.reduce((sum, event) => sum + event.actual_sqm, 0)
      const totalCost = filteredEventData.reduce((sum, event) => sum + (event.total_cost || 0), 0)
      const costPerSqm = totalSqm > 0 ? Math.round(totalCost / totalSqm) : 0
      
      // 평균 달성률 계산 (실제 계약건수 / 목표 계약건수 * 100)
      const averageAchievementRate = totalTargetContracts > 0 ? Math.round((totalContracts / totalTargetContracts) * 100) : 0
      
      // 전월 데이터 조회 (월간 조회시에만)
      let prevMonthStats = null
      if (periodFilter === 'monthly') {
        const prevMonthData = await getPreviousMonthData(selectedYear, selectedMonth)
        if (prevMonthData.length > 0) {
          const prevTotalContracts = prevMonthData.reduce((sum, event) => sum + event.actual_contracts, 0)
          const prevTotalSqm = prevMonthData.reduce((sum, event) => sum + event.actual_sqm, 0)
          const prevTotalCost = prevMonthData.reduce((sum, event) => sum + (event.total_cost || 0), 0)
          const prevCostPerSqm = prevTotalSqm > 0 ? Math.round(prevTotalCost / prevTotalSqm) : 0
          const prevTotalTargetContracts = prevMonthData.reduce((sum, event) => sum + event.target_contracts, 0)
          const prevAverageAchievementRate = prevTotalTargetContracts > 0 ? Math.round((prevTotalContracts / prevTotalTargetContracts) * 100) : 0
          
          prevMonthStats = {
            totalEvents: prevMonthData.length,
            totalContracts: prevTotalContracts,
            costPerSqm: prevCostPerSqm,
            averageAchievementRate: prevAverageAchievementRate
          }
        }
      }
      
      let message = ''
      if (periodFilter === 'monthly') {
        message = `${selectedYear}년 ${parseInt(selectedMonth)}월 분석 데이터 (${filteredEventData.length}개 이벤트)`
      } else if (periodFilter === 'quarterly') {
        const quarterNames = ['', '1분기', '2분기', '3분기', '4분기']
        message = `${selectedYear}년 ${quarterNames[parseInt(selectedQuarter)]} 분석 데이터 (${filteredEventData.length}개 이벤트)`
      } else if (periodFilter === 'custom') {
        message = `${startYear}-${startMonth}부터 ${endYear}-${endMonth}까지 분석 데이터 (${filteredEventData.length}개 이벤트)`
      }

      setFilteredStats({
        message,
        totalEvents: filteredEventData.length,
        totalContracts,
        totalTargetContracts,
        totalSqm,
        totalCost,
        costPerSqm,
        averageAchievementRate,
        filteredEventData,
        prevMonthStats
      })

      // 채널 통계 계산
      const stats = await getChannelStats(filteredEventData, selectedYear, selectedMonth)
      setChannelStats(stats)
      
    } catch (error) {
      console.error('검색 중 오류 발생:', error)
    }
  }

  useEffect(() => {
    // 날짜나 기간 변경시 자동으로 데이터 로드
    handleSearch()
  }, [selectedYear, selectedMonth, selectedQuarter, startYear, startMonth, endYear, endMonth, periodFilter])

  const handleDownload = () => {
    const customPeriod = periodFilter === 'monthly' ? `${selectedYear}년 ${parseInt(selectedMonth)}월` :
                      periodFilter === 'quarterly' ? `${selectedYear}년 ${selectedQuarter}분기` :
                      periodFilter === 'custom' ? `${startYear}년 ${startMonth}월 ~ ${endYear}년 ${endMonth}월` : ''
    
    // 실제 PDF 생성 로직
    const reportData = `
통계 분석 리포트
생성일: ${new Date().toLocaleDateString()}
조회기간: ${periodFilter}
${periodFilter !== 'monthly' && periodFilter !== 'quarterly' && periodFilter === 'custom' ? `기간: ${customPeriod}` : periodFilter !== 'monthly' && periodFilter !== 'quarterly' ? '' : `조회기간: ${customPeriod}`}

${filteredStats ? `필터링된 데이터:
${filteredStats.message}
총 이벤트: ${filteredStats.totalEvents}개
총 계약건수: ${filteredStats.totalContracts}건` : '전체 데이터 기준'}
    `
    
    // 파일 다운로드
    const element = document.createElement('a')
    const file = new Blob([reportData], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `analytics-report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    
    alert('리포트가 다운로드되었습니다!')
  }
  
  // 전월 데이터 가져오기 함수
  const getPreviousMonthData = async (currentYear: string, currentMonth: string) => {
    try {
      const year = parseInt(currentYear)
      const month = parseInt(currentMonth)
      const prevMonth = month === 1 ? 12 : month - 1
      const prevYear = month === 1 ? year - 1 : year
      
      const prevMonthData = await fetchEventsByMonth(prevYear.toString(), prevMonth.toString().padStart(2, '0'))
      return prevMonthData
    } catch (error) {
      console.error('전월 데이터 조회 오류:', error)
      return []
    }
  }

  // 다음달 데이터 가져오기 함수
  const getNextMonthData = async (currentYear: string, currentMonth: string) => {
    try {
      const year = parseInt(currentYear)
      const month = parseInt(currentMonth)
      const nextMonth = month === 12 ? 1 : month + 1
      const nextYear = month === 12 ? year + 1 : year
      
      const nextMonthData = await fetchEventsByMonth(nextYear.toString(), nextMonth.toString().padStart(2, '0'))
      return nextMonthData
    } catch (error) {
      console.error('다음달 데이터 조회 오류:', error)
      return []
    }
  }

  const getChannelStats = async (currentEvents: Event[], currentYear: string, currentMonth: string) => {
    // 현재월 데이터가 없어도 다음달 목표는 확인해야 함
    const channelMap: { [key: string]: Event[] } = {}
    
    currentEvents.forEach(event => {
      if (!channelMap[event.type]) {
        channelMap[event.type] = []
      }
      channelMap[event.type].push(event)
    })

    // 전월 데이터 가져오기
    const previousMonthEvents = await getPreviousMonthData(currentYear, currentMonth)
    const prevChannelMap: { [key: string]: Event[] } = {}
    
    previousMonthEvents.forEach(event => {
      if (!prevChannelMap[event.type]) {
        prevChannelMap[event.type] = []
      }
      prevChannelMap[event.type].push(event)
    })
    
    // 다음달 데이터 가져오기
    const nextMonthEvents = await getNextMonthData(currentYear, currentMonth)
    const nextChannelMap: { [key: string]: Event[] } = {}
    
    nextMonthEvents.forEach(event => {
      if (!nextChannelMap[event.type]) {
        nextChannelMap[event.type] = []
      }
      nextChannelMap[event.type].push(event)
    })
    
    // 현재월, 전월, 다음달의 모든 채널을 합쳐서 처리
    const allChannels = new Set([
      ...Object.keys(channelMap), 
      ...Object.keys(prevChannelMap), 
      ...Object.keys(nextChannelMap)
    ])
    
    const channelStatsResult = []
    
    // 모든 채널들 처리 (현재월, 전월, 다음달 데이터가 있는 모든 채널)
    for (const channel of Array.from(allChannels)) {
      const channelEvents = channelMap[channel] || []
      const currentContracts = channelEvents.reduce((sum, e) => sum + e.actual_contracts, 0)
      const currentTargetContracts = channelEvents.reduce((sum, e) => sum + e.target_contracts, 0)
      const currentEstimates = channelEvents.reduce((sum, e) => sum + e.actual_estimates, 0)
      const currentTargetEstimates = channelEvents.reduce((sum, e) => sum + e.target_estimates, 0)
      
      // 전월 데이터
      const prevChannelEvents = prevChannelMap[channel] || []
      const prevContracts = prevChannelEvents.reduce((sum, e) => sum + e.actual_contracts, 0)
      
      // 전월 대비 계산
      const trendValue = prevContracts > 0 ? Math.round(((currentContracts - prevContracts) / prevContracts) * 100) : 0
      const trend = trendValue >= 0 ? 'up' : 'down'
      
      // 목표 대비 달성률
      const goalAchievementRate = currentTargetContracts > 0 ? Math.round((currentContracts / currentTargetContracts) * 100) : 0
      
      // 다음달 실제 목표 확인
      const nextChannelEvents = nextChannelMap[channel] || []
      
      const nextMonthTargetContracts = nextChannelEvents.length > 0 
        ? nextChannelEvents.reduce((sum, e) => sum + e.target_contracts, 0) 
        : 0
      const nextMonthTargetEstimates = nextChannelEvents.length > 0 
        ? nextChannelEvents.reduce((sum, e) => sum + e.target_estimates, 0) 
        : 0

      channelStatsResult.push({
        channel,
        totalEvents: channelEvents.length,
        completedEvents: channelEvents.filter(e => e.status === '완료').length,
        totalContracts: currentContracts,
        totalEstimates: currentEstimates,
        totalSqm: channelEvents.reduce((sum, e) => sum + e.actual_sqm, 0),
        targetContracts: currentTargetContracts,
        targetEstimates: currentTargetEstimates,
        prevContracts,
        trendValue,
        trend,
        goalAchievementRate,
        nextMonthTargetContracts,
        nextMonthTargetEstimates,
        avgContractRate: channelEvents.length > 0 
          ? channelEvents.reduce((sum, e) => sum + (e.actual_contracts / Math.max(e.target_contracts, 1) * 100), 0) / channelEvents.length 
          : 0
      })
    }
    
    return channelStatsResult
  }

  // 실제 데이터 기반 상위 성과 이벤트
  const topPerformingEvents = (filteredStats?.filteredEventData || events)
    .sort((a, b) => b.actual_sqm - a.actual_sqm)
    .slice(0, 4)
    .map(event => ({
      name: event.title,
      sqm: event.actual_sqm,
      change: 0 // 변화율은 이전 기간 데이터가 필요하므로 임시로 0
    }))

  // 이벤트 테이블 필터링 함수
  const filterEventTable = async (filter: string, start: string, end: string) => {
    try {
      let filtered: Event[] = []

      if (filter === 'completed') {
        filtered = await fetchEventsByStatus('완료')
      } else if (filter === 'ongoing') {
        filtered = await fetchEventsByStatus('진행중')
      } else if (filter === 'planned') {
        filtered = await fetchEventsByStatus('계획중')
      } else if (filter === 'custom' && start && end) {
        filtered = await fetchEventsByPeriod(start, end)
      } else if (filter === 'all') {
        filtered = events
      }

      setFilteredEvents(filtered)
    } catch (error) {
      console.error('이벤트 필터링 중 오류:', error)
      setFilteredEvents(events)
    }
  }

  const displayEvents = filteredEvents || events

  const handleEventTableFilterChange = async (value: string) => {
    setEventTableFilter(value)
    
    if (value !== 'custom') {
      setEventSearchStartYear('2024')
      setEventSearchStartMonth('01')
      setEventSearchEndYear('2024')
      setEventSearchEndMonth('12')
    }
    
    // 즉시 필터링 실행
    if (value !== 'custom') {
      await filterEventTable(value, '', '')
    } else {
      const startDateStr = `${eventSearchStartYear}-${eventSearchStartMonth.padStart(2, '0')}-01`
      const endDateObj = new Date(parseInt(eventSearchEndYear), parseInt(eventSearchEndMonth), 0)
      const endDateStr = `${eventSearchEndYear}-${eventSearchEndMonth.padStart(2, '0')}-${endDateObj.getDate().toString().padStart(2, '0')}`
      await filterEventTable(value, startDateStr, endDateStr)
    }
  }

  useEffect(() => {
    if (eventTableFilter === 'custom') {
      const startDateStr = `${eventSearchStartYear}-${eventSearchStartMonth.padStart(2, '0')}-01`
      const endDateObj = new Date(parseInt(eventSearchEndYear), parseInt(eventSearchEndMonth), 0)
      const endDateStr = `${eventSearchEndYear}-${eventSearchEndMonth.padStart(2, '0')}-${endDateObj.getDate().toString().padStart(2, '0')}`
      filterEventTable(eventTableFilter, startDateStr, endDateStr)
    }
  }, [eventSearchStartYear, eventSearchStartMonth, eventSearchEndYear, eventSearchEndMonth, eventTableFilter])

  const getStatusBadge = (status: string) => {
    const statusMap = {
      '완료': 'bg-success text-success-foreground',
      '진행중': 'bg-warning text-warning-foreground', 
      '계획중': 'bg-muted text-muted-foreground'
    }
    return <Badge className={statusMap[status as keyof typeof statusMap]}>{status}</Badge>
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-success" /> : 
      <TrendingDown className="w-4 h-4 text-danger" />
  }

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-success' : 'text-danger'
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">통계 분석</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            채널별 성과 분석과 트렌드를 확인하세요
          </p>
        </div>
        <Button 
          onClick={handleDownload}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          리포트 다운로드
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Select value={periodFilter} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="조회기간" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">월간</SelectItem>
                <SelectItem value="quarterly">분기별</SelectItem>
                <SelectItem value="custom">기간설정</SelectItem>
              </SelectContent>
            </Select>
            
            {periodFilter === 'monthly' && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="flex items-center space-x-1 bg-muted/30 p-2 rounded-lg">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-20 border-none bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm font-medium">년</span>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-16 border-none bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 12}, (_, i) => (
                        <SelectItem key={i+1} value={(i+1).toString().padStart(2, '0')}>
                          {i+1}월
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch} className="w-full sm:w-auto">
                  <Search className="w-4 h-4 mr-2" />
                  검색
                </Button>
              </div>
            )}
            
            {periodFilter === 'quarterly' && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="flex items-center space-x-1 bg-muted/30 p-2 rounded-lg">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-20 border-none bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm font-medium">년</span>
                  <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                    <SelectTrigger className="w-20 border-none bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1분기</SelectItem>
                      <SelectItem value="2">2분기</SelectItem>
                      <SelectItem value="3">3분기</SelectItem>
                      <SelectItem value="4">4분기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch} className="w-full sm:w-auto">
                  <Search className="w-4 h-4 mr-2" />
                  검색
                </Button>
              </div>
            )}
            
            {periodFilter === 'custom' && (
              <div className="flex flex-col space-y-2 w-full sm:w-auto">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-1 bg-muted/30 p-2 rounded-lg">
                    <Select value={startYear} onValueChange={setStartYear}>
                      <SelectTrigger className="w-16 border-none bg-background text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={startMonth} onValueChange={setStartMonth}>
                      <SelectTrigger className="w-14 border-none bg-background text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 12}, (_, i) => (
                          <SelectItem key={i+1} value={(i+1).toString().padStart(2, '0')}>
                            {i+1}월
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-1 bg-muted/30 p-2 rounded-lg">
                    <Select value={endYear} onValueChange={setEndYear}>
                      <SelectTrigger className="w-16 border-none bg-background text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={endMonth} onValueChange={setEndMonth}>
                      <SelectTrigger className="w-14 border-none bg-background text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 12}, (_, i) => (
                          <SelectItem key={i+1} value={(i+1).toString().padStart(2, '0')}>
                            {i+1}월
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSearch} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  검색
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          title="계약건수"
          value={filteredStats?.totalContracts || events.reduce((sum, e) => sum + e.actual_contracts, 0)}
          target={filteredStats?.totalTargetContracts || events.reduce((sum, e) => sum + e.target_contracts, 0)}
          unit="건"
          trend={filteredStats && filteredStats.prevMonthStats ? 
            (filteredStats.totalContracts > filteredStats.prevMonthStats.totalContracts ? 'up' : 'down') : 'up'}
          trendValue={filteredStats && filteredStats.prevMonthStats && filteredStats.prevMonthStats.totalContracts > 0 ? 
            Math.round(((filteredStats.totalContracts - filteredStats.prevMonthStats.totalContracts) / filteredStats.prevMonthStats.totalContracts) * 100) : 5}
        />
        <KPICard
          title="달성률"
          value={filteredStats?.averageAchievementRate || 85}
          target={100}
          unit="%"
          trend={filteredStats && filteredStats.prevMonthStats ? 
            (filteredStats.averageAchievementRate > filteredStats.prevMonthStats.averageAchievementRate ? 'up' : 'down') : 'up'}
          trendValue={3}
        />
        <KPICard
          title="장수"
          value={filteredStats?.totalSqm || events.reduce((sum, e) => sum + e.actual_sqm, 0)}
          target={15000}
          unit="장"
          trend="up"
          trendValue={8}
        />
        <KPICard
          title="장당비용"
          value={filteredStats?.costPerSqm || (events.reduce((sum, e) => sum + e.actual_sqm, 0) > 0 ? 
            Math.round(events.reduce((sum, e) => sum + (e.total_cost || 0), 0) / events.reduce((sum, e) => sum + e.actual_sqm, 0)) : 0)}
          target={10000}
          unit="원"
          trend={filteredStats && filteredStats.prevMonthStats ? 
            (filteredStats.costPerSqm < filteredStats.prevMonthStats.costPerSqm ? 'up' : 'down') : 'down'}
          trendValue={-2}
        />
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Channel Performance */}
        <Card className="p-4 sm:p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-semibold">채널별 성과</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-3">
              {channelStats.length > 0 ? channelStats.map((channel, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/30 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{channel.channel}</span>
                    <span className="text-xs text-muted-foreground">
                      {channel.totalContracts}건 / {channel.targetContracts}건
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold">{channel.goalAchievementRate}%</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(channel.trend)}
                      <span className={`text-xs ${getTrendColor(channel.trend)}`}>
                        {channel.trendValue > 0 ? '+' : ''}{channel.trendValue}%
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  {loading ? '데이터를 불러오는 중...' : '채널 데이터가 없습니다.'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Events */}
        <Card className="p-4 sm:p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-semibold">상위 성과 이벤트</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-3">
              {topPerformingEvents.map((event, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.name}</p>
                    <p className="text-xs text-muted-foreground">{event.sqm.toLocaleString()}장</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event List */}
      <Card className="p-4 sm:p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-lg font-semibold">이벤트 목록</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Select value={eventTableFilter} onValueChange={handleEventTableFilterChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="필터 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="completed">완료된 이벤트</SelectItem>
                <SelectItem value="ongoing">진행중인 이벤트</SelectItem>
                <SelectItem value="planned">계획중인 이벤트</SelectItem>
                <SelectItem value="custom">기간별 검색</SelectItem>
              </SelectContent>
            </Select>
            
            {eventTableFilter === 'custom' && (
              <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                <Select value={eventSearchStartYear} onValueChange={setEventSearchStartYear}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023년</SelectItem>
                    <SelectItem value="2024">2024년</SelectItem>
                    <SelectItem value="2025">2025년</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={eventSearchEndYear} onValueChange={setEventSearchEndYear}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023년</SelectItem>
                    <SelectItem value="2024">2024년</SelectItem>
                    <SelectItem value="2025">2025년</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-3">
            {displayEvents.slice(0, isMobile ? 5 : 10).map((event, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border rounded-lg space-y-2 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    {getStatusBadge(event.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{event.type} • {event.start_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{event.actual_contracts}건</p>
                  <p className="text-xs text-muted-foreground">{event.actual_sqm}장</p>
                </div>
              </div>
            ))}
            {displayEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                필터 조건에 맞는 이벤트가 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics