import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface LocationFormProps {
  onSuccess: () => void
  onCancel: () => void
}

const LocationForm = ({ onSuccess, onCancel }: LocationFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    capacity: '',
    description: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('장소 등록 시도:', formData)
    
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert([
          {
            name: formData.name,
            address: formData.address,
            capacity: formData.capacity ? parseInt(formData.capacity) : null,
            description: formData.description
          }
        ])
        .select()

      if (error) {
        console.error('장소 등록 오류:', error)
        throw error
      }

      console.log('장소 등록 성공:', data)

      toast({
        title: "성공",
        description: "장소가 성공적으로 등록되었습니다."
      })

      onSuccess()
    } catch (error) {
      console.error('장소 등록 오류:', error)
      toast({
        title: "오류",
        description: "장소 등록 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>새 장소 등록</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
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

export default LocationForm