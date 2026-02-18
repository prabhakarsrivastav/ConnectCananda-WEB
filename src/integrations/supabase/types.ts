export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affiliates: {
        Row: {
          created_at: string | null
          id: string
          pending_payout: number | null
          referral_code: string | null
          total_commission: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pending_payout?: number | null
          referral_code?: string | null
          total_commission?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pending_payout?: number | null
          referral_code?: string | null
          total_commission?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          mrr: number
          plan: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mrr: number
          plan: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mrr?: number
          plan?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          service_id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          service_id: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          service_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          agent_type: string
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          agent_type: string
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          role: string
          user_id?: string | null
        }
        Update: {
          agent_type?: string
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      coupon_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string | null
          discount_percent: number
          id: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string | null
          discount_percent: number
          id?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string | null
          discount_percent?: number
          id?: string
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          lesson_order: number
          resource_url: string | null
          title: string
          video_url: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          lesson_order?: number
          resource_url?: string | null
          title: string
          video_url: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          lesson_order?: number
          resource_url?: string | null
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_free: boolean
          price: number
          sales_count: number
          thumbnail: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_free?: boolean
          price?: number
          sales_count?: number
          thumbnail?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_free?: boolean
          price?: number
          sales_count?: number
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      download_requests: {
        Row: {
          created_at: string | null
          ebook_id: string
          email: string
          id: string
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          ebook_id: string
          email: string
          id?: string
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          ebook_id?: string
          email?: string
          id?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_requests_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
        ]
      }
      ebooks: {
        Row: {
          cover_image: string | null
          created_at: string | null
          description: string
          id: string
          is_free: boolean
          pdf_url: string
          price: number
          sales_count: number
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_free?: boolean
          pdf_url: string
          price?: number
          sales_count?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_free?: boolean
          pdf_url?: string
          price?: number
          sales_count?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      free_external_courses: {
        Row: {
          created_at: string | null
          description: string
          display_order: number | null
          external_url: string
          id: string
          is_active: boolean | null
          thumbnail: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          display_order?: number | null
          external_url: string
          id?: string
          is_active?: boolean | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          display_order?: number | null
          external_url?: string
          id?: string
          is_active?: boolean | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          coupon_code: string | null
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          coupon_code?: string | null
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          coupon_code?: string | null
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string | null
          id: string
          priority: string | null
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority?: string | null
          status?: string
          subject: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: string | null
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webinar_registrations: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          user_id: string | null
          webinar_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          user_id?: string | null
          webinar_id: string
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          user_id?: string | null
          webinar_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webinar_registrations_webinar_id_fkey"
            columns: ["webinar_id"]
            isOneToOne: false
            referencedRelation: "webinars"
            referencedColumns: ["id"]
          },
        ]
      }
      webinars: {
        Row: {
          cover_image: string | null
          created_at: string | null
          date: string
          description: string
          duration_minutes: number
          id: string
          max_attendees: number | null
          speaker_image: string | null
          speaker_name: string
          speaker_title: string | null
          status: string
          time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          date: string
          description: string
          duration_minutes?: number
          id?: string
          max_attendees?: number | null
          speaker_image?: string | null
          speaker_name: string
          speaker_title?: string | null
          status?: string
          time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          date?: string
          description?: string
          duration_minutes?: number
          id?: string
          max_attendees?: number | null
          speaker_image?: string | null
          speaker_name?: string
          speaker_title?: string | null
          status?: string
          time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_webinar_registration_count: {
        Args: { webinar_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
