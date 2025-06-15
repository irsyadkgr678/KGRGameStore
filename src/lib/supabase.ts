import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      games: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          discount_percentage: number | null
          discount_amount: number | null
          is_free: boolean
          genre: string
          image_url: string | null
          screenshots: string[] | null
          trailer_url: string | null
          platforms: string[] | null
          about_game: string | null
          minimum_specs: any | null
          developer: string | null
          publisher: string | null
          release_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          discount_percentage?: number | null
          discount_amount?: number | null
          is_free?: boolean
          genre: string
          image_url?: string | null
          screenshots?: string[] | null
          trailer_url?: string | null
          platforms?: string[] | null
          about_game?: string | null
          minimum_specs?: any | null
          developer?: string | null
          publisher?: string | null
          release_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          discount_percentage?: number | null
          discount_amount?: number | null
          is_free?: boolean
          genre?: string
          image_url?: string | null
          screenshots?: string[] | null
          trailer_url?: string | null
          platforms?: string[] | null
          about_game?: string | null
          minimum_specs?: any | null
          developer?: string | null
          publisher?: string | null
          release_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      game_reviews: {
        Row: {
          id: string
          game_id: string
          user_id: string
          rating: number
          is_recommended: boolean
          review_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          game_id: string
          user_id: string
          rating: number
          is_recommended?: boolean
          review_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          user_id?: string
          rating?: number
          is_recommended?: boolean
          review_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          slug: string
          published: boolean
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt: string
          slug: string
          published?: boolean
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          slug?: string
          published?: boolean
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}