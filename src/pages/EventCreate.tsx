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
import { Calendar, MapPin, Users, Target, ArrowLeft, Gift, FileText, Printer, Plus, X, ListChecks, UserPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { EventType } from '@/components/EventCard'
import { useReactToPrint } from 'react-to-print'
import { useRef, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { EventStatus } from '@/components/EventCard'
import EventManagerForm from '@/components/EventManagerForm'
import PartnerForm from '@/components/PartnerForm'
import LocationForm from '@/components/LocationForm'

const EventCreate = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)
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
    targetCostPerSqm: '',
    totalCost: '',
    status: '계획중' as EventStatus,
    description: '',
    budget: '',
    manager: '',
    // 프로모션 항목
    salePrice: '',
    additionalDiscount: '',
    additionalDiscountCondition: '',
    constructionCost: '',
    constructionDiscountCondition: '',
    estimateGift: '',
    constructionGift: '',
    fieldEvent: '',
    // 전회차 반영사항
    previousReflection: ''
  })

  const [executionPlans, setExecutionPlans] = useState([
    { title: '', content: '' },
    { title: '', content: '' },
    { title: '', content: '' }
  ])
  
  const [showManagerForm, setShowManagerForm] = useState(false)
  const [showPartnerForm, setShowPartnerForm] = useState(false)
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [eventManagers, setEventManagers] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])

  // 데이터 로드
  useEffect(() => {
    loadEventManagers()
    loadPartners()
    loadLocations()
  }, [])

  const loadEventManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('event_managers')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setEventManagers(data || [])
    } catch (error) {
      console.error('Error loading managers:', error)
    }
  }

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setPartners(data || [])
    } catch (error) {
      console.error('Error loading partners:', error)
    }
  }

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setLocations(data || [])
    } catch (error) {
      console.error('Error loading locations:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleExecutionPlanChange = (index: number, field: 'title' | 'content', value: string) => {
    setExecutionPlans(prev => prev.map((plan, i) => 
      i === index ? { ...plan, [field]: value } : plan
    ))
  }

  const addExecutionPlan = () => {
    setExecutionPlans(prev => [...prev, { title: '', content: '' }])
  }

  const removeExecutionPlan = (index: number) => {
    if (executionPlans.length > 1) {
      setExecutionPlans(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: formData.title,
            type: formData.type,
            status: formData.status,
            start_date: formData.startDate,
            end_date: formData.endDate,
            partner: formData.partner,
            target_contracts: parseInt(formData.targetContracts) || 0,
            target_estimates: parseInt(formData.targetEstimates) || 0,
            target_sqm: parseInt(formData.targetSqm) || 0,
            target_cost_per_sqm: parseInt(formData.targetCostPerSqm) || 0,
            total_cost: parseInt(formData.totalCost) || 0
          }
        ])
        .select()

      if (error) {
        console.error('이벤트 생성 오류:', error)
        toast({
          title: "오류",
          description: "이벤트 생성 중 오류가 발생했습니다.",
          variant: "destructive"
        })
        return
      }

      toast({
        title: "성공",
        description: "이벤트가 성공적으로 생성되었습니다."
      })

      navigate('/events')
    } catch (error) {
      console.error('이벤트 생성 오류:', error)
      toast({
        title: "오류",
        description: "이벤트 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  })

  const eventTypes: EventType[] = ['라이브커머스', '베이비페어', '입주박람회', '인플루언서공구']

  return (
    <div className="space-y-6" ref={printRef}>
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">새 이벤트 기획</h1>
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

            <div className="space-y-2">
              <Label htmlFor="manager">이벤트 담당자</Label>
              <div className="flex space-x-2">
                <Select value={formData.manager} onValueChange={(value) => handleInputChange('manager', value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="담당자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventManagers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.name}>
                        {manager.name} ({manager.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManagerForm(true)}
                  className="flex items-center space-x-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>신규</span>
                </Button>
              </div>
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
                <div className="flex space-x-2">
                  <Select value={formData.partner} onValueChange={(value) => handleInputChange('partner', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="파트너 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.name}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPartnerForm(true)}
                    className="flex items-center space-x-1"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>신규</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">장소</Label>
                <div className="flex space-x-2">
                  <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="장소 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLocationForm(true)}
                    className="flex items-center space-x-1"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>신규</span>
                  </Button>
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="targetCostPerSqm">목표 장당비용 *</Label>
                <Input
                  id="targetCostPerSqm"
                  type="number"
                  value={formData.targetCostPerSqm}
                  onChange={(e) => handleInputChange('targetCostPerSqm', e.target.value)}
                  placeholder="원"
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

        {/* 프로모션 항목 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5" />
              <span>프로모션</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 판매단가 (전체 너비) */}
            <div className="space-y-2">
              <Label htmlFor="salePrice">판매단가</Label>
              <Input
                id="salePrice"
                type="number"
                value={formData.salePrice}
                onChange={(e) => handleInputChange('salePrice', e.target.value)}
                placeholder="판매단가를 입력하세요"
                min="0"
              />
            </div>

            {/* 추가할인, 추가할인 조건 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="additionalDiscount">추가할인</Label>
                <Input
                  id="additionalDiscount"
                  value={formData.additionalDiscount}
                  onChange={(e) => handleInputChange('additionalDiscount', e.target.value)}
                  placeholder="추가할인을 입력하세요"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalDiscountCondition">추가할인 조건</Label>
                <Input
                  id="additionalDiscountCondition"
                  value={formData.additionalDiscountCondition}
                  onChange={(e) => handleInputChange('additionalDiscountCondition', e.target.value)}
                  placeholder="추가할인 조건을 입력하세요"
                />
              </div>
            </div>

            {/* 시공비, 시공비할인조건 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="constructionCost">시공비</Label>
                <Input
                  id="constructionCost"
                  type="number"
                  value={formData.constructionCost}
                  onChange={(e) => handleInputChange('constructionCost', e.target.value)}
                  placeholder="시공비를 입력하세요"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="constructionDiscountCondition">시공비할인조건</Label>
                <Input
                  id="constructionDiscountCondition"
                  value={formData.constructionDiscountCondition}
                  onChange={(e) => handleInputChange('constructionDiscountCondition', e.target.value)}
                  placeholder="시공비할인조건을 입력하세요"
                />
              </div>
            </div>

            {/* 견적사은품, 시공사은품 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimateGift">견적사은품</Label>
                <Input
                  id="estimateGift"
                  value={formData.estimateGift}
                  onChange={(e) => handleInputChange('estimateGift', e.target.value)}
                  placeholder="견적사은품을 입력하세요"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="constructionGift">시공사은품</Label>
                <Input
                  id="constructionGift"
                  value={formData.constructionGift}
                  onChange={(e) => handleInputChange('constructionGift', e.target.value)}
                  placeholder="시공사은품을 입력하세요"
                />
              </div>
            </div>

            {/* 현장이벤트 */}
            <div className="space-y-2">
              <Label htmlFor="fieldEvent">현장이벤트</Label>
              <Textarea
                id="fieldEvent"
                value={formData.fieldEvent}
                onChange={(e) => handleInputChange('fieldEvent', e.target.value)}
                placeholder="현장이벤트 내용을 입력하세요"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* 전회차 반영사항 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>전회차 반영사항</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="previousReflection">전회차 반영사항</Label>
              <Textarea
                id="previousReflection"
                value={formData.previousReflection}
                onChange={(e) => handleInputChange('previousReflection', e.target.value)}
                placeholder="전회차 이벤트의 결과보고서 주요 내용을 요약하세요."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* 실행계획 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ListChecks className="w-5 h-5" />
              <span>실행계획</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {executionPlans.map((plan, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">계획 {index + 1}</span>
                  {executionPlans.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExecutionPlan(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`executionTitle${index}`}>제목</Label>
                  <Input
                    id={`executionTitle${index}`}
                    value={plan.title}
                    onChange={(e) => handleExecutionPlanChange(index, 'title', e.target.value)}
                    placeholder="실행계획 제목을 입력하세요"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`executionContent${index}`}>내용</Label>
                  <Textarea
                    id={`executionContent${index}`}
                    value={plan.content}
                    onChange={(e) => handleExecutionPlanChange(index, 'content', e.target.value)}
                    placeholder="실행계획 내용을 입력하세요"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addExecutionPlan}
              className="w-full flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>실행계획 추가</span>
            </Button>
          </CardContent>
        </Card>

        {/* 담당자 등록 폼 */}
        {showManagerForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <EventManagerForm
                onSuccess={() => {
                  setShowManagerForm(false)
                  loadEventManagers()
                }}
                onCancel={() => setShowManagerForm(false)}
              />
            </div>
          </div>
        )}

        {/* 파트너 등록 폼 */}
        {showPartnerForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <PartnerForm
                onSuccess={() => {
                  setShowPartnerForm(false)
                  loadPartners()
                }}
                onCancel={() => setShowPartnerForm(false)}
              />
            </div>
          </div>
        )}

        {/* 장소 등록 폼 */}
        {showLocationForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <LocationForm
                onSuccess={() => {
                  setShowLocationForm(false)
                  loadLocations()
                }}
                onCancel={() => setShowLocationForm(false)}
              />
            </div>
          </div>
        )}

        {/* 제출 및 출력 버튼 */}
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handlePrint} className="flex items-center space-x-2">
            <Printer className="w-4 h-4" />
            <span>PDF 출력</span>
          </Button>
          
          <div className="flex space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/events">취소</Link>
            </Button>
            <Button type="submit">
              이벤트 기획
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EventCreate