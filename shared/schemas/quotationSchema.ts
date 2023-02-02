export interface quotationSchema {
    id: number
    serial: number
    description: string
    value: number
    client_id: number
    project_id: number
    min_validity: string
    max_validity: string
    user: number
    email: string
    isRenting: boolean
    enterprise_id: number
    one_day: boolean
    from: string
    to: string
    creation: string
    stage: number
    taxing: number
    discount: number
    client_name?: string
    ent_name?: string
}

export interface quotationDetailSchema{
    id: number
    item_id: number
    extras: string
    amount: number
    value: number
    quotation_id: number
    from: string
    to: string
    days: number

    name?: string
}