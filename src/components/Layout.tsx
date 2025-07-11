import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { 
  Calendar, 
  BarChart3, 
  Plus, 
  Home,
  Settings,
  Users,
  FileText,
  LogOut,
  User,
  Building2,
  MapPin,
  Menu,
  X
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navigation = [
    { name: '대시보드', href: '/', icon: Home },
    { name: '이벤트 기획', href: '/events/create', icon: Plus },
    { name: '이벤트 목록', href: '/events', icon: Calendar },
    { name: '보고서 작성', href: '/reports/create', icon: FileText },
    { name: '통계 분석', href: '/analytics', icon: BarChart3 },
    { name: '보고서', href: '/reports', icon: FileText },
    { name: '설정', href: '/settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "로그아웃 완료",
        description: "안전하게 로그아웃되었습니다.",
      })
    } catch (error) {
      toast({
        title: "오류",
        description: "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className={cn(
                  "font-bold text-foreground",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  {isMobile ? "영업관리" : "외부채널 영업관리"}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isMobile && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              )}
              {isMobile ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation */}
      {!isMobile && (
        <nav className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                      isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Navigation Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="bg-card border-b border-border shadow-lg">
          <div className="px-4 py-2 space-y-1">
            <div className="flex items-center space-x-2 px-3 py-3 text-sm text-muted-foreground border-b border-border">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-3 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-muted-foreground hover:text-foreground mt-2"
            >
              <LogOut className="w-4 h-4 mr-3" />
              로그아웃
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && !isMobileMenuOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
          <div className="flex justify-around items-center py-2">
            {navigation.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center p-2 text-xs transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] leading-none">{item.name.replace(' ', '')}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8",
        isMobile && "pb-20" // 하단 네비게이션 공간 확보
      )}>
        {children}
      </main>
    </div>
  )
}

export default Layout