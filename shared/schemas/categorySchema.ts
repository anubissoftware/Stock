export interface categorySchema{
    id: number,
    name: string,
    color: string,
    enterprise: number
}

export type categoryQuery = Pick<categorySchema, "id" | "name" | "color">
export type categoryToSave = Pick<categorySchema, "name" | "color">
export type categoryToDelete = Pick<categoryQuery, "id">