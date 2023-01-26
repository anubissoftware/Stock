export interface dispatchScheme {
    id: number
    out_store: string
    received: string
    quotation_id: number
    created_at: string
    created_by: number
    quotation_serial?: number
    
}
export interface dispatchDetailSchema{
    id: number
    quotation_detail_id: number
    dispatch_id: number
    amount: number
}