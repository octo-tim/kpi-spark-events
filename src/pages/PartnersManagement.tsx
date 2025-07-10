import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

const PartnersManagement = () => {
  const { toast } = useToast()
  const [partners, setPartners] = useState<any[]>([])
  const [editingPartner, setEditingPartner] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    description: ''
  })

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPartners(data || [])
    } catch (error) {
      console.error('Error loading partners:', error)
      toast({
        title: "오류",
        description: "파트너 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (partner: any) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      contactPerson: partner.contact_person || '',
      contactPhone: partner.contact_phone || '',
      contactEmail: partner.contact_email || '',
      description: partner.description || ''
    })
    setIsEditDialogOpen(true)
  }

  const handleAdd = () => {
    setFormData({
      name: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      description: ''
    })
    setIsAddDialogOpen(true)
  }

  const handleSubmit = async (isEdit: boolean) => {
    try {
      const submitData = {
        name: formData.name,
        contact_person: formData.contactPerson,
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail,
        description: formData.description
      }

      if (isEdit && editingPartner) {
        const { error } = await supabase
          .from('partners')
          .update(submitData)
          .eq('id', editingPartner.id)

        if (error) throw error

        toast({
          title: "성공",
          description: "파트너 정보가 수정되었습니다."
        })
        setIsEditDialogOpen(false)
      } else {
        const { error } = await supabase
          .from('partners')
          .insert([submitData])

        if (error) throw error

        toast({
          title: "성공",
          description: "새 파트너가 등록되었습니다."
        })
        setIsAddDialogOpen(false)
      }

      loadPartners()
    } catch (error) {
      console.error('Error saving partner:', error)
      toast({
        title: "오류",
        description: `파트너 ${isEdit ? '수정' : '등록'} 중 오류가 발생했습니다.`,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('partners')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "성공",
        description: "파트너가 삭제되었습니다."
      })
      loadPartners()
    } catch (error) {
      console.error('Error deleting partner:', error)
      toast({
        title: "오류",
        description: "파트너 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const PartnerForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">파트너명 *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="파트너명을 입력하세요"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">담당자명</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            placeholder="담당자명을 입력하세요"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contactPhone">담당자 연락처</Label>
          <Input
            id="contactPhone"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
            placeholder="담당자 연락처를 입력하세요"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail">담당자 이메일</Label>
        <Input
          id="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
          placeholder="담당자 이메일을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="파트너에 대한 설명을 입력하세요"
          rows={3}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">파트너 관리</h1>
          <p className="text-muted-foreground mt-2">
            제휴 파트너를 관리하세요
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>새 파트너 추가</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 파트너 추가</DialogTitle>
            </DialogHeader>
            <PartnerForm />
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
            <Building2 className="w-5 h-5" />
            <span>파트너 목록</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>파트너명</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{partner.contact_person || '-'}</TableCell>
                  <TableCell>{partner.contact_phone || '-'}</TableCell>
                  <TableCell>{partner.contact_email || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      partner.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {partner.is_active ? '활성' : '비활성'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(partner)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>파트너 수정</DialogTitle>
                          </DialogHeader>
                          <PartnerForm />
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
                            <AlertDialogTitle>파트너 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              정말로 이 파트너를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(partner.id)}>
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

export default PartnersManagement