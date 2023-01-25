export interface clientQuotationResponse {
    serial: number
    description: string
    value: number
    min_validity: string
    max_validity: string
    isRenting: number
    one_day: number
    stage: number
    id: number
    detail_id: number
    item_id: number
    amount: number
    detail_value: number
    from: string
    to: string
    days: number
    dispatching: number
    name: string
    nit: string
    product_name: string
}

export interface quotationDetailView{
    detail_id: number
    item_id: number
    amount: number
    detail_value: number
    from: string
    to: string
    days: number
    dispatching: number
    product_name: string
}

export interface clientQuotationArr {
    serial: number
    description: string
    value: number
    min_validity: string
    max_validity: string
    isRenting: number
    one_day: number
    stage: number
    id: number
    name: string
    nit: string
    detail: quotationDetailView[]
}