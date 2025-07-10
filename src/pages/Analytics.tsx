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
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filteredStats, setFilteredStats] = useState(null)
  const [eventTableFilter, setEventTableFilter] = useState('all')
  const [eventSearchStart, setEventSearchStart] = useState('')
  const [eventSearchEnd, setEventSearchEnd] = useState('')
  const [filteredEvents, setFilteredEvents] = useState(null)

  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value)
    filterAnalyticsData(value, startDate, endDate)
  }

  const filterAnalyticsData = (period: string, start: string, end: string) => {
    console.log('Analytics filtering:', { period, start, end })
    
    if (period === 'monthly') {
      setFilteredStats({
        message: '월간 분석 데이터로 필터링됨',
        totalEvents: 12,
        totalContracts: 280
      })
    } else if (period === 'quarterly') {
      setFilteredStats({
        message: '분기별 분석 데이터로 필터링됨',
        totalEvents: 36,
        totalContracts: 420
      })
    } else if (period === 'custom' && start && end) {
      setFilteredStats({
        message: `${start}부터 ${end}까지 분석 데이터로 필터링됨`,
        totalEvents: 18,
        totalContracts: 320
      })
    }
  }

  React.useEffect(() => {
    if (periodFilter === 'custom' && startDate && endDate) {
      filterAnalyticsData(periodFilter, startDate, endDate)
    }
  }, [startDate, endDate, periodFilter])

  const handleDownload = () => {
    console.log('리포트 다운로드 시작')
    
    // 실제 PDF 생성 로직
    const reportData = `
통계 분석 리포트
생성일: ${new Date().toLocaleDateString()}
조회기간: ${periodFilter}
${periodFilter === 'custom' ? `기간: ${startDate} ~ ${endDate}` : ''}

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

  // 전체 이벤트 목록 데이터
  const allEvents = [
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
      efficiency: 82
    },
    {
      id: '2',
      title: '서울 베이비&키즈 페어 2024',
      type: '베이비페어',
      status: '완료',
      startDate: '2024-01-08',
      endDate: '2024-01-14',
      partner: '베이비페어 조직위',
      targetContracts: 80,
      actualContracts: 95,
      targetEstimates: 200,
      actualEstimates: 215,
      targetSqm: 2400,
      actualSqm: 2850,
      totalCost: 28500000,
      efficiency: 88
    },
    {
      id: '3',
      title: '분당 신도시 입주박람회',
      type: '입주박람회',
      status: '계획중',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      partner: '분당신도시개발',
      targetContracts: 35,
      actualContracts: 35,
      targetEstimates: 85,
      actualEstimates: 85,
      targetSqm: 1200,
      actualSqm: 1200,
      totalCost: 12000000,
      efficiency: 75
    },
    {
      id: '4',
      title: '카카오 쇼핑라이브 협업',
      type: '라이브커머스',
      status: '완료',
      startDate: '2024-01-22',
      endDate: '2024-01-28',
      partner: '카카오 쇼핑라이브',
      targetContracts: 40,
      actualContracts: 38,
      targetEstimates: 100,
      actualEstimates: 92,
      targetSqm: 1300,
      actualSqm: 1150,
      totalCost: 18000000,
      efficiency: 79
    },
    {
      id: '5',
      title: '롯데 베이비페어 참가',
      type: '베이비페어',
      status: '진행중',
      startDate: '2024-01-29',
      endDate: '2024-02-04',
      partner: '롯데 베이비페어',
      targetContracts: 60,
      actualContracts: 45,
      targetEstimates: 150,
      actualEstimates: 118,
      targetSqm: 2000,
      actualSqm: 1580,
      totalCost: 22000000,
      efficiency: 76
    },
    {
      id: '6',
      title: '인플루언서 협업 프로모션',
      type: '인플루언서공구',
      status: '완료',
      startDate: '2024-01-05',
      endDate: '2024-01-12',
      partner: '인플루언서그룹',
      targetContracts: 25,
      actualContracts: 27,
      targetEstimates: 65,
      actualEstimates: 72,
      targetSqm: 800,
      actualSqm: 750,
      totalCost: 9500000,
      efficiency: 85
    }
  ]

  // 이벤트 테이블 필터링 함수
  const filterEventTable = (filter: string, start: string, end: string) => {
    let filtered = allEvents

    if (filter === 'completed') {
      filtered = allEvents.filter(event => event.status === '완료')
    } else if (filter === 'ongoing') {
      filtered = allEvents.filter(event => event.status === '진행중')
    } else if (filter === 'planned') {
      filtered = allEvents.filter(event => event.status === '계획중')
    } else if (filter === 'custom' && start && end) {
      filtered = allEvents.filter(event => {
        const eventStart = new Date(event.startDate)
        const filterStart = new Date(start)
        const filterEnd = new Date(end)
        return eventStart >= filterStart && eventStart <= filterEnd
      })
    }

    setFilteredEvents(filtered)
  }

  const handleEventTableFilterChange = (value: string) => {
    setEventTableFilter(value)
    if (value !== 'custom') {
      setEventSearchStart('')
      setEventSearchEnd('')
    }
    filterEventTable(value, eventSearchStart, eventSearchEnd)
  }

  React.useEffect(() => {
    if (eventTableFilter === 'custom' && eventSearchStart && eventSearchEnd) {
      filterEventTable(eventTableFilter, eventSearchStart, eventSearchEnd)
    }
  }, [eventSearchStart, eventSearchEnd, eventTableFilter])

  const getStatusBadge = (status: string) => {
    const statusMap = {
      '완료': 'bg-success text-success-foreground',
      '진행중': 'bg-warning text-warning-foreground', 
      '계획중': 'bg-muted text-muted-foreground'
    }
    return <Badge className={statusMap[status as keyof typeof statusMap]}>{status}</Badge>
  }

  const displayEvents = filteredEvents || allEvents

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

      {/* 필터링 결과 표시 */}
      {filteredStats && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">{filteredStats.message}</p>
          <div className="flex space-x-4 mt-2 text-green-600 text-sm">
            <span>이벤트: {filteredStats.totalEvents}개</span>
            <span>계약: {filteredStats.totalContracts}건</span>
          </div>
        </div>
      )}
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
              <Input 
                type="date" 
                className="w-40" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span>~</span>
              <Input 
                type="date" 
                className="w-40" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
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
          value={filteredStats?.totalEvents || 36}
          unit="개"
          trend="up"
          trendValue={12}
        />
        <KPICard
          title="총 계약건수"
          value={filteredStats?.totalContracts || 335}
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

      {/* 전체 이벤트 리스트 테이블 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>전체 이벤트 리스트</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                모든 이벤트의 상세 정보를 확인하고 기간별로 검색할 수 있습니다
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={eventTableFilter} onValueChange={handleEventTableFilterChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="상태별 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                  <SelectItem value="ongoing">진행중</SelectItem>
                  <SelectItem value="planned">계획중</SelectItem>
                  <SelectItem value="custom">기간검색</SelectItem>
                </SelectContent>
              </Select>
              
              {eventTableFilter === 'custom' && (
                <div className="flex items-center space-x-2">
                  <Input 
                    type="date" 
                    className="w-36" 
                    placeholder="시작일"
                    value={eventSearchStart}
                    onChange={(e) => setEventSearchStart(e.target.value)}
                  />
                  <span className="text-muted-foreground">~</span>
                  <Input 
                    type="date" 
                    className="w-36" 
                    placeholder="종료일"
                    value={eventSearchEnd}
                    onChange={(e) => setEventSearchEnd(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold text-sm">이벤트명</th>
                  <th className="text-left p-3 font-semibold text-sm">채널</th>
                  <th className="text-left p-3 font-semibold text-sm">상태</th>
                  <th className="text-left p-3 font-semibold text-sm">기간</th>
                  <th className="text-left p-3 font-semibold text-sm">파트너</th>
                  <th className="text-right p-3 font-semibold text-sm">목표계약</th>
                  <th className="text-right p-3 font-semibold text-sm">실제계약</th>
                  <th className="text-right p-3 font-semibold text-sm">달성률</th>
                  <th className="text-right p-3 font-semibold text-sm">계약장수</th>
                  <th className="text-right p-3 font-semibold text-sm">총비용</th>
                  <th className="text-right p-3 font-semibold text-sm">효율성</th>
                </tr>
              </thead>
              <tbody>
                {displayEvents.length > 0 ? (
                  displayEvents.map((event) => {
                    const achievementRate = ((event.actualContracts / event.targetContracts) * 100).toFixed(1)
                    return (
                      <tr key={event.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{event.title}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {getStatusBadge(event.status)}
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            <div>{event.startDate}</div>
                            <div className="text-muted-foreground">~ {event.endDate}</div>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{event.partner}</td>
                        <td className="p-3 text-right text-sm">{event.targetContracts}건</td>
                        <td className="p-3 text-right text-sm font-medium">{event.actualContracts}건</td>
                        <td className="p-3 text-right">
                          <span className={`text-sm font-medium ${
                            parseFloat(achievementRate) >= 100 ? 'text-success' :
                            parseFloat(achievementRate) >= 80 ? 'text-warning' :
                            'text-danger'
                          }`}>
                            {achievementRate}%
                          </span>
                        </td>
                        <td className="p-3 text-right text-sm">{event.actualSqm.toLocaleString()}장</td>
                        <td className="p-3 text-right text-sm">{(event.totalCost / 1000000).toFixed(1)}M원</td>
                        <td className="p-3 text-right">
                          <Badge 
                            className={`text-xs ${
                              event.efficiency >= 85 ? "bg-success text-success-foreground" :
                              event.efficiency >= 70 ? "bg-warning text-warning-foreground" :
                              "bg-danger text-danger-foreground"
                            }`}
                          >
                            {event.efficiency}%
                          </Badge>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-muted-foreground">
                      {eventTableFilter === 'custom' ? 
                        '선택한 기간에 해당하는 이벤트가 없습니다.' : 
                        '검색 조건에 맞는 이벤트가 없습니다.'
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* 테이블 하단 요약 정보 */}
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-lg">{displayEvents.length}</div>
                <div className="text-muted-foreground">총 이벤트</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">
                  {displayEvents.reduce((sum, event) => sum + event.actualContracts, 0)}
                </div>
                <div className="text-muted-foreground">총 계약건수</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">
                  {displayEvents.reduce((sum, event) => sum + event.actualSqm, 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground">총 계약장수</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">
                  {(displayEvents.reduce((sum, event) => sum + event.totalCost, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-muted-foreground">총 비용</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics