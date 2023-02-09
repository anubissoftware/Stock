export interface token {
    expirate: number;
    value: string;
}

export interface userSchema {
    id: number,
    name: string,
    rol: number,
    nickname: string,
    password: string,
    registered: any,
    enterprise_id: number,
    token: string | token,
    isAdmin: string,
    socketId: string,
    exp?: number | null,
    renting?: boolean
    quoting?: boolean
    cart?: number
    selling?: number
    email?: string   
    email_verified?: string
    colors?: string
    enterprise_path?: string
    shortcut?: string
    enterprise_name?: string
}
import type { modulesSchema } from "./modulesSchema"
export type Auth = {
    user: object,
    isAuthenticated: boolean,
    modules: Array<modulesSchema>
}

export type userData = Pick<userSchema, "id" | "name" | "nickname" | "isAdmin" | "enterprise_id" | 
"exp" | "rol" | "renting" | "quoting" | "socketId" | "cart" | "selling">
export type userSocketConnected = Pick<userSchema, "id" | "enterprise_id">
export type userLogOut = Pick<userSchema, "id">
export type UserLogin = Pick<userSchema, "nickname" | "password">
export type userOnline = Pick<userSchema, "id" | "nickname">