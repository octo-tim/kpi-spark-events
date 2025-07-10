import React, { useState } from 'react'
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
import { Calendar, MapPin, Users, Target, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { EventType } from '@/components/EventCard'

const EventCreate = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    type: '' as EventType | '',
    startDate: '',
    endDate: '',
    location: '',
    partner: '',
    targetContracts: '',
    targetEstimates: '',
    targetSqm: '',
    description: '',
    budget: '',
    contactPerson: '',
    contactPhone: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Supabase 연동 시 실제 데이터 저장 로직 구현
    console.log('이벤트 등록:', formData)
    // 임시로 이벤트 목록으로 이동
    navigate('/events')
  }

  const eventTypes: EventType[] = ['라이브커머스', '베이비페어', '입주박람회', '인플루언서공구']

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">새 이벤트 등록</h1>
          <p className="text-muted-foreground mt-2">
            제휴채널 이벤트의 기본 정보와 목표를 설정하세요
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>기본 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">이벤트명 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="이벤트명을 입력하세요"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">이벤트 유형 *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="이벤트 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="description">이벤트 설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="이벤트에 대한 상세 설명을 입력하세요"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* 파트너 & 장소 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>파트너 & 장소 정보</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partner">제휴 파트너 *</Label>
                <Input
                  id="partner"
                  value={formData.partner}
                  onChange={(e) => handleInputChange('partner', e.target.value)}
                  placeholder="제휴 파트너명을 입력하세요"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">장소</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="이벤트 장소를 입력하세요"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">담당자명</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder="담당자명을 입력하세요"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone">담당자 연락처</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="담당자 연락처를 입력하세요"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 목표 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>KPI 목표 설정</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetContracts">목표 계약건수 *</Label>
                <Input
                  id="targetContracts"
                  type="number"
                  value={formData.targetContracts}
                  onChange={(e) => handleInputChange('targetContracts', e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetEstimates">목표 견적건수 *</Label>
                <Input
                  id="targetEstimates"
                  type="number"
                  value={formData.targetEstimates}
                  onChange={(e) => handleInputChange('targetEstimates', e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetSqm">목표 계약장수 *</Label>
                <Input
                  id="targetSqm"
                  type="number"
                  value={formData.targetSqm}
                  onChange={(e) => handleInputChange('targetSqm', e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">예상 예산</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="예산을 입력하세요"
                min="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/events">취소</Link>
          </Button>
          <Button type="submit">
            이벤트 등록
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EventCreate