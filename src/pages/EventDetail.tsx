import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  MapPin, 
  Users, 
  Target,
  TrendingUp,
  TrendingDown,
  FileText,
  Phone,
  Loader2
} from 'lucide-react'
import { EventData } from '@/components/EventCard'
import { useEvents, type Event } from '@/hooks/useEvents'

const EventDetail = () => {
  const { id } = useParams()
  const { events, loading } = useEvents()
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)

  useEffect(() => {
    if (events.length > 0 && id) {
      const event = events.find(e => e.id === id)
      setCurrentEvent(event || null)
    }
  }, [events, id])

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">이벤트 정보를 불러오는 중...</span>
      </div>
    )
  }

  // 이벤트를 찾지 못한 경우
  if (!currentEvent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">이벤트를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-4">
          요청하신 이벤트가 존재하지 않거나 삭제되었습니다.
          {id && !id.includes('-') && (
            <span className="block mt-2 text-sm">
              (올바른 이벤트 ID 형식이 아닙니다)
            </span>
          )}
        </p>
        <div className="space-x-2">
          <Button asChild>
            <Link to="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              이벤트 목록으로 돌아가기
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              대시보드로 이동
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '계획중': return 'bg-muted text-muted-foreground'
      case '진행중': return 'bg-primary text-primary-foreground'
      case '완료': return 'bg-success text-success-foreground'
      case '취소': return 'bg-danger text-danger-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case '라이브커머스': return 'bg-blue-100 text-blue-800 border-blue-200'
      case '베이비페어': return 'bg-pink-100 text-pink-800 border-pink-200'
      case '입주박람회': return 'bg-green-100 text-green-800 border-green-200'
      case '인플루언서공구': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const calculateRate = (actual: number, target: number) => {
    if (target === 0) return 0
    return Math.round((actual / target) * 100)
  }

  // 장당비용 계산
  const costPerSqm = currentEvent.actual_sqm > 0 
    ? Math.round((currentEvent.total_cost || 0) / currentEvent.actual_sqm)
    : 0

  const kpiData = [
    {
      title: '계약건수',
      target: currentEvent.target_contracts,
      actual: currentEvent.actual_contracts || 0,
      unit: '건',
      rate: calculateRate(currentEvent.actual_contracts || 0, currentEvent.target_contracts)
    },
    {
      title: '견적건수',
      target: currentEvent.target_estimates,
      actual: currentEvent.actual_estimates || 0,
      unit: '건',
      rate: calculateRate(currentEvent.actual_estimates || 0, currentEvent.target_estimates)
    },
    {
      title: '계약장수',
      target: currentEvent.target_sqm,
      actual: currentEvent.actual_sqm || 0,
      unit: '장',
      rate: calculateRate(currentEvent.actual_sqm || 0, currentEvent.target_sqm)
    },
    {
      title: '장당비용',
      target: null, // 장당비용은 목표값이 없으므로 null
      actual: costPerSqm,
      unit: '원/장',
      rate: null // 달성률도 없음
    }
  ]

  // 비용 내역 데이터 생성
  const generateCostItems = () => {
    const totalCost = Number(currentEvent.total_cost) || 0
    if (totalCost === 0) return []

    if (currentEvent.type === '라이브커머스') {
      return [
        { item: '라이브 스튜디오 대여', amount: Math.round(totalCost * 0.3), note: '스튜디오 임대비용' },
        { item: '제품 배송비', amount: Math.round(totalCost * 0.1), note: '샘플 제품 배송' },
        { item: '광고비', amount: Math.round(totalCost * 0.6), note: '온라인 광고비' }
      ]
    } else if (currentEvent.type === '베이비페어') {
      return [
        { item: '부스 임대료', amount: Math.round(totalCost * 0.4), note: '전시 부스 임대' },
        { item: '제품 운송비', amount: Math.round(totalCost * 0.2), note: '전시용 제품 운송' },
        { item: '홍보비', amount: Math.round(totalCost * 0.4), note: '박람회 홍보 및 마케팅' }
      ]
    } else if (currentEvent.type === '입주박람회') {
      return [
        { item: '부스 설치비', amount: Math.round(totalCost * 0.35), note: '부스 설치 및 장식' },
        { item: '카탈로그 제작', amount: Math.round(totalCost * 0.15), note: '홍보 자료 제작' },
        { item: '운영비', amount: Math.round(totalCost * 0.5), note: '현장 운영비용' }
      ]
    } else {
      return [
        { item: '이벤트 운영비', amount: totalCost, note: '전체 이벤트 운영비용' }
      ]
    }
  }

  const costItems = generateCostItems()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getTypeColor(currentEvent.type)}>
                {currentEvent.type}
              </Badge>
              <Badge className={getStatusColor(currentEvent.status)}>
                {currentEvent.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{currentEvent.title}</h1>
          </div>
        </div>
        <Button asChild>
          <Link to={`/events/${currentEvent.id}/edit`}>
            <Edit className="w-4 h-4 mr-2" />
            수정
          </Link>
        </Button>
      </div>

      {/* 상단 요약 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">이벤트 기간</div>
                <div className="text-xs text-muted-foreground">
                  {currentEvent.start_date} ~ {currentEvent.end_date}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">제휴 파트너</div>
                <div className="text-xs text-muted-foreground">{currentEvent.partner || '미정'}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">목표 계약건수</div>
                <div className="text-xs text-muted-foreground">{currentEvent.target_contracts}건</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">총 예산</div>
                <div className="text-xs text-muted-foreground">
                  {Number(currentEvent.total_cost).toLocaleString()}원
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 왼쪽 영역 - 기본 정보 및 실적 */}
        <div className="xl:col-span-2 space-y-6">
          {/* KPI 성과 대시보드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>KPI 성과 대시보드</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {kpiData.map((kpi, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{kpi.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {kpi.title === '장당비용' ? (
                          `${kpi.actual.toLocaleString()}${kpi.unit}`
                        ) : (
                          `${kpi.actual}/${kpi.target}${kpi.unit}`
                        )}
                      </span>
                    </div>
                    {kpi.rate !== null && (
                      <>
                        <Progress value={kpi.rate} className="h-2" />
                        <div className="text-right">
                          <span className={`text-sm font-medium ${
                            kpi.rate >= 100 ? 'text-success' :
                            kpi.rate >= 80 ? 'text-warning' : 'text-danger'
                          }`}>
                            달성률 {kpi.rate}%
                          </span>
                        </div>
                      </>
                    )}
                    {kpi.title === '장당비용' && (
                      <div className="text-right">
                        <span className="text-sm font-medium text-muted-foreground">
                          장당 평균 비용
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 상세 실적 데이터 */}
          <Card>
            <CardHeader>
              <CardTitle>상세 실적 데이터</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">계약 현황</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">목표 계약건수</span>
                      <span className="text-sm font-medium">{currentEvent.target_contracts}건</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">실제 계약건수</span>
                      <span className="text-sm font-medium">{currentEvent.actual_contracts}건</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">목표 계약장수</span>
                      <span className="text-sm font-medium">{currentEvent.target_sqm}장</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">실제 계약장수</span>
                      <span className="text-sm font-medium">{currentEvent.actual_sqm}장</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">견적 현황</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">목표 견적건수</span>
                      <span className="text-sm font-medium">{currentEvent.target_estimates}건</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">실제 견적건수</span>
                      <span className="text-sm font-medium">{currentEvent.actual_estimates}건</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">견적→계약 전환율</span>
                      <span className="text-sm font-medium">
                        {currentEvent.actual_estimates > 0 
                          ? Math.round((currentEvent.actual_contracts / currentEvent.actual_estimates) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">효율성 지수</span>
                      <span className="text-sm font-medium">{currentEvent.efficiency}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 비용 내역 */}
          {costItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>비용 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costItems.map((cost, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{cost.item}</div>
                        <div className="text-sm text-muted-foreground">{cost.note}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{cost.amount.toLocaleString()}원</div>
                        <div className="text-xs text-muted-foreground">
                          {((cost.amount / Number(currentEvent.total_cost)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between font-medium">
                      <span>총 비용</span>
                      <span>{Number(currentEvent.total_cost).toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 실행 보고서 */}
          <Card>
            <CardHeader>
              <CardTitle>실행 보고서</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">진행 상황</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    현재 이벤트가 순조롭게 진행 중입니다. 목표 대비 달성률이 양호한 편이며, 
                    특히 견적 문의가 예상보다 많이 들어오고 있습니다.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    최종 업데이트: {new Date(currentEvent.updated_at).toLocaleString('ko-KR')}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">주요 성과</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span>
                        계약 달성률 {calculateRate(currentEvent.actual_contracts || 0, currentEvent.target_contracts)}% 
                        ({currentEvent.actual_contracts}/{currentEvent.target_contracts}건)
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span>
                        견적 달성률 {calculateRate(currentEvent.actual_estimates || 0, currentEvent.target_estimates)}%
                        ({currentEvent.actual_estimates}/{currentEvent.target_estimates}건)
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span>
                        장수 달성률 {calculateRate(currentEvent.actual_sqm || 0, currentEvent.target_sqm)}%
                        ({currentEvent.actual_sqm}/{currentEvent.target_sqm}장)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽 영역 - 추가 정보 */}
        <div className="space-y-6">
          {/* 이벤트 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>이벤트 상세정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">이벤트 기간</div>
                    <div className="text-sm text-muted-foreground">
                      {currentEvent.start_date} ~ {currentEvent.end_date}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">장소</div>
                    <div className="text-sm text-muted-foreground">
                      {currentEvent.type === '라이브커머스' ? '온라인 라이브 스튜디오' : 
                       currentEvent.type === '베이비페어' ? '롯데월드몰 베이비페어' :
                       currentEvent.type === '입주박람회' ? '킨텍스 전시장' : '미정'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">제휴 파트너</div>
                    <div className="text-sm text-muted-foreground">{currentEvent.partner || '미정'}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">담당자</div>
                    <div className="text-sm text-muted-foreground">김영업 (010-1234-5678)</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-2 text-sm">이벤트 설명</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentEvent.type === '라이브커머스' && 
                    '신혼부부를 대상으로 한 맞춤형 인테리어 라이브 쇼핑 이벤트입니다.'}
                  {currentEvent.type === '베이비페어' && 
                    '예비 부모와 육아맘을 위한 베이비용품 전시 및 판매 이벤트입니다.'}
                  {currentEvent.type === '입주박람회' && 
                    '신규 아파트 입주민을 위한 인테리어 상담 및 계약 이벤트입니다.'}
                  {currentEvent.type === '인플루언서공구' && 
                    '인플루언서와 함께하는 특가 공동구매 이벤트입니다.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 일정 및 마일스톤 */}
          <Card>
            <CardHeader>
              <CardTitle>이벤트 일정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">이벤트 시작</div>
                    <div className="text-xs text-muted-foreground">{currentEvent.start_date}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">중간 점검</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date((new Date(currentEvent.start_date).getTime() + new Date(currentEvent.end_date).getTime()) / 2).toISOString().split('T')[0]}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">이벤트 종료</div>
                    <div className="text-xs text-muted-foreground">{currentEvent.end_date}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 빠른 액션 */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                실적 데이터 입력
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                보고서 생성
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to={`/events/${currentEvent.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  이벤트 수정
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EventDetail