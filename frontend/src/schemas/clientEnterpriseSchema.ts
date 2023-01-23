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

    media_id?: number
    path?: string
    filename?: string
    host?: string
}
