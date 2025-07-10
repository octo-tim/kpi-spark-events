import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, CalendarDays, CalendarRange, ChevronLeft, ChevronRight } from 'lucide-react'

interface PeriodSelectorProps {
  periodType: 'month' | 'quarter' | 'range'
  selectedPeriod: string
  onPeriodTypeChange: (type: 'month' | 'quarter' | 'range') => void
  onPeriodChange: (period: string) => void
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  periodType,
  selectedPeriod,
  onPeriodTypeChange,
  onPeriodChange
}) => {
  const getCurrentYear = () => new Date().getFullYear()
  const getCurrentMonth = () => new Date().getMonth() + 1

  const getMonthOptions = () => {
    const months = []
    for (let i = 0; i < 12; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const value = `${year}-${month.toString().padStart(2, '0')}`
      const label = `${year}년 ${month}월`
      months.push({ value, label })
    }
    return months
  }

  const getQuarterOptions = () => {
    const quarters = []
    const currentYear = new Date().getFullYear()
    for (let year = currentYear; year >= currentYear - 2; year--) {
      for (let q = 4; q >= 1; q--) {
        quarters.push({
          value: `${year}-Q${q}`,
          label: `${year}년 ${q}분기`
        })
      }
    }
    return quarters
  }

  const getRangeOptions = () => [
    { value: '2025', label: '2025년 전체' },
    { value: '2024', label: '2024년 전체' },
    { value: '2024-H2', label: '2024년 하반기' },
    { value: '2024-H1', label: '2024년 상반기' },
    { value: '2023', label: '2023년 전체' }
  ]

  // 월 선택을 위한 간편한 네비게이션
  const handleMonthNavigation = (direction: 'prev' | 'next') => {
    if (periodType !== 'month' || !selectedPeriod) return

    const [year, month] = selectedPeriod.split('-').map(Number)
    let newYear = year
    let newMonth = month

    if (direction === 'prev') {
      newMonth -= 1
      if (newMonth < 1) {
        newMonth = 12
        newYear -= 1
      }
    } else {
      newMonth += 1
      if (newMonth > 12) {
        newMonth = 1
        newYear += 1
      }
    }

    const newPeriod = `${newYear}-${newMonth.toString().padStart(2, '0')}`
    onPeriodChange(newPeriod)
  }

  const formatSelectedPeriod = () => {
    if (!selectedPeriod) return ''
    
    if (periodType === 'month') {
      const [year, month] = selectedPeriod.split('-')
      return `${year}년 ${parseInt(month)}월`
    } else if (periodType === 'quarter') {
      const [year, quarter] = selectedPeriod.split('-Q')
      return `${year}년 ${quarter}분기`
    } else {
      const option = getRangeOptions().find(opt => opt.value === selectedPeriod)
      return option?.label || selectedPeriod
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarRange className="w-5 h-5" />
          조회기간 설정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">기간 유형</label>
            <Select value={periodType} onValueChange={onPeriodTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    월별
                  </div>
                </SelectItem>
                <SelectItem value="quarter">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    분기별
                  </div>
                </SelectItem>
                <SelectItem value="range">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="w-4 h-4" />
                    기간별
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">조회기간</label>
            {periodType === 'month' ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleMonthNavigation('prev')}
                  className="px-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center py-2 px-3 border rounded-md bg-background">
                  {formatSelectedPeriod()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleMonthNavigation('next')}
                  className="px-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Select value={selectedPeriod} onValueChange={onPeriodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="기간을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {periodType === 'quarter' && getQuarterOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                  {periodType === 'range' && getRangeOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}