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
      daily_journals: {
        Row: {
          content: string
          created_at: string | null
          date: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          date: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          date?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      economic_events: {
        Row: {
          actual: number | null
          created_at: string | null
          currency: string
          date: string
          forecast: number | null
          id: string
          indicator: string
          previous: number | null
          updated_at: string | null
        }
        Insert: {
          actual?: number | null
          created_at?: string | null
          currency: string
          date: string
          forecast?: number | null
          id?: string
          indicator: string
          previous?: number | null
          updated_at?: string | null
        }
        Update: {
          actual?: number | null
          created_at?: string | null
          currency?: string
          date?: string
          forecast?: number | null
          id?: string
          indicator?: string
          previous?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          actual_r: number
          created_at: string | null
          currency: string
          date: string
          emotion_after: string | null
          emotion_before: string | null
          emotion_during: string | null
          entry_reason: string | null
          exit_reason: string | null
          followed_plan: boolean | null
          id: string
          outcome: string
          pnl: number
          potential_r: number
          r_value: number
          risk_r: number
          screenshot: string | null
          ticker: string
          updated_at: string | null
          user_id: string
          what_went_right: string | null
          what_went_wrong: string | null
        }
        Insert: {
          actual_r: number
          created_at?: string | null
          currency: string
          date: string
          emotion_after?: string | null
          emotion_before?: string | null
          emotion_during?: string | null
          entry_reason?: string | null
          exit_reason?: string | null
          followed_plan?: boolean | null
          id?: string
          outcome: string
          pnl: number
          potential_r: number
          r_value: number
          risk_r: number
          screenshot?: string | null
          ticker: string
          updated_at?: string | null
          user_id: string
          what_went_right?: string | null
          what_went_wrong?: string | null
        }
        Update: {
          actual_r?: number
          created_at?: string | null
          currency?: string
          date?: string
          emotion_after?: string | null
          emotion_before?: string | null
          emotion_during?: string | null
          entry_reason?: string | null
          exit_reason?: string | null
          followed_plan?: boolean | null
          id?: string
          outcome?: string
          pnl?: number
          potential_r?: number
          r_value?: number
          risk_r?: number
          screenshot?: string | null
          ticker?: string
          updated_at?: string | null
          user_id?: string
          what_went_right?: string | null
          what_went_wrong?: string | null
        }
        Relationships: []
      }
      weekly_reflections: {
        Row: {
          created_at: string | null
          currency: string
          id: string
          pnl: number
          reflection: string
          updated_at: string | null
          user_id: string
          week_end_date: string
        }
        Insert: {
          created_at?: string | null
          currency: string
          id?: string
          pnl: number
          reflection: string
          updated_at?: string | null
          user_id: string
          week_end_date: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          id?: string
          pnl?: number
          reflection?: string
          updated_at?: string | null
          user_id?: string
          week_end_date?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
