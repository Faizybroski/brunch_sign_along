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
      admin_users: {
        Row: {
          created_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          birthdate: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
        }
        Insert: {
          birthdate?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
        }
        Update: {
          birthdate?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      event_tickets: {
        Row: {
          event_id: number
          food_service_price: number | null
          id: string
          includes_food_service: boolean
          order_id: string
          purchase_date: string | null
          quantity: number
          ticket_type: string
          tier_title: string
          unit_price: number
        }
        Insert: {
          event_id: number
          food_service_price?: number | null
          id?: string
          includes_food_service?: boolean
          order_id: string
          purchase_date?: string | null
          quantity: number
          ticket_type: string
          tier_title: string
          unit_price: number
        }
        Update: {
          event_id?: number
          food_service_price?: number | null
          id?: string
          includes_food_service?: boolean
          order_id?: string
          purchase_date?: string | null
          quantity?: number
          ticket_type?: string
          tier_title?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "food_service_by_event"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "customer_purchase_history"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "event_tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tier_inventory: {
        Row: {
          available_quantity: number
          created_at: string
          event_id: number
          id: number
          initial_quantity: number
          is_active: boolean
          price: number
          ticket_type: string
          tier_title: string
          updated_at: string
        }
        Insert: {
          available_quantity: number
          created_at?: string
          event_id: number
          id?: number
          initial_quantity: number
          is_active?: boolean
          price: number
          ticket_type: string
          tier_title: string
          updated_at?: string
        }
        Update: {
          available_quantity?: number
          created_at?: string
          event_id?: number
          id?: number
          initial_quantity?: number
          is_active?: boolean
          price?: number
          ticket_type?: string
          tier_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tier_inventory_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tier_inventory_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "food_service_by_event"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_vip_inventory: {
        Row: {
          event_id: number | null
          id: number
          quantity: number
          vip_area_id: number | null
          vip_package_id: number | null
        }
        Insert: {
          event_id?: number | null
          id?: number
          quantity: number
          vip_area_id?: number | null
          vip_package_id?: number | null
        }
        Update: {
          event_id?: number | null
          id?: number
          quantity?: number
          vip_area_id?: number | null
          vip_package_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_vip_inventory_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_vip_inventory_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "food_service_by_event"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_vip_inventory_vip_area_id_fkey"
            columns: ["vip_area_id"]
            isOneToOne: false
            referencedRelation: "vip_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_vip_inventory_vip_package_id_fkey"
            columns: ["vip_package_id"]
            isOneToOne: false
            referencedRelation: "vip_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          city: string | null
          date: string
          id: number
          image_url: string
          is_sold_out: boolean
          location: string
          time: string
          title: string
        }
        Insert: {
          city?: string | null
          date: string
          id?: number
          image_url: string
          is_sold_out?: boolean
          location: string
          time: string
          title: string
        }
        Update: {
          city?: string | null
          date?: string
          id?: number
          image_url?: string
          is_sold_out?: boolean
          location?: string
          time?: string
          title?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          active: boolean
          answer: string
          category: string
          created_at: string
          id: number
          order_index: number
          question: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          answer: string
          category?: string
          created_at?: string
          id?: number
          order_index?: number
          question: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          answer?: string
          category?: string
          created_at?: string
          id?: number
          order_index?: number
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          active: boolean
          alt_text: string
          created_at: string
          description: string | null
          id: number
          image_url: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          alt_text: string
          created_at?: string
          description?: string | null
          id?: number
          image_url: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          alt_text?: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      merchandise: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          inventory: number
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          inventory?: number
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          inventory?: number
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      merchandise_purchases: {
        Row: {
          color: string | null
          id: string
          merchandise_item: string
          order_id: string
          quantity: number
          size: string | null
          unit_price: number
        }
        Insert: {
          color?: string | null
          id?: string
          merchandise_item: string
          order_id: string
          quantity: number
          size?: string | null
          unit_price: number
        }
        Update: {
          color?: string | null
          id?: string
          merchandise_item?: string
          order_id?: string
          quantity?: number
          size?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "merchandise_purchases_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "customer_purchase_history"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "merchandise_purchases_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      merchandise_variants: {
        Row: {
          active: boolean
          color: string | null
          created_at: string
          id: number
          inventory: number
          merchandise_id: number
          size: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          color?: string | null
          created_at?: string
          id?: number
          inventory?: number
          merchandise_id: number
          size: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          color?: string | null
          created_at?: string
          id?: number
          inventory?: number
          merchandise_id?: number
          size?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "merchandise_variants_merchandise_id_fkey"
            columns: ["merchandise_id"]
            isOneToOne: false
            referencedRelation: "merchandise"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          customer_id: string
          id: string
          order_date: string
          order_source: string | null
          payment_status: string
          total_amount: number
        }
        Insert: {
          customer_id: string
          id?: string
          order_date?: string
          order_source?: string | null
          payment_status?: string
          total_amount: number
        }
        Update: {
          customer_id?: string
          id?: string
          order_date?: string
          order_source?: string | null
          payment_status?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer_purchase_history"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          active: boolean
          created_at: string
          id: number
          image_url: string | null
          name: string
          quote: string
          rating: number
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: number
          image_url?: string | null
          name: string
          quote: string
          rating?: number
          role: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: number
          image_url?: string | null
          name?: string
          quote?: string
          rating?: number
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      vip_areas: {
        Row: {
          capacity: number
          description: string
          id: number
          name: string
        }
        Insert: {
          capacity: number
          description: string
          id?: number
          name: string
        }
        Update: {
          capacity?: number
          description?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      vip_bookings: {
        Row: {
          booking_date: string | null
          event_id: number | null
          id: number
          vip_area_id: number | null
          vip_package_id: number | null
        }
        Insert: {
          booking_date?: string | null
          event_id?: number | null
          id?: number
          vip_area_id?: number | null
          vip_package_id?: number | null
        }
        Update: {
          booking_date?: string | null
          event_id?: number | null
          id?: number
          vip_area_id?: number | null
          vip_package_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vip_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vip_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "food_service_by_event"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vip_bookings_vip_area_id_fkey"
            columns: ["vip_area_id"]
            isOneToOne: false
            referencedRelation: "vip_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vip_bookings_vip_package_id_fkey"
            columns: ["vip_package_id"]
            isOneToOne: false
            referencedRelation: "vip_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      vip_packages: {
        Row: {
          capacity: number
          description: string
          id: number
          name: string
          price: number
        }
        Insert: {
          capacity: number
          description: string
          id?: number
          name: string
          price: number
        }
        Update: {
          capacity?: number
          description?: string
          id?: number
          name?: string
          price?: number
        }
        Relationships: []
      }
    }
    Views: {
      customer_purchase_history: {
        Row: {
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          event_date: string | null
          event_id: number | null
          event_title: string | null
          food_service_price: number | null
          includes_food_service: boolean | null
          order_date: string | null
          order_id: string | null
          quantity: number | null
          ticket_type: string | null
          tier_title: string | null
          total_ticket_amount: number | null
          unit_price: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "food_service_by_event"
            referencedColumns: ["event_id"]
          },
        ]
      }
      food_service_by_event: {
        Row: {
          event_date: string | null
          event_id: number | null
          event_title: string | null
          total_food_service_quantity: number | null
          total_food_service_revenue: number | null
          total_food_service_tickets: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_admin_status: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_vip_availability: {
        Args: { p_event_id: number; p_vip_area_id: number }
        Returns: {
          package_id: number
          package_name: string
          capacity: number
          price: number
          is_available: boolean
        }[]
      }
      create_ticket_tier: {
        Args: {
          p_event_id: number
          p_ticket_type: string
          p_tier_title: string
          p_price: number
          p_initial_quantity: number
          p_is_active: boolean
        }
        Returns: {
          available_quantity: number
          created_at: string
          event_id: number
          id: number
          initial_quantity: number
          is_active: boolean
          price: number
          ticket_type: string
          tier_title: string
          updated_at: string
        }[]
      }
      delete_ticket_tier: {
        Args: { tier_id: number }
        Returns: boolean
      }
      get_all_events: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          title: string
          date: string
          time: string
          location: string
          city: string
          image_url: string
        }[]
      }
      get_event_by_id: {
        Args: { event_id: number }
        Returns: {
          id: number
          title: string
          date: string
          time: string
          location: string
          city: string
          image_url: string
        }[]
      }
      get_ticket_tiers_for_event: {
        Args: { event_id: number }
        Returns: {
          id: number
          event_id: number
          ticket_type: string
          tier_title: string
          price: number
          initial_quantity: number
          available_quantity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }[]
      }
      toggle_ticket_tier_status: {
        Args: { tier_id: number; new_status: boolean }
        Returns: boolean
      }
      update_ticket_tier: {
        Args: {
          tier_id: number
          p_ticket_type: string
          p_tier_title: string
          p_price: number
          p_initial_quantity: number
          p_is_active: boolean
        }
        Returns: boolean
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
