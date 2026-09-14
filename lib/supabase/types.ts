export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled'

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          treatment_slug: string
          treatment_name: string
          customer_name: string
          customer_email: string
          customer_phone: string
          start_time: string        // ISO 8601 timestamptz
          end_time: string          // start + prep + duration + buffer
          status: BookingStatus
          notes: string | null
          admin_note: string | null // reason for rejection / internal note
          created_at: string
        }
        Insert: {
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
        Update: {
          status?: BookingStatus
          admin_note?: string | null
          start_time?: string
          end_time?: string
        }
      }
      blocked_times: {
        Row: {
          id: string
          start_time: string
          end_time: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          start_time: string
          end_time: string
          reason?: string | null
        }
        Update: {
          start_time?: string
          end_time?: string
          reason?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
