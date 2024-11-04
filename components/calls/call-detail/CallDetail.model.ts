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
    input_buttons_data?: (string | boolean)[];
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
  
  export interface InputButtonSchema {
    title: string;
    rows: RowElements[][];
  }

  export interface RowElements {
    display_text: string;
    key_name: string;
    type: string;
    value?: boolean | string;
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
  
  
  interface FocusAreaSection {
    html: string;
    title: string;
  }