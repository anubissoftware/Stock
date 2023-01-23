export interface modulesSchema {
    id: number
    read: boolean
    write: boolean
    edit: boolean
    name: string
    depends: number | null
    icon: string
    url: string
    children?: Array<modulesSchema>
}