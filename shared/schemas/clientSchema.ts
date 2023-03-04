import { clientsContactSchema } from "./clientEnterpriseSchema"

export interface clientschema{
    id: number,
    name: string,
    email: string,
    cellphone: string,
    password: string,
    registered: any,
    token: string,
    code: string,
    contact_email: string,
    contact_name: string,
    contact_phone: string,
    contacts: clientsContactSchema[]
}

export type clientToRegister = Pick<clientschema, "name" | "email" | "cellphone" | "password">
export type clientEmail = Pick<clientschema, "email" >
export type clientCellphone = Pick<clientschema, "cellphone" >
export type clientValidate = Pick<clientschema, "email" | "cellphone" | "code" >
export type clientLogin = Pick<clientschema, "email" | "password" >

export interface projectSchema {
    id: number
    name: string
    address: string
    client_id: number
    register: string
    budget: number
    renting: boolean | number
    contacts: clientsContactSchema[]
}

