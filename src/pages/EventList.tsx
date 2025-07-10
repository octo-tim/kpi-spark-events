import React, { useState } from 'react'
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
import { Search, Filter, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const EventList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<EventType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'all'>('all')

  // 샘플 데이터 - 추후 Supabase 연동 시 실제 데이터로 교체
  const events: EventData[] = [
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
      description: '신혼부부를 대상으로 한 맞춤형 인테리어 라이브 쇼핑 이벤트'
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
      description: '영유아 가구를 위한 안전하고 실용적인 인테리어 솔루션 전시'
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
      description: '분당 신도시 입주 예정자를 대상으로 한 인테리어 박람회'
    },
    {
      id: '4',
      title: '홈데코 인플루언서 협업 공구',
      type: '인플루언서공구',
      status: '계획중',
      startDate: '2024-01-25',
      endDate: '2024-01-30',
      partner: '인테리어_지니',
      targetContracts: 25,
      targetEstimates: 60,
      targetSqm: 800,
      description: '인기 인테리어 인플루언서와 함께하는 특가 공구 이벤트'
    },
    {
      id: '5',
      title: '부산 베이비페어 가을시즌',
      type: '베이비페어',
      status: '완료',
      startDate: '2023-12-15',
      endDate: '2023-12-17',
      location: '벡스코 제1전시장',
      partner: '부산베이비페어',
      targetContracts: 40,
      actualContracts: 38,
      targetEstimates: 95,
      actualEstimates: 92,
      targetSqm: 1200,
      actualSqm: 1140,
      description: '부산 지역 영유아 가정을 위한 인테리어 상담 및 시공 서비스'
    },
    {
      id: '6',
      title: '새해 맞이 리모델링 라이브',
      type: '라이브커머스',
      status: '취소',
      startDate: '2024-01-02',
      endDate: '2024-01-05',
      partner: '카카오 쇼핑라이브',
      targetContracts: 30,
      targetEstimates: 75,
      targetSqm: 900,
      description: '새해를 맞아 집 전체 리모델링을 고려하는 고객 대상 이벤트'
    }
  ]

  // 필터링된 이벤트 목록
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.partner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || event.type === filterType
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusCount = (status: EventStatus) => {
    return events.filter(event => event.status === status).length
  }

  const getTypeCount = (type: EventType) => {
    return events.filter(event => event.type === type).length
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
            새 이벤트 등록
          </Link>
        </Button>
      </div>

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
          {(filterType !== 'all' || filterStatus !== 'all' || searchTerm) && (
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
      {filteredEvents.length > 0 ? (
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
            <Link to="/events/create">첫 번째 이벤트 등록하기</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default EventList