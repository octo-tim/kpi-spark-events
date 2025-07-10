import React from 'react'
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
  Phone
} from 'lucide-react'
import { EventData } from '@/components/EventCard'

const EventDetail = () => {
  const { id } = useParams()

  // 샘플 데이터 - 추후 Supabase 연동 시 실제 데이터로 교체
  const event: EventData = {
    id: id || '1',
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
    description: '신혼부부를 대상으로 한 맞춤형 인테리어 라이브 쇼핑 이벤트입니다. 합리적인 가격과 품질 좋은 제품으로 새로운 보금자리를 꾸밀 수 있도록 도와드립니다.',
    location: '온라인 라이브 스튜디오',
  }

  const getStatusColor = (status: typeof event.status) => {
    switch (status) {
      case '계획중': return 'bg-muted text-muted-foreground'
      case '진행중': return 'bg-primary text-primary-foreground'
      case '완료': return 'bg-success text-success-foreground'
      case '취소': return 'bg-danger text-danger-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getTypeColor = (type: typeof event.type) => {
    switch (type) {
      case '라이브커머스': return 'bg-blue-100 text-blue-800 border-blue-200'
      case '베이비페어': return 'bg-pink-100 text-pink-800 border-pink-200'
      case '입주박람회': return 'bg-green-100 text-green-800 border-green-200'
      case '인플루언서공구': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const calculateRate = (actual: number, target: number) => {
    return Math.round((actual / target) * 100)
  }

  const kpiData = [
    {
      title: '계약건수',
      target: event.targetContracts,
      actual: event.actualContracts || 0,
      unit: '건',
      rate: calculateRate(event.actualContracts || 0, event.targetContracts)
    },
    {
      title: '견적건수',
      target: event.targetEstimates,
      actual: event.actualEstimates || 0,
      unit: '건',
      rate: calculateRate(event.actualEstimates || 0, event.targetEstimates)
    },
    {
      title: '계약장수',
      target: event.targetSqm,
      actual: event.actualSqm || 0,
      unit: '장',
      rate: calculateRate(event.actualSqm || 0, event.targetSqm)
    }
  ]

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
              <Badge className={getTypeColor(event.type)}>
                {event.type}
              </Badge>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
          </div>
        </div>
        <Button asChild>
          <Link to={`/events/${event.id}/edit`}>
            <Edit className="w-4 h-4 mr-2" />
            수정
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽 영역 - 기본 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 이벤트 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>이벤트 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">기간</div>
                    <div className="text-sm text-muted-foreground">
                      {event.startDate} ~ {event.endDate}
                    </div>
                  </div>
                </div>
                
                {event.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">장소</div>
                      <div className="text-sm text-muted-foreground">{event.location}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">제휴 파트너</div>
                    <div className="text-sm text-muted-foreground">{event.partner}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">담당자</div>
                    <div className="text-sm text-muted-foreground">김영업 (010-1234-5678)</div>
                  </div>
                </div>
              </div>

              {event.description && (
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-2">이벤트 설명</h4>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

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
                    최종 업데이트: 2024-01-18 14:30
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">주요 성과</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span>라이브 시청자 수 평균 1,200명 유지</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span>실시간 채팅 참여율 85% 달성</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-warning" />
                      <span>계약 전환율 다소 저조 (개선 필요)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽 영역 - KPI */}
        <div className="space-y-6">
          {/* KPI 성과 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>KPI 성과</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {kpiData.map((kpi, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{kpi.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {kpi.actual}/{kpi.target}{kpi.unit}
                    </span>
                  </div>
                  <Progress value={kpi.rate} className="h-2" />
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      kpi.rate >= 100 ? 'text-success' :
                      kpi.rate >= 80 ? 'text-warning' : 'text-danger'
                    }`}>
                      달성률 {kpi.rate}%
                    </span>
                  </div>
                </div>
              ))}
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
                <Link to={`/events/${event.id}/edit`}>
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