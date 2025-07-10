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

          {/* 프로모션 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>프로모션 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">할인 혜택</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">판매단가</span>
                      <span className="text-sm font-medium">
                        {currentEvent.type === '라이브커머스' ? '120,000원/장' : 
                         currentEvent.type === '베이비페어' ? '89,000원/장' :
                         currentEvent.type === '입주박람회' ? '95,000원/장' : '100,000원/장'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">추가할인</span>
                      <span className="text-sm font-medium">
                        {currentEvent.type === '라이브커머스' ? '장당 5,000원' : 
                         currentEvent.type === '베이비페어' ? '장당 3,000원' :
                         currentEvent.type === '입주박람회' ? '장당 4,000원' : '장당 3,000원'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">추가할인 조건</span>
                      <span className="text-sm font-medium">30장 이상 계약시</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">시공 혜택</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">시공비</span>
                      <span className="text-sm font-medium">
                        {currentEvent.type === '라이브커머스' ? '25,000원/장' : 
                         currentEvent.type === '베이비페어' ? '20,000원/장' :
                         currentEvent.type === '입주박람회' ? '22,000원/장' : '23,000원/장'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">시공비할인조건</span>
                      <span className="text-sm font-medium">50장 이상 무료시공</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">견적 사은품</h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {currentEvent.type === '라이브커머스' ? '스마트 무드등 세트' : 
                         currentEvent.type === '베이비페어' ? '유아용 매트리스 커버' :
                         currentEvent.type === '입주박람회' ? '프리미엄 청소용품 세트' : '기본 사은품 세트'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">시공 사은품</h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {currentEvent.type === '라이브커머스' ? '공기청정기 + 가습기' : 
                         currentEvent.type === '베이비페어' ? '아기 안전용품 세트' :
                         currentEvent.type === '입주박람회' ? '스마트 홈 디바이스' : '프리미엄 사은품'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-3">현장 이벤트</h4>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {currentEvent.type === '라이브커머스' ? 
                      '실시간 채팅 참여 이벤트: 댓글 작성시 추첨을 통해 카페 쿠폰 증정 (매시간 10명)' : 
                     currentEvent.type === '베이비페어' ? 
                      '베이비 포토존 운영: 아이와 함께 사진 촬영시 즉석 프린트 제공 및 포토프레임 증정' :
                     currentEvent.type === '입주박람회' ? 
                      '입주민 대상 특별 혜택: 현장 상담 및 견적 작성시 아메리카노 제공, 계약시 상품권 증정' : 
                      '현장 참여 이벤트 및 다양한 혜택 제공'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 전회차 반영사항 */}
          <Card>
            <CardHeader>
              <CardTitle>전회차 반영사항</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">개선사항</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {currentEvent.type === '라이브커머스' && (
                      <>
                        <li>• 라이브 방송 시간대를 오후 8시-10시로 조정하여 시청률 향상</li>
                        <li>• 실시간 채팅 모니터링 인력 확충으로 고객 문의 응답률 개선</li>
                        <li>• 제품 설명 자료를 더 시각적으로 개선하여 이해도 증진</li>
                        <li>• 배송 안내 메시지 자동화로 고객 만족도 향상</li>
                      </>
                    )}
                    {currentEvent.type === '베이비페어' && (
                      <>
                        <li>• 부스 위치를 메인 홀 입구 근처로 이동하여 접근성 개선</li>
                        <li>• 유모차 주차 공간 확보로 방문객 편의성 증대</li>
                        <li>• 아이 놀이 공간 마련으로 부모의 상담 집중도 향상</li>
                        <li>• 시식 코너 운영으로 제품 체험 기회 확대</li>
                      </>
                    )}
                    {currentEvent.type === '입주박람회' && (
                      <>
                        <li>• 아파트 단지별 맞춤 상담 코너 신설로 전문성 강화</li>
                        <li>• 3D 시뮬레이션 시연 장비 도입으로 시각적 효과 개선</li>
                        <li>• 현장 견적 시스템 도입으로 즉시 견적 제공 가능</li>
                        <li>• 입주 일정에 맞춘 시공 스케줄링 서비스 제공</li>
                      </>
                    )}
                    {currentEvent.type === '인플루언서공구' && (
                      <>
                        <li>• 인플루언서 선정 기준 강화로 타겟 고객층 정확도 향상</li>
                        <li>• 공구 기간을 주말 포함 7일로 연장하여 참여도 증대</li>
                        <li>• 후기 작성 이벤트 추가로 브랜드 인지도 확산</li>
                        <li>• 재구매 고객 대상 추가 할인 혜택 제공</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">유지사항</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 고객 상담 품질 관리 시스템 지속 운영</li>
                    <li>• 사후 서비스 만족도 조사 및 피드백 반영</li>
                    <li>• 경쟁사 대비 차별화된 혜택 유지</li>
                    <li>• 브랜드 일관성 있는 마케팅 메시지 전달</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 실행계획 */}
          <Card>
            <CardHeader>
              <CardTitle>실행 계획</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-primary">1. 사전 준비 단계</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentEvent.type === '라이브커머스' ? 
                      '라이브 방송 시나리오 작성, 제품 촬영 및 편집, 스튜디오 세팅 점검, MC 및 스태프 브리핑, 기술 테스트 진행' :
                     currentEvent.type === '베이비페어' ? 
                      '부스 디자인 확정, 전시용 제품 준비, 홍보물 제작, 직원 교육, 사은품 준비 및 재고 관리' :
                     currentEvent.type === '입주박람회' ? 
                      '아파트별 맞춤 자료 준비, 상담 부스 설치, 견적 시스템 구축, 전문 상담사 배치, 홍보 활동 시작' :
                      '인플루언서 섭외 및 컨텐츠 기획, 공구 상품 선정, 이벤트 페이지 구축, 마케팅 자료 제작'}
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-primary">2. 실행 단계</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentEvent.type === '라이브커머스' ? 
                      '라이브 방송 진행, 실시간 채팅 관리, 주문 처리, 고객 문의 응답, 이벤트 진행, 시청률 모니터링' :
                     currentEvent.type === '베이비페어' ? 
                      '부스 운영, 고객 상담, 제품 시연, 견적 작성, 현장 이벤트 진행, 방문객 데이터 수집' :
                     currentEvent.type === '입주박람회' ? 
                      '상담 부스 운영, 견적 상담, 계약 진행, 현장 이벤트 관리, 입주민 응대, 데이터베이스 구축' :
                      '공구 이벤트 런칭, SNS 홍보, 주문 관리, 고객 서비스, 인플루언서 소통, 실시간 모니터링'}
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-primary">3. 사후 관리</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentEvent.type === '라이브커머스' ? 
                      '주문 배송 관리, 고객 만족도 조사, 방송 하이라이트 편집, 재방송 스케줄링, 다음 라이브 기획' :
                     currentEvent.type === '베이비페어' ? 
                      '견적서 발송, 고객 후속 상담, 계약 진행, 만족도 조사, 다음 참가 계획 수립' :
                     currentEvent.type === '입주박람회' ? 
                      '계약 후속 처리, 시공 일정 조율, 고객 관리, 입주 안내, 사후 서비스 제공' :
                      '주문 처리 완료, 후기 관리, 재구매 유도, 성과 분석, 다음 공구 기획'}
                  </p>
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

          {/* 담당자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>담당자 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">이벤트 매니저</div>
                    <div className="text-sm text-muted-foreground">김관리 (마케팅팀)</div>
                    <div className="text-xs text-muted-foreground">010-9876-5432</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">현장 담당자</div>
                    <div className="text-sm text-muted-foreground">이현장 (영업팀)</div>
                    <div className="text-xs text-muted-foreground">010-1111-2222</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상태 및 통계 */}
          <Card>
            <CardHeader>
              <CardTitle>이벤트 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">현재 상태</span>
                  <Badge className={getStatusColor(currentEvent.status)}>
                    {currentEvent.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">생성일</span>
                  <span className="text-sm font-medium">
                    {new Date(currentEvent.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">최근 수정</span>
                  <span className="text-sm font-medium">
                    {new Date(currentEvent.updated_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">전체 효율성</span>
                    <span className="text-sm font-medium text-primary">
                      {currentEvent.efficiency}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EventDetail