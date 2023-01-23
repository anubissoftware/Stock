export interface mediaSchema {
    id: number
    path: string
    filename: string
    host: string
}
export interface mediaUpdateDTO{
    b64: string
}
export interface enterpriseMediaInfo{
    path: string
    filename: string
    host: string
    shortcut: string
}
