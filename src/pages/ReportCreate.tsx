import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, FileText } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { useToast } from '@/hooks/use-toast'

const ReportCreate = () => {
  const navigate = useNavigate()
  const { events, loading } = useEvents()
  const { toast } = useToast()
  
  const [selectedEventId, setSelectedEventId] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [formData, setFormData] = useState({
    actualContracts: '',
    actualEstimates: '',
    actualSqm: '',
    efficiency: '',
    customerFeedback: '',
    eventReview: '',
    futureImprovements: ''
  })

  // 선택된 이벤트가 변경될 때 데이터 로드
  useEffect(() => {
    if (selectedEventId) {
      const event = events.find(e => e.id === selectedEventId)
      if (event) {
        setSelectedEvent(event)
        setFormData({
          actualContracts: event.actual_contracts?.toString() || '',
          actualEstimates: event.actual_estimates?.toString() || '',
          actualSqm: event.actual_sqm?.toString() || '',
          efficiency: event.efficiency?.toString() || '',
          customerFeedback: event.customer_feedback || '',
          eventReview: event.event_review || '',
          futureImprovements: event.future_improvements || ''
        })
      }
    }
  }, [selectedEventId, events])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedEventId) {
      toast({
        title: "오류",
        description: "이벤트를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      // 여기에 보고서 업데이트 로직 추가
      toast({
        title: "성공",
        description: "보고서가 성공적으로 업데이트되었습니다.",
      })
      
      navigate('/reports')
    } catch (error) {
      toast({
        title: "오류",
        description: "보고서 업데이트에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/\s/g, '')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/reports">
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
        {/* 이벤트 선택 */}
        <Card>
          <CardHeader>
            <CardTitle>이벤트 선택</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="eventSelect">보고서를 작성할 이벤트 선택</Label>
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="이벤트를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} ({event.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 기본 정보 - 선택된 이벤트 표시 */}
        {selectedEvent && (
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>이벤트명</Label>
                  <div className="p-3 bg-muted rounded-md">
                    {selectedEvent.title}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>이벤트 유형</Label>
                  <div className="p-3 bg-muted rounded-md">
                    {selectedEvent.type}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>상태</Label>
                  <div className="p-3 bg-muted rounded-md">
                    {selectedEvent.status}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>시작일</Label>
                  <div className="p-3 bg-muted rounded-md">
                    {formatDate(selectedEvent.start_date)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>종료일</Label>
                  <div className="p-3 bg-muted rounded-md">
                    {formatDate(selectedEvent.end_date)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>제휴 파트너</Label>
                  <div className="p-3 bg-muted rounded-md">
                    {selectedEvent.partner || '-'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 실적 데이터 입력 */}
        {selectedEvent && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>실적 데이터</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actualContracts">실제 계약건수</Label>
                    <Input
                      id="actualContracts"
                      type="number"
                      value={formData.actualContracts}
                      onChange={(e) => handleInputChange('actualContracts', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="actualEstimates">실제 견적건수</Label>
                    <Input
                      id="actualEstimates"
                      type="number"
                      value={formData.actualEstimates}
                      onChange={(e) => handleInputChange('actualEstimates', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="actualSqm">실제 계약장수</Label>
                    <Input
                      id="actualSqm"
                      type="number"
                      value={formData.actualSqm}
                      onChange={(e) => handleInputChange('actualSqm', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="efficiency">효율성 (%)</Label>
                  <Input
                    id="efficiency"
                    type="number"
                    value={formData.efficiency}
                    onChange={(e) => handleInputChange('efficiency', e.target.value)}
                    placeholder="0"
                    max="100"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>이벤트 평가</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerFeedback">고객 피드백</Label>
                  <Textarea
                    id="customerFeedback"
                    value={formData.customerFeedback}
                    onChange={(e) => handleInputChange('customerFeedback', e.target.value)}
                    placeholder="고객들의 반응과 피드백을 입력하세요"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventReview">이벤트 리뷰</Label>
                  <Textarea
                    id="eventReview"
                    value={formData.eventReview}
                    onChange={(e) => handleInputChange('eventReview', e.target.value)}
                    placeholder="이벤트 전반에 대한 평가를 입력하세요"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="futureImprovements">향후 개선사항</Label>
                  <Textarea
                    id="futureImprovements"
                    value={formData.futureImprovements}
                    onChange={(e) => handleInputChange('futureImprovements', e.target.value)}
                    placeholder="다음 이벤트를 위한 개선사항을 입력하세요"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* 제출 버튼 */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/reports">취소</Link>
          </Button>
          <Button type="submit" disabled={!selectedEventId}>
            <Save className="w-4 h-4 mr-2" />
            보고서 저장
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReportCreate