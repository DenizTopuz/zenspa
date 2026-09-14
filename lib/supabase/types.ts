export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled'

export type BookingRow = {
  id: string
  treatment_slug: string
  treatment_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  start_time: string
  end_time: string
  status: BookingStatus
  notes: string | null
  admin_note: string | null
  created_at: string
}

export type BookingInsert = {
  id?: string
  treatment_slug: string
  treatment_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  start_time: string
  end_time: string
  status?: BookingStatus
  notes?: string | null
  admin_note?: string | null
  created_at?: string
}

export type BookingUpdate = {
  status?: BookingStatus
  admin_note?: string | null
  start_time?: string
  end_time?: string
}

export type BlockedTimeRow = {
  id: string
  start_time: string
  end_time: string
  reason: string | null
  created_at: string
}

export type BlockedTimeInsert = {
  id?: string
  start_time: string
  end_time: string
  reason?: string | null
}

// Supabase Database generic — shape required by @supabase/supabase-js v2
export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: BookingRow
        Insert: BookingInsert
        Update: BookingUpdate
        Relationships: []
      }
      blocked_times: {
        Row: BlockedTimeRow
        Insert: BlockedTimeInsert
        Update: Partial<BlockedTimeInsert>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
