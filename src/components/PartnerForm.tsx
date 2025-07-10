import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface PartnerFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const PartnerForm = ({ onSuccess, onCancel }: PartnerFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    description: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('파트너 등록 시도:', formData)
    
    try {
      const { data, error } = await supabase
        .from('partners')
        .insert([
          {
            name: formData.name,
            contact_person: formData.contactPerson,
            contact_phone: formData.contactPhone,
            contact_email: formData.contactEmail,
            description: formData.description
          }
        ])
        .select()

      if (error) {
        console.error('파트너 등록 오류:', error)
        throw error
      }

      console.log('파트너 등록 성공:', data)
      
      toast({
        title: "성공",
        description: "파트너가 성공적으로 등록되었습니다."
      })

      onSuccess()
    } catch (error) {
      console.error('파트너 등록 오류:', error)
      toast({
        title: "오류",
        description: "파트너 등록 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>새 파트너 등록</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
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

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
              <Button type="button" onClick={handleSubmit}>
                등록
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PartnerForm