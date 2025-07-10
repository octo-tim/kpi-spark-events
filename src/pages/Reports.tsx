import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Download, 
  FileText, 
  Calendar,
  BarChart3,
  TrendingUp,
  Eye,
  Filter,
  Plus,
  Search,
  Loader2
} from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'

// 리포트 타입 정의
interface Report {
  id: string
  title: string
  type: 'quarterly' | 'monthly' | 'event' | 'channel'
  period: string
  generatedDate: string
  channels: string[]
  totalEvents: number
  totalContracts: number
  achievementRate: number
  status: 'completed' | 'draft'
}

const Reports = () => {
  const { events, loading } = useEvents()
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredReports, setFilteredReports] = useState<{data: Report[]} | null>(null)

  // 실제 데이터를 기반으로 리포트 생성
  const generateReportsFromData = (): Report[] => {
    if (!events.length) return []
    
    const reports: Report[] = []
    
    // 월별 리포트 생성 (최근 6개월)
    const months = ['2024-07', '2024-06', '2024-05', '2024-04', '2024-03', '2024-02']
    months.forEach((month) => {
      const [year, monthNum] = month.split('-')
      const monthEvents = events.filter(event => 
        event.start_date.startsWith(month)
      )
      
      if (monthEvents.length > 0) {
        const totalContracts = monthEvents.reduce((sum, e) => sum + (e.actual_contracts || 0), 0)
        const targetContracts = monthEvents.reduce((sum, e) => sum + (e.target_contracts || 0), 0)
        const achievementRate = targetContracts > 0 ? (totalContracts / targetContracts) * 100 : 0
        
        reports.push({
          id: `monthly-${month}`,
          title: `${year}년 ${parseInt(monthNum)}월 월간 성과 리포트`,
          type: 'monthly',
          period: `${year}년 ${parseInt(monthNum)}월`,
          generatedDate: new Date().toISOString().split('T')[0],
          channels: [...new Set(monthEvents.map(e => e.type))],
          totalEvents: monthEvents.length,
          totalContracts,
          achievementRate: Math.round(achievementRate * 10) / 10,
          status: 'completed'
        })
      }
    })
    
    // 분기별 리포트 생성
    const quarters = [
      { period: '2024-Q2', months: ['2024-04', '2024-05', '2024-06'], label: '2024년 2분기' },
      { period: '2024-Q1', months: ['2024-01', '2024-02', '2024-03'], label: '2024년 1분기' }
    ]
    
    quarters.forEach((quarter) => {
      const quarterEvents = events.filter(event => 
        quarter.months.some(month => event.start_date.startsWith(month))
      )
      
      if (quarterEvents.length > 0) {
        const totalContracts = quarterEvents.reduce((sum, e) => sum + (e.actual_contracts || 0), 0)
        const targetContracts = quarterEvents.reduce((sum, e) => sum + (e.target_contracts || 0), 0)
        const achievementRate = targetContracts > 0 ? (totalContracts / targetContracts) * 100 : 0
        
        reports.push({
          id: `quarterly-${quarter.period}`,
          title: `${quarter.label} 종합 성과 리포트`,
          type: 'quarterly',
          period: quarter.label,
          generatedDate: new Date().toISOString().split('T')[0],
          channels: [...new Set(quarterEvents.map(e => e.type))],
          totalEvents: quarterEvents.length,
          totalContracts,
          achievementRate: Math.round(achievementRate * 10) / 10,
          status: 'completed'
        })
      }
    })
    
    // 채널별 리포트 생성
    const channelTypes = ['라이브커머스', '베이비페어', '입주박람회', '인플루언서공구']
    channelTypes.forEach((channel) => {
      const channelEvents = events.filter(event => event.type === channel)
      
      if (channelEvents.length > 0) {
        const totalContracts = channelEvents.reduce((sum, e) => sum + (e.actual_contracts || 0), 0)
        const targetContracts = channelEvents.reduce((sum, e) => sum + (e.target_contracts || 0), 0)
        const achievementRate = targetContracts > 0 ? (totalContracts / targetContracts) * 100 : 0
        
        reports.push({
          id: `channel-${channel}`,
          title: `${channel} 채널 성과 분석`,
          type: 'channel',
          period: '2024년 전체',
          generatedDate: new Date().toISOString().split('T')[0],
          channels: [channel],
          totalEvents: channelEvents.length,
          totalContracts,
          achievementRate: Math.round(achievementRate * 10) / 10,
          status: 'completed'
        })
      }
    })
    
    return reports.sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime())
  }

  // 실제 데이터에서 리포트 생성
  const reports = generateReportsFromData()
  
  // 필터링된 리포트 또는 전체 리포트
  const displayReports = filteredReports?.data || reports.filter(report => {
    const matchesPeriod = filterPeriod === 'all' || report.type === filterPeriod
    const matchesType = filterType === 'all' || report.status === filterType
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.channels.some(channel => channel.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesPeriod && matchesType && matchesSearch
  })

  const handleViewReport = (reportId: string) => {
    console.log('보고서 보기:', reportId)
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
    avgAchievement: reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.achievementRate, 0) / reports.length) : 0,
    thisQuarter: reports.filter(r => r.period.includes('2024년 2분기') || r.period.includes('2024년 3분기')).length
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">리포트 관리</h1>
          <p className="text-muted-foreground mt-2">
            이벤트 성과 리포트를 생성하고 관리하세요
          </p>
        </div>
        {loading ? (
          <div className="flex items-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">데이터 로딩 중...</span>
          </div>
        ) : (
          <Button onClick={() => alert('새 리포트 생성 기능은 준비 중입니다.')}>
            <Plus className="w-4 h-4 mr-2" />
            새 리포트 생성
          </Button>
        )}
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="리포트 제목이나 채널명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
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

      {/* Reports List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>리포트를 생성하는 중...</span>
        </div>
      ) : displayReports.length > 0 ? (
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
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || filterPeriod !== 'all' || filterType !== 'all' 
              ? '검색 조건에 맞는 리포트가 없습니다.' 
              : '생성된 리포트가 없습니다.'
            }
          </div>
          <Button className="mt-4" onClick={() => alert('새 리포트 생성 기능은 준비 중입니다.')}>
            첫 번째 리포트 생성하기
          </Button>
        </div>
      )}
    </div>
  )
}

export default Reports