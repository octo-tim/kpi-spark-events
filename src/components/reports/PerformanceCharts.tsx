import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Target, DollarSign, Activity } from 'lucide-react'
import { Event } from '@/hooks/useEvents'

interface PerformanceChartsProps {
  events: Event[]
  title: string
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ events, title }) => {
  const getChartData = () => {
    return events.map(event => ({
      name: event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title,
      fullName: event.title,
      type: event.type,
      targetContracts: event.target_contracts || 0,
      actualContracts: event.actual_contracts || 0,
      targetEstimates: event.target_estimates || 0,
      actualEstimates: event.actual_estimates || 0,
      cost: (event.total_cost || 0) / 1000000, // 백만원 단위
      efficiency: event.efficiency || 0,
      achievementRate: event.target_contracts > 0 
        ? Math.round((event.actual_contracts / event.target_contracts) * 100) 
        : 0
    }))
  }

  const getTypeDistribution = () => {
    const typeCount: { [key: string]: number } = {}
    events.forEach(event => {
      typeCount[event.type] = (typeCount[event.type] || 0) + 1
    })
    
    const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']
    return Object.entries(typeCount).map(([type, count], index) => ({
      name: type,
      value: count,
      color: colors[index % colors.length]
    }))
  }

  const chartData = getChartData()
  const typeDistribution = getTypeDistribution()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm text-muted-foreground">{data.type}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: item.color }}>
              {item.dataKey === 'cost' 
                ? `${item.name}: ${item.value.toFixed(1)}백만원`
                : `${item.name}: ${item.value}${item.dataKey.includes('Contracts') || item.dataKey.includes('Estimates') ? '건' : item.dataKey === 'achievementRate' ? '%' : ''}`
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 계약 실적 비교 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              계약 실적 비교
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="targetContracts" fill="#94A3B8" name="목표 계약" />
                <Bar dataKey="actualContracts" fill="#3B82F6" name="실제 계약" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 달성률 추이 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              달성률 추이
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="achievementRate" 
                  stroke="#16A34A" 
                  strokeWidth={3}
                  name="달성률"
                  dot={{ fill: '#16A34A', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 비용 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              이벤트별 비용 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" fill="#F59E0B" name="비용" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 이벤트 유형 분포 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              이벤트 유형 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}개`}
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}