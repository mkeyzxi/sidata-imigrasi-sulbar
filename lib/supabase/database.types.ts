// This file is auto-generated. Do not modify manually.
// Use `supabase gen types typescript` to regenerate after schema changes.

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
          published: boolean | null
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
          published?: boolean | null
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
          published?: boolean | null
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
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: string },
  TableName extends string | PublicTableNameOrOptions = string,
> = PublicTableNameOrOptions extends { schema: string }
  ? PublicSchema['Tables'] &
      PublicSchema['Views'] &
      PublicSchema['CompositeTypes'][TableName]
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'] &
        PublicSchema['CompositeTypes'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'] &
        PublicSchema['CompositeTypes'])[PublicTableNameOrOptions]
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['CompositeTypes'])
    | { schema: string },
  TableName extends string | PublicTableNameOrOptions = string,
> = PublicTableNameOrOptions extends { schema: string }
  ? PublicSchema['Tables'][TableName]['Insert']
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['CompositeTypes'])
    ? PublicSchema['Tables'][PublicTableNameOrOptions]['Insert']
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['CompositeTypes'])
    | { schema: string },
  TableName extends string | PublicTableNameOrOptions = string,
> = PublicTableNameOrOptions extends { schema: string }
  ? PublicSchema['Tables'][TableName]['Update']
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['CompositeTypes'])
    ? PublicSchema['Tables'][PublicTableNameOrOptions]['Update']
    : never

export type Relationships<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: string; table: keyof (PublicSchema['Tables'] & PublicSchema['Views']) },
  TableName extends string | PublicTableNameOrOptions = string,
> = PublicTableNameOrOptions extends { schema: string; table: string }
  ? PublicSchema['Tables'] & PublicSchema['Views'] & PublicSchema['CompositeTypes'][TableName]
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'] &
        PublicSchema['CompositeTypes'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'] &
        PublicSchema['CompositeTypes'])[PublicTableNameOrOptions]
    : never

export type CompositeTypes<T> = T extends { [k: string]: unknown }
  ? T
  : T extends Record<string, unknown>
    ? T
    : T
