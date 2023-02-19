export interface quotationSchema {
    id: number
    serial: number | string
    description: string
    value: number
    client_id: number
    project_id: number
    min_validity: string
    max_validity: string
    user: number
    email: string
    isRenting: boolean | number
    enterprise_id: number
    one_day: boolean | number
    from: string
    to: string
    creation: string
    stage: number
    taxing: number
    discount: number
    client_name?: string
    ent_name?: string
    rent_max_date?: string
    rent_min_date?: string
    renting?: string
    max_date?: string
    min_date?: string
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
    dispatching: number
    amount_avaliable: number
    returning: number

    name?: string
}