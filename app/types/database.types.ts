export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      favourites: {
        Row: {
          created_at: string
          id: number
          place_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          place_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          place_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favourite_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "food_places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favourite_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      food_places: {
        Row: {
          address: string
          alias: string | null
          close_time: string | null
          created_at: string
          description: string | null
          id: number
          lat: number | null
          lng: number | null
          name: string
          open_time: string | null
          photo: string | null
          tags: string[] | null
        }
        Insert: {
          address: string
          alias?: string | null
          close_time?: string | null
          created_at?: string
          description?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          name: string
          open_time?: string | null
          photo?: string | null
          tags?: string[] | null
        }
        Update: {
          address?: string
          alias?: string | null
          close_time?: string | null
          created_at?: string
          description?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          name?: string
          open_time?: string | null
          photo?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: number
          place_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          place_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          place_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "food_places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cube: {
        Args: { "": number[] } | { "": number }
        Returns: unknown
      }
      cube_dim: {
        Args: { "": unknown }
        Returns: number
      }
      cube_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      cube_is_point: {
        Args: { "": unknown }
        Returns: boolean
      }
      cube_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      cube_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      cube_send: {
        Args: { "": unknown }
        Returns: string
      }
      cube_size: {
        Args: { "": unknown }
        Returns: number
      }
      earth: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      food_places_within_distance: {
        Args: { user_lat: number; user_lng: number; radius: number }
        Returns: {
          address: string
          alias: string | null
          close_time: string | null
          created_at: string
          description: string | null
          id: number
          lat: number | null
          lng: number | null
          name: string
          open_time: string | null
          photo: string | null
          tags: string[] | null
        }[]
      }
      gc_to_sec: {
        Args: { "": number }
        Returns: number
      }
      get_favourite_places: {
        Args: { user_uuid: string }
        Returns: {
          address: string
          alias: string | null
          close_time: string | null
          created_at: string
          description: string | null
          id: number
          lat: number | null
          lng: number | null
          name: string
          open_time: string | null
          photo: string | null
          tags: string[] | null
        }[]
      }
      get_wishlist_places: {
        Args: { user_uuid: string }
        Returns: {
          address: string
          alias: string | null
          close_time: string | null
          created_at: string
          description: string | null
          id: number
          lat: number | null
          lng: number | null
          name: string
          open_time: string | null
          photo: string | null
          tags: string[] | null
        }[]
      }
      latitude: {
        Args: { "": unknown }
        Returns: number
      }
      longitude: {
        Args: { "": unknown }
        Returns: number
      }
      search_food_places: {
        Args: {
          user_lat?: number
          user_lng?: number
          radius?: number
          tags_filter?: string[]
          text_query?: string
        }
        Returns: {
          address: string
          alias: string | null
          close_time: string | null
          created_at: string
          description: string | null
          id: number
          lat: number | null
          lng: number | null
          name: string
          open_time: string | null
          photo: string | null
          tags: string[] | null
        }[]
      }
      sec_to_gc: {
        Args: { "": number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
