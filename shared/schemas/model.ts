// Enterprise model -> sub = subalquiler
export type enterpriseModel = 'rent' | 'sale' | 'rest' | 'sub' 

// Actions in stock
export type basicProductTransactions = 'sale' | 'bought' | 'whole' | 'dispatch' | 'return' |
    'expire'

// Plugins
/**
 * proj = Proyectos - Modulo clientes
 * cart = Carrito de compras - Casi todos los módulos
 */
export type allPlugins = 'proj' | 'cart'

// Action in views
export type basicOperations = 'create' | 'update' | 'list' | 'delete'
// Documents
export type macroOperations = 'quote' | 'dispatch' | 'return' | 'report' | 'invoice' | 'settlement'
// Document prefixes
export type documentPrefix = {
    [key in macroOperations]?: string
}

export type basicProductTransactionPermissions = {
    [key in basicProductTransactions]: boolean
}

export type macroOperationsPermissions = {
    [key in macroOperations]: boolean
}

// All actions settings
export interface enterpriseActions{
    model: enterpriseModel[],
    product: basicProductTransactions[],
    macros: macroOperations[]

    plugins: allPlugins[]
    prefixes: documentPrefix
}

// Actions by module
export interface modulePermissions{
    permissions: basicOperations[];
    module: string
}

