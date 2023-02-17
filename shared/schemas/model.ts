// Enterprise model
export type enterpriseModel = 'rent' | 'sale' | 'rest' 

// Actions in stock
export type basicProductTransactions = 'sale' | 'bought' | 'whole' | 'dispatch' | 'return' |
    'expire'

// Action in views
export type basicOperations = 'create' | 'update' | 'list' | 'delete'
// Documents
export type macroOperations = 'quote' | 'dispatch' | 'return' | 'report' | 'invoice'
// Document prefixes
export type documentPrefix = {
    [key in macroOperations]?: string
}

// All actions settings
export interface enterpriseActions{
    model: enterpriseModel[],
    product: basicProductTransactions[],
    macros: macroOperations[]

    cart: boolean,
    project: boolean,
    prefixes: documentPrefix
}

// Actions by module
export interface modulePermissions{
    permissions: basicOperations[];
    module: string
}

