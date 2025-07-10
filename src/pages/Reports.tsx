import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Download, 
  FileText, 
  Calendar,
  BarChart3,
  TrendingUp,
  Eye,
  Filter
} from 'lucide-react'

const Reports = () => {
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filteredReports, setFilteredReports] = useState(null)

  const handlePeriodChange = (value: string) => {
    setPeriodFilter(value)
    filterReports(value, startDate, endDate)
  }

  const filterReports = (period: string, start: string, end: string) => {
    console.log('Reports filtering:', { period, start, end })
    
    let filtered = reports
    
    if (period === 'monthly') {
      filtered = reports.filter(r => r.type === 'monthly')
      setFilteredReports({
        message: '월간 리포트로 필터링됨',
        data: filtered
      })
    } else if (period === 'quarterly') {
      filtered = reports.filter(r => r.type === 'quarterly')
      setFilteredReports({
        message: '분기별 리포트로 필터링됨',
        data: filtered
      })
    } else if (period === 'custom' && start && end) {
      // 날짜 범위 필터링
      filtered = reports.filter(r => {
        const reportDate = new Date(r.generatedDate)
        const startDateObj = new Date(start)
        const endDateObj = new Date(end)
        return reportDate >= startDateObj && reportDate <= endDateObj
      })
      setFilteredReports({
        message: `${start}부터 ${end}까지 리포트로 필터링됨`,
        data: filtered
      })
    } else {
      setFilteredReports(null)
    }
  }

  React.useEffect(() => {
    if (periodFilter === 'custom' && startDate && endDate) {
      filterReports(periodFilter, startDate, endDate)
    }
  }, [startDate, endDate, periodFilter])

  const handleViewReport = (reportId: string) => {
    console.log('보고서 보기:', reportId)
    
    // 보고서 상세 보기 모달 또는 새 페이지로 이동
    const report = reports.find(r => r.id === reportId)
    if (report) {
      alert(`${report.title} 보고서를 조회합니다.\n생성일: ${report.generatedDate}\n달성률: ${report.achievementRate}%`)
    }
  }

  const handleDownloadReport = (reportId: string, title: string) => {
    console.log('보고서 다운로드:', reportId)
    
    const report = reports.find(r => r.id === reportId)
    if (report) {
      const reportContent = `
보고서: ${title}
생성일: ${report.generatedDate}
기간: ${report.period}
채널: ${report.channels.join(', ')}
총 이벤트: ${report.totalEvents}개
총 계약: ${report.totalContracts}건
달성률: ${report.achievementRate}%
상태: ${report.status}
      `
      
      const element = document.createElement('a')
      const file = new Blob([reportContent], {type: 'text/plain'})
      element.href = URL.createObjectURL(file)
      element.download = `${title.replace(/\s+/g, '_')}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      
      alert('보고서가 다운로드되었습니다!')
    }
  }

  const handleCreateReport = () => {
    const reportData = {
      period: periodFilter,
      startDate,
      endDate,
      createdAt: new Date().toISOString()
    }
    
    console.log('새 리포트 생성:', reportData)
    
    // 새 리포트 생성 로직
    const newReport = {
      id: `${Date.now()}`,
      title: `${periodFilter === 'monthly' ? '월간' : periodFilter === 'quarterly' ? '분기별' : '사용자 정의'} 성과 리포트`,
      type: periodFilter,
      period: periodFilter === 'custom' ? `${startDate} ~ ${endDate}` : new Date().getFullYear() + '년',
      generatedDate: new Date().toISOString().split('T')[0],
      channels: ['라이브커머스', '베이비페어'],
      totalEvents: 8,
      totalContracts: 156,
      achievementRate: 78.2,
      status: 'completed'
    }
    
    alert(`새 리포트가 생성되었습니다!\n제목: ${newReport.title}\n기간: ${newReport.period}`)
  }

  // 샘플 데이터 - 추후 Supabase 연동 시 실제 데이터로 교체
  const reports = [
    {
      id: '1',
      title: '2024년 1분기 종합 성과 리포트',
      type: 'quarterly',
      period: '2024 Q1',
      generatedDate: '2024-03-31',
      channels: ['라이브커머스', '베이비페어', '입주박람회'],
      totalEvents: 12,
      totalContracts: 234,
      achievementRate: 78.5,
      status: 'completed'
    },
    {
      id: '2',
      title: '라이브커머스 채널 월간 분석',
      type: 'monthly',
      period: '2024년 1월',
      generatedDate: '2024-01-31',
      channels: ['라이브커머스'],
      totalEvents: 4,
      totalContracts: 89,
      achievementRate: 82.3,
      status: 'completed'
    },
    {
      id: '3',
      title: '베이비페어 이벤트 성과 분석',
      type: 'event',
      period: '2024-01-08 ~ 2024-01-14',
      generatedDate: '2024-01-15',
      channels: ['베이비페어'],
      totalEvents: 1,
      totalContracts: 95,
      achievementRate: 118.8,
      status: 'completed'
    },
    {
      id: '4',
      title: '인플루언서공구 채널 분석',
      type: 'channel',
      period: '2023년 전체',
      generatedDate: '2024-01-10',
      channels: ['인플루언서공구'],
      totalEvents: 8,
      totalContracts: 67,
      achievementRate: 89.3,
      status: 'completed'
    },
    {
      id: '5',
      title: '2024년 2분기 진행 중 리포트',
      type: 'quarterly',
      period: '2024 Q2',
      generatedDate: '2024-06-15',
      channels: ['라이브커머스', '베이비페어', '입주박람회', '인플루언서공구'],
      totalEvents: 8,
      totalContracts: 156,
      achievementRate: 65.2,
      status: 'draft'
    }
  ]

  
  // 필터링된 리포트 또는 전체 리포트
  const displayReports = filteredReports?.data || reports.filter(report => {
    const matchesPeriod = filterPeriod === 'all' || report.type === filterPeriod
    const matchesType = filterType === 'all' || report.status === filterType
    return matchesPeriod && matchesType
  })

  const getTypeBadge = (type: string) => {
    const colors = {
      'quarterly': 'bg-blue-100 text-blue-800 border-blue-200',
      'monthly': 'bg-green-100 text-green-800 border-green-200',
      'event': 'bg-purple-100 text-purple-800 border-purple-200',
      'channel': 'bg-orange-100 text-orange-800 border-orange-200'
    }
    const labels = {
      'quarterly': '분기별',
      'monthly': '월간',
      'event': '이벤트별',
      'channel': '채널별'
    }
    return <Badge className={colors[type as keyof typeof colors]}>{labels[type as keyof typeof labels]}</Badge>
  }

  const getStatusBadge = (status: string) => {
    return status === 'completed' 
      ? <Badge className="bg-success text-success-foreground">완료</Badge>
      : <Badge variant="outline">임시저장</Badge>
  }

  const getAchievementColor = (rate: number) => {
    if (rate >= 100) return 'text-success'
    if (rate >= 80) return 'text-warning'
    return 'text-danger'
  }

  const stats = {
    totalReports: reports.length,
    completedReports: reports.filter(r => r.status === 'completed').length,
    avgAchievement: Math.round(reports.reduce((sum, r) => sum + r.achievementRate, 0) / reports.length),
    thisQuarter: reports.filter(r => r.period.includes('2024 Q')).length
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">보고서</h1>
          <p className="text-muted-foreground mt-2">
            성과 리포트를 생성하고 다운로드하세요
          </p>
      </div>

      {/* 필터링 결과 표시 */}
      {filteredReports && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">{filteredReports.message}</p>
          <p className="text-yellow-600 text-sm">필터링된 리포트: {filteredReports.data.length}개</p>
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
          <Button onClick={handleCreateReport}>
            <FileText className="w-4 h-4 mr-2" />
            새 리포트 생성
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 리포트</p>
                <p className="text-2xl font-bold">{stats.totalReports}개</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">완료된 리포트</p>
                <p className="text-2xl font-bold text-success">{stats.completedReports}개</p>
              </div>
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">평균 달성률</p>
                <p className="text-2xl font-bold">{stats.avgAchievement}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">분기 리포트</p>
                <p className="text-2xl font-bold">{stats.thisQuarter}개</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="리포트 유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 유형</SelectItem>
            <SelectItem value="quarterly">분기별</SelectItem>
            <SelectItem value="monthly">월간</SelectItem>
            <SelectItem value="event">이벤트별</SelectItem>
            <SelectItem value="channel">채널별</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
            <SelectItem value="draft">임시저장</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {displayReports.map((report) => (
          <Card key={report.id} className="hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    {getTypeBadge(report.type)}
                    {getStatusBadge(report.status)}
                    <span className="text-sm text-muted-foreground">
                      생성일: {report.generatedDate}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold">{report.title}</h3>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <span>기간: {report.period}</span>
                    <span>이벤트: {report.totalEvents}개</span>
                    <span>계약: {report.totalContracts}건</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {report.channels.map((channel, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className={`text-2xl font-bold ${getAchievementColor(report.achievementRate)}`}>
                    {report.achievementRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">달성률</div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewReport(report.id)}>
                      <Eye className="w-4 h-4 mr-1" />
                      보기
                    </Button>
                    {report.status === 'completed' && (
                      <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id, report.title)}>
                        <Download className="w-4 h-4 mr-1" />
                        다운로드
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayReports.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {filteredReports || filterPeriod !== 'all' || filterType !== 'all' 
              ? '필터 조건에 맞는 리포트가 없습니다.' 
              : '생성된 리포트가 없습니다.'
            }
          </div>
          <Button className="mt-4">첫 번째 리포트 생성하기</Button>
        </div>
      )}
    </div>
  )
}

export default Reports