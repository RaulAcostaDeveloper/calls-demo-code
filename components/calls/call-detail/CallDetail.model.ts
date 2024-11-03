export interface CallData {
    id?: string;
    call_date?: string;
    ongoing_call_status?: string;
    guest_labels?: string[];
    phone_number?: string;
    upsell_in_dollars?: number;
    info_buttons_section?: InfoButtonSection[];
    call_start_time?: string;
    input_buttons_schema?: InputButtonSchema[];
    action_buttons_section?: ActionButtonSection[];
    location_id?: string;
    input_buttons_data?: InputButtonsData;
    last_update_time_utc?: number;
    transcript_summary?: string;
    instruction_labels?: string[];
    focus_area_section?: FocusAreaSection[];
    full_transcript?: string[];
    call_start_time_utc?: number;
    call_length_in_seconds?: number;
    icon_type?: string;
    recording_url?: string;
    labels?: string[];
  }

  interface InfoButtonSection {
    title: string;
    rows: {
      [key: string]: InfoButton[];
    };
  }
  
  interface InfoButton {
    id: string;
    display_text: string;
  }
  
  interface InputButtonSchema {
    title: string;
    rows: {
      [key: string]: InputButton[];
    };
  }
  
  interface InputButton {
    type: string;
    display_text: string;
    key_name: string;
  }
  
  interface ActionButtonSection {
    title: string;
    rows: {
      [key: string]: ActionButton[];
    };
  }
  
  interface ActionButton {
    id: string;
    display_text: string;
  }
  
  interface InputButtonsData {
    marked_for_admin_review_notes: string;
    upsell_dollars: string;
    marked_for_admin_review: boolean;
    upsell_highlights_successful: boolean;
    marked_for_manager_review: boolean;
    upsell_treatment_successful: boolean;
    marked_for_manager_review_notes: string;
    marked_for_salon_review: boolean;
    upsell_highlights_attempted: boolean;
    marked_for_salon_review_notes: string;
    upsell_treatment_attempted: boolean;
  }
  
  interface FocusAreaSection {
    html: string;
    title: string;
  }