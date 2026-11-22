// Database types for Supabase
// Simple type definitions for use with createClient

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: string
          unit_slug: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: string
          unit_slug?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: string
          unit_slug?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
      }
      units: {
        Row: {
          id: string
          name: string
          short_name: string | null
          type: string
          description: string | null
          image_url: string | null
          slug: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          short_name?: string | null
          type: string
          description?: string | null
          image_url?: string | null
          slug: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          short_name?: string | null
          type?: string
          description?: string | null
          image_url?: string | null
          slug?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      bidang: {
        Row: {
          id: string
          unit_id: string
          name: string
          slug: string
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          unit_id: string
          name: string
          slug: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          unit_id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      kegiatan: {
        Row: {
          id: number
          unit_id: string
          bidang_id: string | null
          title: string
          description: string | null
          date: string
          location: string | null
          type: string | null
          image_url: string | null
          published: boolean
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          unit_id: string
          bidang_id?: string | null
          title: string
          description?: string | null
          date: string
          location?: string | null
          type?: string | null
          image_url?: string | null
          published?: boolean
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          unit_id?: string
          bidang_id?: string | null
          title?: string
          description?: string | null
          date?: string
          location?: string | null
          type?: string | null
          image_url?: string | null
          published?: boolean
          created_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      serapan_anggaran: {
        Row: {
          id: number
          bidang_id: string
          bulan: number
          tahun: number
          jumlah: number
          created_at: string | null
        }
        Insert: {
          id?: number
          bidang_id: string
          bulan: number
          tahun: number
          jumlah?: number
          created_at?: string | null
        }
        Update: {
          id?: number
          bidang_id?: string
          bulan?: number
          tahun?: number
          jumlah?: number
          created_at?: string | null
        }
      }
      statistik_pendaftaran: {
        Row: {
          id: number
          unit_id: string
          kategori: string
          sub_kategori: string | null
          label: string | null
          nilai: number
          detail: Json | null
          tahun: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          unit_id: string
          kategori: string
          sub_kategori?: string | null
          label?: string | null
          nilai?: number
          detail?: Json | null
          tahun: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          unit_id?: string
          kategori?: string
          sub_kategori?: string | null
          label?: string | null
          nilai?: number
          detail?: Json | null
          tahun?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

// Simple type aliases for common use cases
export type Profiles = Database['public']['Tables']['profiles']['Row']
export type Units = Database['public']['Tables']['units']['Row']
export type Kegiatan = Database['public']['Tables']['kegiatan']['Row']
export type Statistik = Database['public']['Tables']['statistik_pendaftaran']['Row']
