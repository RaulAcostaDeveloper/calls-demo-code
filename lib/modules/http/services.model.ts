export interface ButtonsBodyService {
    id?: string,
    call_id?: string,
    location_id?: string,
    phone_number?: string,
    other_info?: string
}

export interface FormBodyService {
    id?: string,
    call_id?: string,
    location_id?: string,
    phone_number?: string,
    other_info?: string
    input_buttons_data:  Record<string, string | boolean>,
}