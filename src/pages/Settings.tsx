import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Building2, MapPin, Settings as SettingsIcon, ChevronRight } from 'lucide-react'

const Settings = () => {
  const managementItems = [
    {
      title: '담당자 관리',
      description: '이벤트 담당자를 추가, 수정, 삭제할 수 있습니다.',
      icon: Users,
      href: '/management/managers',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '파트너 관리',
      description: '제휴 파트너 정보를 관리할 수 있습니다.',
      icon: Building2,
      href: '/management/partners',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '장소 관리',
      description: '이벤트 장소 정보를 관리할 수 있습니다.',
      icon: MapPin,
      href: '/management/locations',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">설정</h1>
          <p className="text-muted-foreground mt-2">
            시스템 설정 및 데이터 관리를 할 수 있습니다
          </p>
        </div>
      </div>

      {/* 기본 데이터 관리 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>기본 데이터 관리</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.title} to={item.href}>
                  <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${item.bgColor}`}>
                          <Icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {item.title}
                            </h3>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 시스템 설정 섹션 (향후 확장용) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>시스템 설정</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h4 className="font-medium text-foreground">알림 설정</h4>
                <p className="text-sm text-muted-foreground">이벤트 및 보고서 관련 알림을 설정합니다</p>
              </div>
              <Button variant="outline" disabled>
                곧 제공 예정
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h4 className="font-medium text-foreground">데이터 백업</h4>
                <p className="text-sm text-muted-foreground">시스템 데이터를 백업하고 복원합니다</p>
              </div>
              <Button variant="outline" disabled>
                곧 제공 예정
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h4 className="font-medium text-foreground">사용자 권한</h4>
                <p className="text-sm text-muted-foreground">사용자 권한 및 접근 레벨을 관리합니다</p>
              </div>
              <Button variant="outline" disabled>
                곧 제공 예정
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Settings