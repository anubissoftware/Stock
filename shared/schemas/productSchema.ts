
export interface category{
    id: number,
    name: string,
    color: string
}

export interface productsInCartType {
    amount: number
    days?: number
    start_rent?: string
    detail_id?: number
    id: number
    end_rent?: string
    name: string
    value: number
    max?: number
    renting?: number
}

export interface recipeSchema{
    id: number,
    result: number,
    required: number,
    amount: number,
    extras: string,
    unit: number
}

export interface decreaseStock{
    id: number,
    amount: number
}

export type recipeCrafting = Pick<recipeSchema, "required" | "amount" | "unit" | "id">

export interface productSchema{
    id: number,
    name: string,
    description: string,
    unit: number,
    stock: number,
    sold: number,
    rented: number,
    toCraft: number,
    currency: string,
    price: number,
    cost: number,
    rent: number,
    expired: number,
    wholesale: number,
    onSales: number,
    onBuying: number,
    onRenting: number,
    onLosses: number,
    isRecipe: string,
    categories: Array<category>,
    creation: string,
    enterprise: number,
    picture?: string,
    // Datos de request
    updateIngre: boolean | undefined,
    recipeDetail: Array<recipeSchema> | Array<undefined>,
    amount: number,
    clientName: string,
    clientId: number | undefined
    showAction?: boolean
    infoCategories?: Array<category>
}

export type productInMenu = Pick<productSchema, "id" | "currency" | "description" | "enterprise" | "name" | "price">
export type productToSave = Pick<productSchema, "name" | "description" | "unit" | "stock" |  "cost" | "price" | "wholesale" | "isRecipe" | "categories" | "recipeDetail" | "updateIngre">
export type productToEmit = Pick<productSchema, "id" | "name" | "description" | "unit" | "stock" | "cost" | "price" | "isRecipe" | "categories" | "wholesale">
export type productToRemove = Pick<productSchema, "id">

export type productToSell = Pick<productSchema, "id" | "amount" | "description">
export interface productsToSell{
    products: Array<productToSell>
    clientName: string,
    clientId: string | undefined,
    description: string
}

export type historicTransactions = {
    sells: number,
    boughts: number,
    losses: number,
    date: string
}