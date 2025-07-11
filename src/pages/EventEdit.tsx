import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Target, Plus, Trash2, Printer, Save, ArrowLeft, DollarSign, MessageSquare, BarChart3, TrendingUp, X } from 'lucide-react'
import { EventType, EventStatus } from '@/components/EventCard'
import { Link } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useEvents } from '@/hooks/useEvents'

const EventEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const { events, loading } = useEvents()
  const printRef = useRef<HTMLDivElement>(null)

  // 현재 이벤트 데이터 상태
  const [currentEvent, setCurrentEvent] = useState<any>(null)
  
  // 이벤트 데이터가 로드되면 폼 데이터로 설정
  const [formData, setFormData] = useState({
    title: '',
    type: '라이브커머스' as EventType,
    status: '계획중' as EventStatus,
    startDate: '',
    endDate: '',
    location: '',
    partner: '',
    targetContracts: '',
    actualContracts: '',
    targetEstimates: '',
    actualEstimates: '',
    targetSqm: '',
    actualSqm: '',
    totalCost: '',
    description: '',
    contactPerson: '',
    contactPhone: '',
    customerReaction: '',
    eventSummary: ''
  })

  // URL의 ID에 해당하는 이벤트 찾기 및 폼 데이터 설정
  useEffect(() => {
    if (events.length > 0 && id) {
      const event = events.find(e => e.id === id)
      if (event) {
        setCurrentEvent(event)
        setFormData({
          title: event.title,
          type: event.type as EventType,
          status: event.status as EventStatus,
          startDate: event.start_date,
          endDate: event.end_date,
          location: '',
          partner: event.partner || '',
          targetContracts: String(event.target_contracts || ''),
          actualContracts: String(event.actual_contracts || ''),
          targetEstimates: String(event.target_estimates || ''),
          actualEstimates: String(event.actual_estimates || ''),
          targetSqm: String(event.target_sqm || ''),
          actualSqm: String(event.actual_sqm || ''),
          totalCost: String(event.total_cost || ''),
          description: '',
          contactPerson: '',
          contactPhone: '',
          customerReaction: '',
          eventSummary: ''
        })
        
        // 실제 총비용을 기반으로 비용내역 생성
        const totalCost = Number(event.total_cost) || 0
        if (totalCost > 0) {
          // 이벤트 타입에 따른 기본 비용 항목 설정
          let defaultCostItems = []
          if (event.type === '라이브커머스') {
            defaultCostItems = [
              { item: '라이브 스튜디오 대여', amount: String(Math.round(totalCost * 0.3)), note: '스튜디오 임대비용' },
              { item: '제품 배송비', amount: String(Math.round(totalCost * 0.1)), note: '샘플 제품 배송' },
              { item: '광고비', amount: String(Math.round(totalCost * 0.6)), note: '온라인 광고비' }
            ]
          } else if (event.type === '베이비페어') {
            defaultCostItems = [
              { item: '부스 임대료', amount: String(Math.round(totalCost * 0.4)), note: '전시 부스 임대' },
              { item: '제품 운송비', amount: String(Math.round(totalCost * 0.2)), note: '전시용 제품 운송' },
              { item: '홍보비', amount: String(Math.round(totalCost * 0.4)), note: '박람회 홍보 및 마케팅' }
            ]
          } else {
            defaultCostItems = [
              { item: '이벤트 운영비', amount: String(totalCost), note: '전체 이벤트 운영비용' }
            ]
          }
          setCostItems(defaultCostItems)
        }
      }
    }
  }, [events, id])

  // 비용내역 관리 - 실제 데이터 기반으로 초기화
  const [costItems, setCostItems] = useState([
    { item: '', amount: '', note: '' }
  ])

  // 계획 달성 현황
  const [planAchievements, setPlanAchievements] = useState([
    { title: '마케팅 캠페인 실행', content: '네이버 쇼핑라이브 메인 노출 및 SNS 광고를 통해 목표 조회수 80% 달성. 실시간 시청자 수는 평균 1,200명으로 예상보다 높은 참여도를 보였습니다.' },
    { title: '고객 응대 강화', content: '실시간 채팅 응답률 95% 달성. 전담 상담사 2명 배치로 즉시 응답 체계 구축. 고객 만족도 설문에서 4.3/5점 기록했습니다.' },
    { title: '제품 진열 최적화', content: '라이브 스튜디오 내 제품 진열을 고객 동선에 맞게 최적화. 제품별 노출 시간을 균등하게 배분하여 전체 제품에 대한 관심도를 높였습니다.' }
  ])

  // 향후 개선 방향
  const [improvements, setImprovements] = useState([
    { title: '사전 홍보 강화', content: '이벤트 시작 1주일 전부터 타겟 고객층에 맞춤형 사전 홍보를 진행하여 참여율을 높일 필요가 있습니다.' },
    { title: '인터랙티브 요소 추가', content: '실시간 퀴즈, 경품 추첨 등 참여형 콘텐츠를 더 많이 포함하여 시청자 참여도를 높이겠습니다.' },
    { title: '팔로우업 시스템 구축', content: '이벤트 참여 고객에 대한 지속적인 관리 시스템을 구축하여 재구매율을 높이는 방안을 마련하겠습니다.' }
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

  const handlePlanAchievementChange = (index: number, field: 'title' | 'content', value: string) => {
    setPlanAchievements(prev => prev.map((plan, i) => 
      i === index ? { ...plan, [field]: value } : plan
    ))
  }

  const addPlanAchievement = () => {
    setPlanAchievements(prev => [...prev, { title: '', content: '' }])
  }

  const removePlanAchievement = (index: number) => {
    if (planAchievements.length > 1) {
      setPlanAchievements(prev => prev.filter((_, i) => i !== index))
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id) return

    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: formData.title,
          type: formData.type,
          status: formData.status,
          start_date: formData.startDate,
          end_date: formData.endDate,
          partner: formData.partner,
          target_contracts: parseInt(formData.targetContracts) || 0,
          target_estimates: parseInt(formData.targetEstimates) || 0,
          target_sqm: parseInt(formData.targetSqm) || 0,
          actual_contracts: parseInt(formData.actualContracts) || 0,
          actual_estimates: parseInt(formData.actualEstimates) || 0,
          actual_sqm: parseInt(formData.actualSqm) || 0,
          total_cost: parseInt(formData.totalCost) || 0
        })
        .eq('id', id)
        .select()

      if (error) {
        console.error('이벤트 수정 오류:', error)
        toast({
          title: "오류",
          description: "이벤트 수정 중 오류가 발생했습니다.",
          variant: "destructive"
        })
        return
      }

      toast({
        title: "성공",
        description: "이벤트가 성공적으로 수정되었습니다."
      })

      navigate(`/events/${id}`)
    } catch (error) {
      console.error('이벤트 수정 오류:', error)
      toast({
        title: "오류",
        description: "이벤트 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  })

  const eventTypes: EventType[] = ['라이브커머스', '베이비페어', '입주박람회', '인플루언서공구']
  const eventStatuses: EventStatus[] = ['계획중', '진행중', '완료', '취소']

  return (
    <div className="space-y-6" ref={printRef}>
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/events/${id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            상세보기로
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">보고서작성</h1>
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
                <div className="flex items-center justify-between">
                  <div /> {/* 빈 공간 */}
                  {planAchievements.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlanAchievement(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`planTitle${index}`}>제목</Label>
                  <Input
                    id={`planTitle${index}`}
                    value={plan.title}
                    onChange={(e) => handlePlanAchievementChange(index, 'title', e.target.value)}
                    placeholder="계획 제목을 입력하세요"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`planContent${index}`}>달성 현황</Label>
                  <Textarea
                    id={`planContent${index}`}
                    value={plan.content}
                    onChange={(e) => handlePlanAchievementChange(index, 'content', e.target.value)}
                    placeholder="해당 계획의 달성 현황을 입력하세요"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addPlanAchievement}
              className="w-full flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>계획 추가</span>
            </Button>
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

        {/* 제출 및 출력 버튼 */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handlePrint} className="flex items-center space-x-2">
            <Printer className="w-4 h-4" />
            <span>PDF 출력</span>
          </Button>
          
          <div className="flex space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link to={`/events/${id}`}>취소</Link>
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EventEdit