import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, CalendarDays, CalendarRange } from 'lucide-react'

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
    { value: '2024', label: '2024년 전체' },
    { value: '2024-H2', label: '2024년 하반기' },
    { value: '2024-H1', label: '2024년 상반기' },
    { value: '2023', label: '2023년 전체' }
  ]

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
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="기간을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {periodType === 'month' && getMonthOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}