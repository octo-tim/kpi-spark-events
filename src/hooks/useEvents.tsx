import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Event {
  id: string
  title: string
  type: string
  status: string
  start_date: string
  end_date: string
  partner?: string
  target_contracts: number
  actual_contracts: number
  target_estimates: number
  actual_estimates: number
  target_sqm: number
  actual_sqm: number
  total_cost: number
  efficiency: number
  created_at: string
  updated_at: string
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // 모든 이벤트 조회
  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setEvents(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이벤트를 불러오는데 실패했습니다.'
      setError(errorMessage)
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 기간별 이벤트 조회
  const fetchEventsByPeriod = async (startDate: string, endDate: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
        .order('start_date', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이벤트를 불러오는데 실패했습니다.'
      setError(errorMessage)
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      })
      return []
    } finally {
      setLoading(false)
    }
  }

  // 월별 이벤트 조회
  const fetchEventsByMonth = async (year: string, month: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const startDate = `${year}-${month.padStart(2, '0')}-01`
      const endDate = `${year}-${month.padStart(2, '0')}-${new Date(parseInt(year), parseInt(month), 0).getDate().toString().padStart(2, '0')}`
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', startDate)
        .lte('start_date', endDate)
        .order('start_date', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이벤트를 불러오는데 실패했습니다.'
      setError(errorMessage)
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      })
      return []
    } finally {
      setLoading(false)
    }
  }

  // 분기별 이벤트 조회
  const fetchEventsByQuarter = async (year: string, quarter: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const quarterMonths = {
        '1': { start: '01', end: '03' },
        '2': { start: '04', end: '06' },
        '3': { start: '07', end: '09' },
        '4': { start: '10', end: '12' }
      }
      
      const q = quarterMonths[quarter as keyof typeof quarterMonths]
      const startDate = `${year}-${q.start}-01`
      const endDate = `${year}-${q.end}-${new Date(parseInt(year), parseInt(q.end), 0).getDate().toString().padStart(2, '0')}`
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
        .order('start_date', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이벤트를 불러오는데 실패했습니다.'
      setError(errorMessage)
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      })
      return []
    } finally {
      setLoading(false)
    }
  }

  // 상태별 이벤트 조회
  const fetchEventsByStatus = async (status: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', status)
        .order('start_date', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이벤트를 불러오는데 실패했습니다.'
      setError(errorMessage)
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      })
      return []
    } finally {
      setLoading(false)
    }
  }

  // 이벤트 생성
  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single()

      if (error) {
        throw error
      }

      toast({
        title: "성공",
        description: "이벤트가 성공적으로 생성되었습니다.",
      })

      await fetchEvents() // 목록 새로고침
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이벤트 생성에 실패했습니다.'
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  // 이벤트 수정
  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      toast({
        title: "성공",
        description: "이벤트가 성공적으로 수정되었습니다.",
      })

      await fetchEvents() // 목록 새로고침
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이벤트 수정에 실패했습니다.'
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  // 이벤트 삭제
  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      toast({
        title: "성공",
        description: "이벤트가 성공적으로 삭제되었습니다.",
      })

      await fetchEvents() // 목록 새로고침
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이벤트 삭제에 실패했습니다.'
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  // 컴포넌트 마운트 시 이벤트 목록 로드
  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    loading,
    error,
    fetchEvents,
    fetchEventsByPeriod,
    fetchEventsByMonth,
    fetchEventsByQuarter,
    fetchEventsByStatus,
    createEvent,
    updateEvent,
    deleteEvent
  }
}