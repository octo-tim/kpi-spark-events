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
import { ArrowLeft, Save, Plus, X, DollarSign, MessageSquare, Target, BarChart3, TrendingUp } from 'lucide-react'
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
    contactPerson: '김영업',
    contactPhone: '010-1234-5678',
    customerReaction: '',
    eventSummary: ''
  })

  // 비용내역 관리
  const [costItems, setCostItems] = useState([
    { item: '', amount: '', note: '' },
    { item: '', amount: '', note: '' },
    { item: '', amount: '', note: '' }
  ])

  // 계획 달성 현황 (실행계획 제목들 - 실제로는 이벤트 생성 시 저장된 제목들을 가져와야 함)
  const [executionPlans] = useState([
    '마케팅 캠페인 실행',
    '고객 응대 강화',
    '제품 진열 최적화'
  ])
  const [planAchievements, setPlanAchievements] = useState(
    executionPlans.map(title => ({ title, content: '' }))
  )

  // 향후 개선 방향
  const [improvements, setImprovements] = useState([
    { title: '', content: '' },
    { title: '', content: '' },
    { title: '', content: '' }
  ])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCostItemChange = (index: number, field: 'item' | 'amount' | 'note', value: string) => {
    setCostItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const addCostItem = () => {
    setCostItems(prev => [...prev, { item: '', amount: '', note: '' }])
  }

  const removeCostItem = (index: number) => {
    if (costItems.length > 1) {
      setCostItems(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handlePlanAchievementChange = (index: number, content: string) => {
    setPlanAchievements(prev => prev.map((plan, i) => 
      i === index ? { ...plan, content } : plan
    ))
  }

  const handleImprovementChange = (index: number, field: 'title' | 'content', value: string) => {
    setImprovements(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const addImprovement = () => {
    setImprovements(prev => [...prev, { title: '', content: '' }])
  }

  const removeImprovement = (index: number) => {
    if (improvements.length > 1) {
      setImprovements(prev => prev.filter((_, i) => i !== index))
    }
  }

  const getTotalCost = () => {
    return costItems.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0
      return total + amount
    }, 0)
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

        {/* 비용내역 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>비용내역</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {costItems.map((cost, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor={`costItem${index}`}>항목</Label>
                    <Input
                      id={`costItem${index}`}
                      value={cost.item}
                      onChange={(e) => handleCostItemChange(index, 'item', e.target.value)}
                      placeholder="비용 항목"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`costAmount${index}`}>금액</Label>
                    <Input
                      id={`costAmount${index}`}
                      type="number"
                      value={cost.amount}
                      onChange={(e) => handleCostItemChange(index, 'amount', e.target.value)}
                      placeholder="금액"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`costNote${index}`}>비고</Label>
                    <Input
                      id={`costNote${index}`}
                      value={cost.note}
                      onChange={(e) => handleCostItemChange(index, 'note', e.target.value)}
                      placeholder="비고"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    {costItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCostItem(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={addCostItem}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>항목 추가</span>
              </Button>
              
              <div className="text-lg font-semibold">
                총 금액: {getTotalCost().toLocaleString()}원
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
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
          </CardContent>
        </Card>

        {/* 고객반응 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>고객반응</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              이벤트 기간내 고객의 반응을 정성 또는 정량적으로 기술하세요
            </p>
            <div className="space-y-2">
              <Label htmlFor="customerReaction">고객반응 상세</Label>
              <Textarea
                id="customerReaction"
                value={formData.customerReaction}
                onChange={(e) => handleInputChange('customerReaction', e.target.value)}
                placeholder="고객의 반응을 구체적으로 입력하세요"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* 계획 달성 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>계획 달성 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {planAchievements.map((plan, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{plan.title}</Label>
                  <Textarea
                    value={plan.content}
                    onChange={(e) => handlePlanAchievementChange(index, e.target.value)}
                    placeholder="해당 계획의 달성 현황을 입력하세요"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 이벤트 총평 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>이벤트 총평</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              이벤트에 대한 전반적인 결과를 요약하세요
            </p>
            <div className="space-y-2">
              <Label htmlFor="eventSummary">이벤트 총평</Label>
              <Textarea
                id="eventSummary"
                value={formData.eventSummary}
                onChange={(e) => handleInputChange('eventSummary', e.target.value)}
                placeholder="이벤트 전반적인 결과와 성과를 요약해주세요"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* 향후 개선 방향 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>향후 개선 방향</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {improvements.map((improvement, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">개선사항 {index + 1}</Label>
                  {improvements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImprovement(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`improvementTitle${index}`}>제목</Label>
                  <Input
                    id={`improvementTitle${index}`}
                    value={improvement.title}
                    onChange={(e) => handleImprovementChange(index, 'title', e.target.value)}
                    placeholder="개선사항 제목을 입력하세요"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`improvementContent${index}`}>세부내용</Label>
                  <Textarea
                    id={`improvementContent${index}`}
                    value={improvement.content}
                    onChange={(e) => handleImprovementChange(index, 'content', e.target.value)}
                    placeholder="개선사항 세부내용을 입력하세요"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addImprovement}
              className="w-full flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>개선사항 추가</span>
            </Button>
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