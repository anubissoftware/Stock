import { partnerSchema } from "./partnerSchema"

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
    sigla?: string
    amount_avaliable?: number
    dispatching?: number
    weight: number
    partners?: {
        partner_id: number,
        amount: number,
        sigla: string | partnerSchema
    }[]
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
    ref: string,
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
    weight: number,
    height: number,
    width: number,
    depth: number,
    lineal: number,
    expired: number,
    wholesale: number,
    onSales: number,
    onBuying: number,
    onRenting: number,
    onLosses: number,
    isRecipe: string,
    categories: Array<category> | any,
    creation: string,
    enterprise: number,
    picture?: string,
    // Datos de request
    updateIngre: boolean | undefined,
    recipeDetail: Array<recipeSchema> | Array<undefined>,
    amount: number,
    clientName: string,
    clientId: number | undefined
    client_id?: number,
    showAction?: boolean
    infoCategories?: Array<category>
    quotation_detail_id?: number
    partner_id?: number
}

export type productInMenu = Pick<productSchema, "id" | "currency" | "description" | "enterprise" | "name" | "price">
export type productToSave = Pick<productSchema, "name" | "ref" | "description" | "unit" | "stock" |  "cost" | "price" | 
"wholesale" | "isRecipe" | "categories" | "recipeDetail" | "updateIngre" | "rent" | "weight" | "height" | "depth" |
"width" | "lineal">
export type productToEmit = Pick<productSchema, "id" | "name" | "ref" | "description" | "unit" | "stock" | "cost" | 
"price" | "isRecipe" | "categories" | "wholesale" | "rent" | "weight" | "height" | "depth" | "width" | "lineal">
export type productToRemove = Pick<productSchema, "id">

export type productStock = Pick<productSchema, "id" | "amount" | "description" | "rent" | "partner_id">
export type productReturning = Pick<productSchema, "id" | "amount" | "quotation_detail_id" | "partner_id">
export interface productBasicTransaction {
    client_id: number;
    products: productStock[]
}
export interface productReturnTransaction{
    dispatch_id?: number;
    quotation_id?: number;
    client_id: number;
    products: productReturning[];
}

export interface addDispatchThread{
    thread_id: number,
    products: productStock[]
}

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

export interface clientProduct extends productSchema{
    id: number
    client_id: number
    product_id: number
    amount: number
}

