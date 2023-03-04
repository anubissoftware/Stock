export interface clientsTags{
    id: number
    tag: string
    color: string
}

export interface clientsContactSchema{
    id: number | string
    client_id: number
    name: string
    phone: string
    email: string
    client_tag: number | clientsTags | string
    birth: string
    main: number
    helper: boolean
}

export interface clientEnterpriseSchema{
    id: number
    name: string
    rut: {
        name: string,
        info: string
    }
    type: number | {id: number, name: string}
    nit: string
    cv: number
    email: string
    registro: string
    contact_name: string
    contact_phone: string
    contact_email: string
    enterprise: number
    address: string

    media_id?: number
    path?: string
    filename?: string
    host?: string
    contacts?: clientsContactSchema[]
}
