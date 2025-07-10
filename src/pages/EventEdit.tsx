import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save } from 'lucide-react'
import { EventType, EventStatus } from '@/components/EventCard'

const EventEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // 기존 이벤트 데이터 로드 (샘플)
  const [formData, setFormData] = useState({
    title: '신혼가구 타겟 라이브 쇼핑',
    type: '라이브커머스' as EventType,
    status: '진행중' as EventStatus,
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    location: '온라인 라이브 스튜디오',
    partner: '네이버 쇼핑라이브',
    targetContracts: '50',
    actualContracts: '32',
    targetEstimates: '120',
    actualEstimates: '95',
    targetSqm: '1500',
    actualSqm: '960',
    description: '신혼부부를 대상으로 한 맞춤형 인테리어 라이브 쇼핑 이벤트',
    budget: '5000000',
    contactPerson: '김영업',
    contactPhone: '010-1234-5678',
    notes: '현재 진행 상황이 양호하며, 목표 달성 가능성이 높음'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Supabase 연동 시 실제 데이터 수정 로직 구현
    console.log('이벤트 수정:', formData)
    // 임시로 상세 페이지로 이동
    navigate(`/events/${id}`)
  }

  const eventTypes: EventType[] = ['라이브커머스', '베이비페어', '입주박람회', '인플루언서공구']
  const eventStatuses: EventStatus[] = ['계획중', '진행중', '완료', '취소']

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/events/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            상세보기로
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">이벤트 수정</h1>
          <p className="text-muted-foreground mt-2">
            이벤트 정보와 실적 데이터를 업데이트하세요
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">이벤트명 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">이벤트 유형 *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">상태 *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">시작일 *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">종료일 *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partner">제휴 파트너 *</Label>
                <Input
                  id="partner"
                  value={formData.partner}
                  onChange={(e) => handleInputChange('partner', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">장소</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">이벤트 설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* KPI 목표 및 실적 */}
        <Card>
          <CardHeader>
            <CardTitle>KPI 목표 및 실적</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-center">계약건수</h4>
                <div className="space-y-2">
                  <Label htmlFor="targetContracts">목표 *</Label>
                  <Input
                    id="targetContracts"
                    type="number"
                    value={formData.targetContracts}
                    onChange={(e) => handleInputChange('targetContracts', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualContracts">실적</Label>
                  <Input
                    id="actualContracts"
                    type="number"
                    value={formData.actualContracts}
                    onChange={(e) => handleInputChange('actualContracts', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-center">견적건수</h4>
                <div className="space-y-2">
                  <Label htmlFor="targetEstimates">목표 *</Label>
                  <Input
                    id="targetEstimates"
                    type="number"
                    value={formData.targetEstimates}
                    onChange={(e) => handleInputChange('targetEstimates', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualEstimates">실적</Label>
                  <Input
                    id="actualEstimates"
                    type="number"
                    value={formData.actualEstimates}
                    onChange={(e) => handleInputChange('actualEstimates', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-center">계약장수</h4>
                <div className="space-y-2">
                  <Label htmlFor="targetSqm">목표 *</Label>
                  <Input
                    id="targetSqm"
                    type="number"
                    value={formData.targetSqm}
                    onChange={(e) => handleInputChange('targetSqm', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualSqm">실적</Label>
                  <Input
                    id="actualSqm"
                    type="number"
                    value={formData.actualSqm}
                    onChange={(e) => handleInputChange('actualSqm', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 추가 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>추가 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">예산</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPerson">담당자명</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone">담당자 연락처</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">비고</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="추가 메모나 특이사항을 입력하세요"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link to={`/events/${id}`}>취소</Link>
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            저장
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EventEdit