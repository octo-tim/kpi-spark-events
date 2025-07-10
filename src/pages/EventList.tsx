import React, { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import EventCard, { EventData, EventType, EventStatus } from '@/components/EventCard'
import { PeriodSelector } from '@/components/reports/PeriodSelector'
import { Search, Filter, Plus, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEvents } from '@/hooks/useEvents'

const EventList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<EventType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'all'>('all')
  const [periodType, setPeriodType] = useState<'month' | 'quarter' | 'range'>('month')
  const [selectedPeriod, setSelectedPeriod] = useState('2024-07')
  
  const { events, loading } = useEvents()

  // 표시할 이벤트 목록 (기간 필터링 단순화)
  const eventsToShow = useMemo(() => {
    if (!selectedPeriod) return events
    
    return events.filter(event => {
      const eventDate = new Date(event.start_date)
      const eventYear = eventDate.getFullYear()
      const eventMonth = eventDate.getMonth() + 1
      
      if (periodType === 'month') {
        const [year, month] = selectedPeriod.split('-')
        return eventYear === parseInt(year) && eventMonth === parseInt(month)
      } else if (periodType === 'quarter') {
        const [year, quarter] = selectedPeriod.split('-Q')
        const eventQuarter = Math.ceil(eventMonth / 3)
        return eventYear === parseInt(year) && eventQuarter === parseInt(quarter)
      } else if (periodType === 'range') {
        if (selectedPeriod === '2024') return eventYear === 2024
        if (selectedPeriod === '2025') return eventYear === 2025
        if (selectedPeriod === '2023') return eventYear === 2023
        return true
      }
      
      return true
    })
  }, [events, selectedPeriod, periodType])

  // 이벤트 데이터를 EventData 형태로 변환
  const convertedEvents: EventData[] = eventsToShow.map(event => ({
    id: event.id,
    title: event.title,
    type: event.type as EventType,
    status: event.status as EventStatus,
    startDate: event.start_date,
    endDate: event.end_date,
    partner: event.partner || '',
    targetContracts: event.target_contracts || 0,
    actualContracts: event.actual_contracts || 0,
    targetEstimates: event.target_estimates || 0,
    actualEstimates: event.actual_estimates || 0,
    targetSqm: event.target_sqm || 0,
    actualSqm: event.actual_sqm || 0,
    totalCost: Number(event.total_cost) || 0,
    costPerSqm: event.actual_sqm ? Math.round((Number(event.total_cost) || 0) / event.actual_sqm) : 0
  }))

  // 필터링된 이벤트 목록
  const filteredEvents = convertedEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.partner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || event.type === filterType
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusCount = (status: EventStatus) => {
    return convertedEvents.filter(event => event.status === status).length
  }

  const getTypeCount = (type: EventType) => {
    return convertedEvents.filter(event => event.type === type).length
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">이벤트 목록</h1>
          <p className="text-muted-foreground mt-2">
            모든 제휴채널 이벤트를 관리하고 성과를 추적하세요
          </p>
        </div>
        <Button asChild>
          <Link to="/events/create">
            <Plus className="w-4 h-4 mr-2" />
            새 이벤트 기획
          </Link>
        </Button>
      </div>

      {/* Period Selector */}
      <PeriodSelector
        periodType={periodType}
        selectedPeriod={selectedPeriod}
        onPeriodTypeChange={setPeriodType}
        onPeriodChange={setSelectedPeriod}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">계획중</div>
          <div className="text-2xl font-bold text-foreground">{getStatusCount('계획중')}</div>
        </div>
        <div className="bg-gradient-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">진행중</div>
          <div className="text-2xl font-bold text-primary">{getStatusCount('진행중')}</div>
        </div>
        <div className="bg-gradient-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">완료</div>
          <div className="text-2xl font-bold text-success">{getStatusCount('완료')}</div>
        </div>
        <div className="bg-gradient-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">취소</div>
          <div className="text-2xl font-bold text-danger">{getStatusCount('취소')}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="이벤트명이나 파트너명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={(value) => setFilterType(value as EventType | 'all')}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="이벤트 유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 유형</SelectItem>
            <SelectItem value="라이브커머스">라이브커머스 ({getTypeCount('라이브커머스')})</SelectItem>
            <SelectItem value="베이비페어">베이비페어 ({getTypeCount('베이비페어')})</SelectItem>
            <SelectItem value="입주박람회">입주박람회 ({getTypeCount('입주박람회')})</SelectItem>
            <SelectItem value="인플루언서공구">인플루언서공구 ({getTypeCount('인플루언서공구')})</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as EventStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="계획중">계획중</SelectItem>
            <SelectItem value="진행중">진행중</SelectItem>
            <SelectItem value="완료">완료</SelectItem>
            <SelectItem value="취소">취소</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>총 {filteredEvents.length}개의 이벤트</span>
          {(filterType !== 'all' || filterStatus !== 'all' || searchTerm || selectedPeriod) && (
            <>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                필터 적용됨
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>이벤트 목록을 불러오는 중...</span>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
              ? '검색 조건에 맞는 이벤트가 없습니다.' 
              : '등록된 이벤트가 없습니다.'
            }
          </div>
          <Button asChild className="mt-4">
            <Link to="/events/create">첫 번째 이벤트 기획하기</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default EventList