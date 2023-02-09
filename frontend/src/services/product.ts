import type { categorySchema, productSchema } from '@/schemas'
import { ApiCLient } from '@/services/index'


const getItems =  (token: string) => {
     return ApiCLient.get('product', {
        headers: {
            'authorization': `bearer ${token}`
        }
     })
}

const addItems = (token: string, item: object) => {
    return ApiCLient.post('product', item, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

const deleteItemService = (token: string, id: number) => {
    return ApiCLient.post('product/remove', {id}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

const updateItemService = (token: string, item: productSchema) => {
    return ApiCLient.post('product/update', item, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

/**
 * Get units types of products
 * @param token 
 * @returns {AxiosResponse}
 */
const getUnits = (token: string) => {
    return ApiCLient.get('units', {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

/**
 * Get categories of products
 * @param token 
 * @returns {AxiosResponse}
 */
 const getCategories = (token: string) => {
    return ApiCLient.get('categories', {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

const createCategory = (token: string, cat: categorySchema) => {
    return ApiCLient.post('categories', cat, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

const updateCategory = (token: string, cat: categorySchema) => {
    return ApiCLient.post('categories/update', cat, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

const deleteCategory = (token: string, id: number) => {
    return ApiCLient.post('categories/delete', {id}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}


/**
 * Create product
 * @param token 
 * @param product 
 * @returns {AxiosResponse}
 */
 const createProduct = (token: string, product: productSchema) => {
    return ApiCLient.post('product', product, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

const deprecateProduct = (token: string, id: number, amount: number) => {
    return ApiCLient.post('product/expire', {id, amount}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

const sellProduct = (token: string, body: Array<{id: number, amount: number, description: string}>) => {
    return ApiCLient.post('product/sell', {products: body, clientName: ''}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

const dispatchProduct = (token: string, body: Array<{id: number, amount: number, description: string}>) => {
    return ApiCLient.post('product/dispatch', {products: body, clientName: ''}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

const returnProduct = (token: string, body: Array<{id: number, amount: number, description: string}>) => {
    return ApiCLient.post('product/return', {products: body, clientName: ''}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}


const wholesaleProduct = (token: string, id: number, amount: number) => {
    return ApiCLient.post('product/sell', {products: [{id, amount, description: ''}], clientName: ''}, {
        headers: {
            'authorization': `bearer ${token}`,
            'wholesale': 'true'
        }
    })
}

const buyProduct = (token: string, id: number, amount: number) => {
    return ApiCLient. post('product/buy', {id, amount}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

const craftProduct = (token: string, id: number, amount: number) => {
    return ApiCLient. post('product/craft', {id, amount}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

export const queryHistory = (token: string, date: string) => {
    return ApiCLient.get('historic/sells', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params:  {date}
    })
}


export {
    getItems,
    addItems, 
    deleteItemService,
    updateItemService,
    getUnits, 
    getCategories, 
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    deprecateProduct,
    sellProduct,
    buyProduct,
    wholesaleProduct,
    craftProduct,
    dispatchProduct,
    returnProduct
}