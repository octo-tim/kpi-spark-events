import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useEvents } from '@/hooks/useEvents'
import { PeriodSelector } from '@/components/reports/PeriodSelector'
import { EventTypeTable } from '@/components/reports/EventTypeTable'
import { PerformanceCharts } from '@/components/reports/PerformanceCharts'
import { ReportSummary } from '@/components/reports/ReportSummary'

const Reports = () => {
  const { events, loading, fetchEventsByMonth, fetchEventsByQuarter, fetchEventsByPeriod } = useEvents()
  const [periodType, setPeriodType] = useState<'month' | 'quarter' | 'range'>('month')
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [filteredEvents, setFilteredEvents] = useState(events)

  // 기본 기간 설정 (한 번만 실행)
  useEffect(() => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    setSelectedPeriod(`${currentYear}-${currentMonth.toString().padStart(2, '0')}`)
  }, []) // 빈 배열로 변경하여 한 번만 실행

  // 기간 변경 시 이벤트 필터링
  useEffect(() => {
    const filterEvents = async () => {
      if (!selectedPeriod) return

      try {
        let filteredData = []
        
        if (periodType === 'month') {
          const [year, month] = selectedPeriod.split('-')
          filteredData = await fetchEventsByMonth(year, month)
        } else if (periodType === 'quarter') {
          const [year, quarter] = selectedPeriod.split('-Q')
          filteredData = await fetchEventsByQuarter(year, quarter)
        } else if (periodType === 'range') {
          if (selectedPeriod === '2024') {
            filteredData = await fetchEventsByPeriod('2024-01-01', '2024-12-31')
          } else if (selectedPeriod === '2024-H1') {
            filteredData = await fetchEventsByPeriod('2024-01-01', '2024-06-30')
          } else if (selectedPeriod === '2024-H2') {
            filteredData = await fetchEventsByPeriod('2024-07-01', '2024-12-31')
          } else if (selectedPeriod === '2023') {
            filteredData = await fetchEventsByPeriod('2023-01-01', '2023-12-31')
          }
        }
        
        setFilteredEvents(filteredData)
      } catch (error) {
        console.error('이벤트 필터링 중 오류:', error)
        setFilteredEvents([])
      }
    }

    filterEvents()
  }, [periodType, selectedPeriod]) // 함수들을 의존성에서 제거

  const getReportTitle = () => {
    if (periodType === 'month') {
      const [year, month] = selectedPeriod.split('-')
      return `${year}년 ${parseInt(month)}월 성과 리포트`
    } else if (periodType === 'quarter') {
      const [year, quarter] = selectedPeriod.split('-Q')
      return `${year}년 ${quarter}분기 성과 리포트`
    } else {
      if (selectedPeriod === '2024') return '2024년 연간 성과 리포트'
      if (selectedPeriod === '2024-H1') return '2024년 상반기 성과 리포트'
      if (selectedPeriod === '2024-H2') return '2024년 하반기 성과 리포트'
      if (selectedPeriod === '2023') return '2023년 연간 성과 리포트'
      return '성과 리포트'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">리포트 관리</h1>
          <p className="text-muted-foreground mt-2">
            기간별 이벤트 성과를 종합 분석하고 리포트를 생성하세요
          </p>
        </div>
        {loading && (
          <div className="flex items-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">데이터 로딩 중...</span>
          </div>
        )}
      </div>

      {/* 조회기간 설정 */}
      <PeriodSelector
        periodType={periodType}
        selectedPeriod={selectedPeriod}
        onPeriodTypeChange={setPeriodType}
        onPeriodChange={setSelectedPeriod}
      />

      {selectedPeriod && !loading && (
        <>
          {/* 리포트 요약 */}
          <ReportSummary
            events={filteredEvents}
            periodType={periodType}
            selectedPeriod={selectedPeriod}
            title={getReportTitle()}
          />

          {/* 이벤트 유형별 결과 표 */}
          <EventTypeTable
            events={filteredEvents}
            title="1. 이벤트 유형별 성과 분석"
          />

          {/* 주요 성과지표별 그래프 */}
          <PerformanceCharts
            events={filteredEvents}
            title="2. 주요 성과지표별 실적 그래프"
          />
        </>
      )}

      {!selectedPeriod && !loading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            조회기간을 선택하여 리포트를 생성하세요.
          </div>
        </div>
      )}

      {filteredEvents.length === 0 && selectedPeriod && !loading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            선택한 기간에 해당하는 이벤트가 없습니다.
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports