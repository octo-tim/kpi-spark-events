import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'
import { Event } from '@/hooks/useEvents'

interface MonthlyTrendsChartProps {
  events: Event[]
}

export const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({ events }) => {
  const getMonthlyData = () => {
    const monthlyStats: { [key: string]: any } = {}
    
    // 2025년 1월부터 12월까지 초기화
    for (let month = 1; month <= 12; month++) {
      const monthKey = `2025-${month.toString().padStart(2, '0')}`
      monthlyStats[monthKey] = {
        month: `${month}월`,
        monthKey,
        라이브커머스: { events: 0, contracts: 0, estimates: 0, cost: 0 },
        베이비페어: { events: 0, contracts: 0, estimates: 0, cost: 0 },
        입주박람회: { events: 0, contracts: 0, estimates: 0, cost: 0 },
        인플루언서공구: { events: 0, contracts: 0, estimates: 0, cost: 0 },
        totalEvents: 0,
        totalContracts: 0,
        totalEstimates: 0,
        totalCost: 0
      }
    }
    
    // 2025년 이벤트 데이터 집계
    events.forEach(event => {
      if (event.start_date.startsWith('2025-')) {
        const monthKey = event.start_date.substring(0, 7) // 2025-01 형태
        if (monthlyStats[monthKey]) {
          const eventType = event.type
          if (eventType === '라이브커머스' || eventType === '베이비페어' || 
              eventType === '입주박람회' || eventType === '인플루언서공구') {
            monthlyStats[monthKey][eventType].events += 1
            monthlyStats[monthKey][eventType].contracts += event.actual_contracts || 0
            monthlyStats[monthKey][eventType].estimates += event.actual_estimates || 0
            monthlyStats[monthKey][eventType].cost += (event.total_cost || 0) / 1000000 // 백만원 단위
            
            monthlyStats[monthKey].totalEvents += 1
            monthlyStats[monthKey].totalContracts += event.actual_contracts || 0
            monthlyStats[monthKey].totalEstimates += event.actual_estimates || 0
            monthlyStats[monthKey].totalCost += (event.total_cost || 0) / 1000000
          }
        }
      }
    })
    
    return Object.values(monthlyStats)
  }

  const getTypePerformanceData = () => {
    const data = getMonthlyData()
    return data.map(item => ({
      month: item.month,
      라이브커머스: item.라이브커머스.contracts,
      베이비페어: item.베이비페어.contracts,
      입주박람회: item.입주박람회.contracts,
      인플루언서공구: item.인플루언서공구.contracts
    }))
  }

  const getKPIData = () => {
    const data = getMonthlyData()
    return data.map(item => ({
      month: item.month,
      계약: item.totalContracts,
      견적: item.totalEstimates,
      이벤트수: item.totalEvents,
      비용: item.totalCost.toFixed(1)
    }))
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.name}: {item.value}
              {item.dataKey === '비용' ? '백만원' : 
               item.dataKey === '이벤트수' ? '개' : '건'}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const monthlyData = getMonthlyData()
  const typeData = getTypePerformanceData()
  const kpiData = getKPIData()

  // 색상 설정
  const typeColors = {
    라이브커머스: '#8B5CF6',
    베이비페어: '#06B6D4',
    입주박람회: '#10B981',
    인플루언서공구: '#F59E0B'
  }

  const kpiColors = {
    계약: '#3B82F6',
    견적: '#16A34A',
    이벤트수: '#F59E0B',
    비용: '#EF4444'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            2025년 월별 성과 추이
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 유형별 월별 계약 실적 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">유형별 월별 계약 실적</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="라이브커머스" fill={typeColors.라이브커머스} name="라이브커머스" />
                  <Bar dataKey="베이비페어" fill={typeColors.베이비페어} name="베이비페어" />
                  <Bar dataKey="입주박람회" fill={typeColors.입주박람회} name="입주박람회" />
                  <Bar dataKey="인플루언서공구" fill={typeColors.인플루언서공구} name="인플루언서공구" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 주요 성과지표 월별 추이 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">주요 성과지표 월별 추이</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={kpiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="계약" 
                    stroke={kpiColors.계약} 
                    strokeWidth={2}
                    dot={{ fill: kpiColors.계약, strokeWidth: 2, r: 4 }}
                    name="계약 건수"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="견적" 
                    stroke={kpiColors.견적} 
                    strokeWidth={2}
                    dot={{ fill: kpiColors.견적, strokeWidth: 2, r: 4 }}
                    name="견적 건수"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="이벤트수" 
                    stroke={kpiColors.이벤트수} 
                    strokeWidth={2}
                    dot={{ fill: kpiColors.이벤트수, strokeWidth: 2, r: 4 }}
                    name="이벤트 수"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 월별 비용 추이 */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">월별 비용 추이</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="비용" fill={kpiColors.비용} name="비용" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 월별 상세 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            2025년 월별 상세 통계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">월</th>
                  <th className="text-center p-2">총 이벤트</th>
                  <th className="text-center p-2">총 계약</th>
                  <th className="text-center p-2">총 견적</th>
                  <th className="text-center p-2">총 비용</th>
                  <th className="text-center p-2">라이브커머스</th>
                  <th className="text-center p-2">베이비페어</th>
                  <th className="text-center p-2">입주박람회</th>
                  <th className="text-center p-2">인플루언서공구</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{item.month}</td>
                    <td className="text-center p-2">{item.totalEvents}개</td>
                    <td className="text-center p-2">{item.totalContracts}건</td>
                    <td className="text-center p-2">{item.totalEstimates}건</td>
                    <td className="text-center p-2">{item.totalCost.toFixed(1)}M</td>
                    <td className="text-center p-2">{item.라이브커머스.contracts}건</td>
                    <td className="text-center p-2">{item.베이비페어.contracts}건</td>
                    <td className="text-center p-2">{item.입주박람회.contracts}건</td>
                    <td className="text-center p-2">{item.인플루언서공구.contracts}건</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}