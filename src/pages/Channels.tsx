import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Users,
  Phone,
  Mail,
  Building,
  TrendingUp
} from 'lucide-react'

const Channels = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  // 샘플 데이터 - 추후 Supabase 연동 시 실제 데이터로 교체
  const channels = [
    {
      id: '1',
      name: '네이버 쇼핑라이브',
      type: '라이브커머스',
      contactPerson: '김라이브',
      phone: '02-1234-5678',
      email: 'live@naver.com',
      company: '네이버',
      status: 'active',
      eventsCount: 8,
      totalContracts: 145,
      lastEventDate: '2024-01-20',
      performance: 89.2
    },
    {
      id: '2',
      name: '베이비페어 조직위',
      type: '베이비페어',
      contactPerson: '이베이비',
      phone: '02-2345-6789',
      email: 'baby@fair.com',
      company: '베이비페어',
      status: 'active',
      eventsCount: 6,
      totalContracts: 89,
      lastEventDate: '2024-01-14',
      performance: 87.5
    },
    {
      id: '3',
      name: '분당신도시개발',
      type: '입주박람회',
      contactPerson: '박입주',
      phone: '031-3456-7890',
      email: 'move@bundang.com',
      company: '분당신도시개발',
      status: 'active',
      eventsCount: 4,
      totalContracts: 67,
      lastEventDate: '2024-02-03',
      performance: 85.1
    },
    {
      id: '4',
      name: '인테리어_지니',
      type: '인플루언서공구',
      contactPerson: '최인플루',
      phone: '010-4567-8901',
      email: 'genie@interior.com',
      company: '개인',
      status: 'active',
      eventsCount: 7,
      totalContracts: 34,
      lastEventDate: '2024-01-30',
      performance: 82.3
    },
    {
      id: '5',
      name: '카카오 쇼핑라이브',
      type: '라이브커머스',
      contactPerson: '정카카오',
      phone: '02-5678-9012',
      email: 'shop@kakao.com',
      company: '카카오',
      status: 'inactive',
      eventsCount: 3,
      totalContracts: 22,
      lastEventDate: '2023-12-15',
      performance: 65.8
    }
  ]

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || channel.type === filterType
    
    return matchesSearch && matchesType
  })

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-success text-success-foreground">활성</Badge>
      : <Badge variant="secondary">비활성</Badge>
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      '라이브커머스': 'bg-blue-100 text-blue-800 border-blue-200',
      '베이비페어': 'bg-pink-100 text-pink-800 border-pink-200',
      '입주박람회': 'bg-green-100 text-green-800 border-green-200',
      '인플루언서공구': 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return <Badge className={colors[type as keyof typeof colors] || 'bg-muted text-muted-foreground'}>{type}</Badge>
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 85) return 'text-success'
    if (performance >= 70) return 'text-warning'
    return 'text-danger'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">채널 관리</h1>
          <p className="text-muted-foreground mt-2">
            제휴 채널과 파트너를 관리하고 성과를 추적하세요
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          새 채널 등록
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 채널</p>
                <p className="text-2xl font-bold">{channels.length}개</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">활성 채널</p>
                <p className="text-2xl font-bold text-success">
                  {channels.filter(c => c.status === 'active').length}개
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 이벤트</p>
                <p className="text-2xl font-bold">
                  {channels.reduce((sum, c) => sum + c.eventsCount, 0)}개
                </p>
              </div>
              <Building className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">평균 성과</p>
                <p className="text-2xl font-bold">
                  {Math.round(channels.reduce((sum, c) => sum + c.performance, 0) / channels.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="채널명이나 담당자명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="채널 유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 유형</SelectItem>
            <SelectItem value="라이브커머스">라이브커머스</SelectItem>
            <SelectItem value="베이비페어">베이비페어</SelectItem>
            <SelectItem value="입주박람회">입주박람회</SelectItem>
            <SelectItem value="인플루언서공구">인플루언서공구</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Channels List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChannels.map((channel) => (
          <Card key={channel.id} className="hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getTypeBadge(channel.type)}
                    {getStatusBadge(channel.status)}
                  </div>
                  <h3 className="text-lg font-semibold">{channel.name}</h3>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getPerformanceColor(channel.performance)}`}>
                    {channel.performance}%
                  </div>
                  <div className="text-xs text-muted-foreground">성과율</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{channel.contactPerson}</div>
                    <div className="text-sm text-muted-foreground">{channel.company}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{channel.phone}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{channel.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                <div className="text-center">
                  <div className="font-semibold">{channel.eventsCount}</div>
                  <div className="text-xs text-muted-foreground">이벤트</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{channel.totalContracts}</div>
                  <div className="text-xs text-muted-foreground">총 계약</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-xs">{channel.lastEventDate}</div>
                  <div className="text-xs text-muted-foreground">최근 이벤트</div>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  수정
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="w-4 h-4 mr-1" />
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChannels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm || filterType !== 'all' 
              ? '검색 조건에 맞는 채널이 없습니다.' 
              : '등록된 채널이 없습니다.'
            }
          </div>
          <Button className="mt-4">첫 번째 채널 등록하기</Button>
        </div>
      )}
    </div>
  )
}

export default Channels