import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

const LocationsManagement = () => {
  const { toast } = useToast()
  const [locations, setLocations] = useState<any[]>([])
  const [editingLocation, setEditingLocation] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: '',
    description: ''
  })

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLocations(data || [])
    } catch (error) {
      console.error('Error loading locations:', error)
      toast({
        title: "오류",
        description: "장소 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (location: any) => {
    setEditingLocation(location)
    setFormData({
      name: location.name,
      address: location.address || '',
      capacity: location.capacity?.toString() || '',
      description: location.description || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleAdd = () => {
    setFormData({
      name: '',
      address: '',
      capacity: '',
      description: ''
    })
    setIsAddDialogOpen(true)
  }

  const handleSubmit = async (isEdit: boolean) => {
    try {
      const submitData = {
        name: formData.name,
        address: formData.address,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        description: formData.description
      }

      if (isEdit && editingLocation) {
        const { error } = await supabase
          .from('locations')
          .update(submitData)
          .eq('id', editingLocation.id)

        if (error) throw error

        toast({
          title: "성공",
          description: "장소 정보가 수정되었습니다."
        })
        setIsEditDialogOpen(false)
      } else {
        const { error } = await supabase
          .from('locations')
          .insert([submitData])

        if (error) throw error

        toast({
          title: "성공",
          description: "새 장소가 등록되었습니다."
        })
        setIsAddDialogOpen(false)
      }

      loadLocations()
    } catch (error) {
      console.error('Error saving location:', error)
      toast({
        title: "오류",
        description: `장소 ${isEdit ? '수정' : '등록'} 중 오류가 발생했습니다.`,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('locations')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "성공",
        description: "장소가 삭제되었습니다."
      })
      loadLocations()
    } catch (error) {
      console.error('Error deleting location:', error)
      toast({
        title: "오류",
        description: "장소 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const LocationForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">장소명 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="장소명을 입력하세요"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">주소</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="주소를 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">수용인원</Label>
        <Input
          id="capacity"
          type="number"
          value={formData.capacity}
          onChange={(e) => handleInputChange('capacity', e.target.value)}
          placeholder="수용인원을 입력하세요"
          min="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="장소에 대한 설명을 입력하세요"
          rows={3}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">장소 관리</h1>
          <p className="text-muted-foreground mt-2">
            이벤트 장소를 관리하세요
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>새 장소 추가</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 장소 추가</DialogTitle>
            </DialogHeader>
            <LocationForm />
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
            <MapPin className="w-5 h-5" />
            <span>장소 목록</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>장소명</TableHead>
                <TableHead>주소</TableHead>
                <TableHead>수용인원</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell>{location.address || '-'}</TableCell>
                  <TableCell>{location.capacity ? `${location.capacity}명` : '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{location.description || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      location.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {location.is_active ? '활성' : '비활성'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(location)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>장소 수정</DialogTitle>
                          </DialogHeader>
                          <LocationForm />
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
                            <AlertDialogTitle>장소 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              정말로 이 장소를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(location.id)}>
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

export default LocationsManagement