import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import KPICard from '@/components/KPICard'
import EventCard, { EventData } from '@/components/EventCard'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'

const Dashboard = () => {
  // 샘플 데이터 - 추후 Supabase 연동 시 실제 데이터로 교체
  const kpiData = {
    totalContracts: { current: 234, target: 300, trend: 'up', trendValue: 12 },
    totalEstimates: { current: 567, target: 600, trend: 'up', trendValue: 8 },
    totalSqm: { current: 15420, target: 18000, trend: 'down', trendValue: -3 },
    monthlyRevenue: { current: 8500000, target: 10000000, trend: 'up', trendValue: 15 }
  }

  const recentEvents: EventData[] = [
    {
      id: '1',
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
      actualSqm: 960
    },
    {
      id: '2',
      title: '서울 베이비&키즈 페어 2024',
      type: '베이비페어',
      status: '완료',
      startDate: '2024-01-08',
      endDate: '2024-01-14',
      location: '킨텍스 제2전시장',
      partner: '베이비페어 조직위',
      targetContracts: 80,
      actualContracts: 95,
      targetEstimates: 200,
      actualEstimates: 215,
      targetSqm: 2400,
      actualSqm: 2850
    },
    {
      id: '3',
      title: '분당 신도시 입주박람회',
      type: '입주박람회',
      status: '계획중',
      startDate: '2024-02-01',
      endDate: '2024-02-03',
      location: '분당 시티몰',
      partner: '분당신도시개발',
      targetContracts: 35,
      targetEstimates: 85,
      targetSqm: 1200
    }
  ]

  const channelPerformanceData = [
    { channel: '라이브커머스', contracts: 145, estimates: 320, sqm: 4200 },
    { channel: '베이비페어', contracts: 89, estimates: 180, sqm: 3100 },
    { channel: '입주박람회', contracts: 67, estimates: 150, sqm: 2800 },
    { channel: '인플루언서공구', contracts: 34, estimates: 90, sqm: 1500 }
  ]

  const monthlyTrendData = [
    { month: '9월', contracts: 45, estimates: 120, sqm: 1200 },
    { month: '10월', contracts: 52, estimates: 135, sqm: 1350 },
    { month: '11월', contracts: 48, estimates: 125, sqm: 1280 },
    { month: '12월', contracts: 61, estimates: 148, sqm: 1580 },
    { month: '1월', contracts: 67, estimates: 165, sqm: 1720 }
  ]

  const CHART_COLORS = ['#0EA5E9', '#EF4444', '#10B981', '#8B5CF6']

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
        <p className="text-muted-foreground mt-2">
          제휴채널별 영업 성과와 주요 지표를 한눈에 확인하세요
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="총 계약건수"
          value={kpiData.totalContracts.current}
          target={kpiData.totalContracts.target}
          unit="건"
          trend={kpiData.totalContracts.trend as any}
          trendValue={kpiData.totalContracts.trendValue}
        />
        <KPICard
          title="총 견적건수"
          value={kpiData.totalEstimates.current}
          target={kpiData.totalEstimates.target}
          unit="건"
          trend={kpiData.totalEstimates.trend as any}
          trendValue={kpiData.totalEstimates.trendValue}
        />
        <KPICard
          title="총 계약장수"
          value={kpiData.totalSqm.current}
          target={kpiData.totalSqm.target}
          unit="장"
          trend={kpiData.totalSqm.trend as any}
          trendValue={kpiData.totalSqm.trendValue}
        />
        <KPICard
          title="월간 매출"
          value={kpiData.monthlyRevenue.current}
          target={kpiData.monthlyRevenue.target}
          unit="원"
          trend={kpiData.monthlyRevenue.trend as any}
          trendValue={kpiData.monthlyRevenue.trendValue}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Performance */}
        <Card>
          <CardHeader>
            <CardTitle>채널별 성과 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contracts" fill="hsl(var(--primary))" name="계약건수" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>월별 성과 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="contracts" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="계약건수"
                />
                <Line 
                  type="monotone" 
                  dataKey="estimates" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="견적건수"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>최근 이벤트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard