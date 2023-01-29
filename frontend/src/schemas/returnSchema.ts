export interface returnScheme {
    id: number
    return_date: string
    quotation_id: number
    created_at: string
    created_by: number
    quotation_serial?: number
    client_id?: number
    detail?: any
    
}
export interface returnDetailSchema{
    id: number
    quotation_detail_id: number
    return_id: number
    amount: number
}