import {productStock} from './productSchema'
export interface dispatchScheme {
    id: number
    out_store: string
    received: string
    quotation_id: number
    created_at: string
    created_by: number
    quotation_serial?: number
    client_id?: number
    
    contact_received: number
    user_sent: number
    name_sent: string
    plate: string
}
export interface dispatchDetailSchema{
    id: number
    quotation_detail_id: number
    dispatch_id: number
    amount: number
    item_id: number
    partners: productStock[]
}