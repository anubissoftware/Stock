export interface customerschema{
    id: number,
    name: string,
    email: string,
    cellphone: string,
    password: string,
    registered: any,
    token: string,
    code: string
}

export type customerToRegister = Pick<customerschema, "name" | "email" | "cellphone" | "password">
export type customerEmail = Pick<customerschema, "email" >
export type customerCellphone = Pick<customerschema, "cellphone" >
export type customerValidate = Pick<customerschema, "email" | "cellphone" | "code" >