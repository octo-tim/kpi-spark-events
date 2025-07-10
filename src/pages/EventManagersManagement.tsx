import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit2, Trash2, Users } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

const EventManagersManagement = () => {
  const { toast } = useToast()
  const [managers, setManagers] = useState<any[]>([])
  const [editingManager, setEditingManager] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const departments = ['영업팀', '마케팅팀', '기획팀', '운영팀', '고객서비스팀']
  const positions = ['팀장', '과장', '대리', '주임', '사원']

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: ''
  })

  useEffect(() => {
    loadManagers()
  }, [])

  const loadManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('event_managers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setManagers(data || [])
    } catch (error) {
      console.error('Error loading managers:', error)
      toast({
        title: "오류",
        description: "담당자 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (manager: any) => {
    setEditingManager(manager)
    setFormData({
      name: manager.name,
      email: manager.email || '',
      phone: manager.phone || '',
      department: manager.department || '',
      position: manager.position || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: ''
    })
    setIsAddDialogOpen(true)
  }

  const handleSubmit = async (isEdit: boolean) => {
    try {
      if (isEdit && editingManager) {
        const { error } = await supabase
          .from('event_managers')
          .update(formData)
          .eq('id', editingManager.id)

        if (error) throw error

        toast({
          title: "성공",
          description: "담당자 정보가 수정되었습니다."
        })
        setIsEditDialogOpen(false)
      } else {
        const { error } = await supabase
          .from('event_managers')
          .insert([formData])

        if (error) throw error

        toast({
          title: "성공",
          description: "새 담당자가 등록되었습니다."
        })
        setIsAddDialogOpen(false)
      }

      loadManagers()
    } catch (error) {
      console.error('Error saving manager:', error)
      toast({
        title: "오류",
        description: `담당자 ${isEdit ? '수정' : '등록'} 중 오류가 발생했습니다.`,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('event_managers')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "성공",
        description: "담당자가 삭제되었습니다."
      })
      loadManagers()
    } catch (error) {
      console.error('Error deleting manager:', error)
      toast({
        title: "오류",
        description: "담당자 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const ManagerForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">이름 *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="담당자 이름"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="example@company.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">연락처</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="010-0000-0000"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">부서</Label>
          <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
            <SelectTrigger>
              <SelectValue placeholder="부서 선택" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">직급</Label>
        <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
          <SelectTrigger>
            <SelectValue placeholder="직급 선택" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((pos) => (
              <SelectItem key={pos} value={pos}>{pos}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">담당자 관리</h1>
          <p className="text-muted-foreground mt-2">
            이벤트 담당자를 관리하세요
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>새 담당자 추가</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 담당자 추가</DialogTitle>
            </DialogHeader>
            <ManagerForm />
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={() => handleSubmit(false)}>
                추가
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>담당자 목록</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>부서</TableHead>
                <TableHead>직급</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {managers.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell className="font-medium">{manager.name}</TableCell>
                  <TableCell>{manager.department || '-'}</TableCell>
                  <TableCell>{manager.position || '-'}</TableCell>
                  <TableCell>{manager.phone || '-'}</TableCell>
                  <TableCell>{manager.email || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      manager.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {manager.is_active ? '활성' : '비활성'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(manager)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>담당자 수정</DialogTitle>
                          </DialogHeader>
                          <ManagerForm />
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              취소
                            </Button>
                            <Button onClick={() => handleSubmit(true)}>
                              수정
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>담당자 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              정말로 이 담당자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(manager.id)}>
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default EventManagersManagement