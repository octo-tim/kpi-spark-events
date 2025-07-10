import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import KPICard from '@/components/KPICard'
import { useEvents, type Event } from '@/hooks/useEvents'
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
      const totalSqm = filteredEventData.reduce((sum, event) => sum + event.actual_sqm, 0)
      const totalCost = filteredEventData.reduce((sum, event) => sum + (event.total_cost || 0), 0)
      const costPerSqm = totalSqm > 0 ? Math.round(totalCost / totalSqm) : 0
      
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
        totalSqm,
        totalCost,
        costPerSqm,
        filteredEventData
      })

      // 채널 통계 계산
      const stats = await getChannelStats(filteredEventData, selectedYear, selectedMonth)
      setChannelStats(stats)
      
    } catch (error) {
      console.error('검색 중 오류 발생:', error)
    }
  }

  useEffect(() => {
    // 초기 로드시 월간 데이터 자동 로드
    handleSearch()
  }, [])

  const handleDownload = () => {
    console.log('리포트 다운로드 시작')
    
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
      
      return await fetchEventsByMonth(prevYear.toString(), prevMonth.toString().padStart(2, '0'))
    } catch (error) {
      console.error('전월 데이터 조회 오류:', error)
      return []
    }
  }

  // 실제 데이터 기반 통계 계산
  const getChannelStats = async (currentEvents: Event[], currentYear: string, currentMonth: string) => {
    // 데이터가 없으면 빈 배열 반환
    if (currentEvents.length === 0) {
      return []
    }
    
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
    
    return Object.entries(channelMap).map(([channel, channelEvents]) => {
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
      
      // 다음달 목표 (현재 목표의 110% 또는 현재 실적의 115%)
      const nextMonthTargetContracts = Math.max(
        Math.round(currentTargetContracts * 1.1), 
        Math.round(currentContracts * 1.15)
      )
      const nextMonthTargetEstimates = Math.max(
        Math.round(currentTargetEstimates * 1.1), 
        Math.round(currentEstimates * 1.15)
      )

      return {
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
      }
    })
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
    console.log('이벤트 테이블 필터링:', { filter, start, end })
    
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
        console.log(`기간 검색 결과: ${filtered.length}개 이벤트`)
      } else if (filter === 'all') {
        filtered = events
      }

      console.log(`필터링된 이벤트 수: ${filtered.length}`)
      setFilteredEvents(filtered)
    } catch (error) {
      console.error('이벤트 필터링 중 오류:', error)
      setFilteredEvents(events)
    }
  }

  const displayEvents = filteredEvents || events

  const handleEventTableFilterChange = async (value: string) => {
    console.log('이벤트 테이블 필터 변경:', value)
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
            <div className="flex items-center space-x-2">
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
              <Button onClick={handleSearch} className="ml-4">
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </div>
          )}
          {periodFilter === 'quarterly' && (
            <div className="flex items-center space-x-2">
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
              <Button onClick={handleSearch} className="ml-4">
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </div>
          )}
          {periodFilter === 'custom' && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-muted/30 p-2 rounded-lg">
                <Select value={startYear} onValueChange={setStartYear}>
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
                <Select value={startMonth} onValueChange={setStartMonth}>
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
              <span className="font-medium">~</span>
              <div className="flex items-center space-x-1 bg-muted/30 p-2 rounded-lg">
                <Select value={endYear} onValueChange={setEndYear}>
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
                <Select value={endMonth} onValueChange={setEndMonth}>
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
              <Button onClick={handleSearch} className="ml-4">
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </div>
          )}
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* 전체 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="총 이벤트"
          value={filteredStats?.totalEvents || 0}
          unit="개"
          trend="up"
          trendValue={12}
        />
        <KPICard
          title="총 계약건수"
          value={filteredStats?.totalContracts || 0}
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
          value={filteredStats?.costPerSqm || 0}
          unit="원/장"
          trend="down"
          trendValue={-8}
        />
      </div>

      {/* 이벤트별 상세 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>
            이벤트별 상세분석
            {filteredStats && filteredStats.filteredEventData && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredStats.filteredEventData.length}개 이벤트)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredStats && filteredStats.filteredEventData ? (
              filteredStats.filteredEventData.length > 0 ? (
                filteredStats.filteredEventData.map((event, index) => (
                  <div key={event.id || index} className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
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
                        <p className="font-semibold">{event.actual_contracts}건</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">견적건수</p>
                        <p className="font-semibold">{event.actual_estimates}건</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">계약장수</p>
                        <p className="font-semibold">{event.actual_sqm.toLocaleString()}장</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">전환율</p>
                        <p className="font-semibold">{((event.actual_contracts / event.actual_estimates) * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">장당비용</p>
                        <p className="font-semibold">{Math.round(event.total_cost / event.actual_sqm).toLocaleString()}원/장</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  선택한 기간에 해당하는 이벤트가 없습니다.
                </div>
              )
            ) : (
              events.slice(0, 3).map((event, index) => (
                <div key={event.id || index} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
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
                      <p className="font-semibold">{event.actual_contracts}건</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">견적건수</p>
                      <p className="font-semibold">{event.actual_estimates}건</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">계약장수</p>
                      <p className="font-semibold">{event.actual_sqm.toLocaleString()}장</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">전환율</p>
                      <p className="font-semibold">{((event.actual_contracts / event.actual_estimates) * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">장당비용</p>
                      <p className="font-semibold">{Math.round(event.total_cost / event.actual_sqm).toLocaleString()}원/장</p>
                    </div>
                  </div>
                </div>
              ))
            )}
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
                      전월: {channel.prevContracts || 0}건
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">목표 대비</div>
                    <div className="font-bold text-primary">
                      {channel.goalAchievementRate || 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      목표: {channel.targetContracts || 0}건
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
                    {channel.nextMonthTargetContracts || 0}건
                  </div>
                  <div className="text-xs text-muted-foreground">목표 계약</div>
                  <div className="text-sm">
                    {channel.nextMonthTargetEstimates || 0}건 견적
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 채널별 실적 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>채널별 실적 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelStats.map((channel, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{channel.channel}</span>
                    <span className="text-sm text-muted-foreground">
                      {channel.totalContracts}건
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-primary transition-all duration-500"
                      style={{ 
                        width: `${channelStats.length > 0 ? (channel.totalContracts / Math.max(...channelStats.map(c => c.totalContracts))) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>견적: {channel.totalEstimates}건</span>
                    <span>장수: {channel.totalSqm.toLocaleString()}장</span>
                  </div>
                </div>
              ))}
              {channelStats.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  데이터가 없습니다.
                </div>
              )}
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
              {topPerformingEvents.map((event, index) => (
                <div key={event.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{event.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{event.sqm.toLocaleString()}장</p>
                  </div>
                </div>
              ))}
              {topPerformingEvents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  데이터가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default Analytics