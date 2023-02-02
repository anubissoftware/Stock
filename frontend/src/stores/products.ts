import type { historicTransactions } from '@/schemas';
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import type { categorySchema, productSchema } from '@/schemas'
import moment from 'moment';
import { getCategories, getItems, queryHistory } from '@/services/product';

interface soldProductType {
    products: {
        id: number,
        amount: number
    }[],
    wholesale: boolean
}
export interface rentProductType {
    products: {
        item_id: number,
        amnt: number
    }[],
}
type historicFilters = {
    startDate: string,
    endDate: string
}
type historicQuery = {
    token: string,
    filtros: historicFilters | string
}

interface getProductsPayload {
    userToken: string,
    filter: any
}

interface mutateStock {
    id: number,
    amount: number
}

interface craftedStock {
    dec: Array<mutateStock>,
    inc: mutateStock
}

interface productEdited {
    id: number,
    amount: number
}

export const useProductStore = defineStore('products', () => {

    const products: Ref<Array<productSchema>> = ref([])
    const historic: Ref<Array<historicTransactions>> = ref([])
    const categories: Ref<Array<categorySchema>> = ref([])

    const listProducts: ComputedRef<Array<productSchema>> = computed(() => {
        return products.value
    })
    const listHistoric: ComputedRef<Array<historicTransactions>> = computed(() => {
        return historic.value
    })
    const listCategories: ComputedRef<Array<categorySchema>> = computed(() => {
        return categories.value
    })

    const unsetProducts = () => {
        products.value = []
        historic.value = []
        categories.value = []
    }
    const setProducts = (pdtos: Array<productSchema>) => {
        products.value = pdtos
    }
    const setHistoric = (hist: Array<historicTransactions>) => {
        historic.value = hist
    }
    const setCategories = (cat: Array<categorySchema>) => {
        categories.value = cat
    }
    const addCategories = (category: categorySchema) => {
        categories.value.unshift(category)
    }
    const editCategory = (category: categorySchema) => {
        categories.value = categories.value.map((cat) => {
            if (cat.id == category.id) {
                cat = category
            }
            return cat
        })
    }
    const deleteCategory = (id: number) => {
        categories.value = categories.value.filter(cat => cat.id != id)
    }
    const removeProduct = (id: number) => {
        products.value = products.value.filter(pdto => pdto.id != id)
    }
    const addProduct = (pdto: productSchema) => {
        pdto.onBuying = (pdto.cost * pdto.stock)
        pdto.onLosses = 0
        pdto.onSales = 0
        pdto.sold = 0
        pdto.rented = 0
        pdto.onRenting = 0
        pdto.toCraft = 0
        pdto.expired = 0
        products.value.unshift(pdto)
    }
    const updateProduct = (updated: productSchema) => {
        products.value = products.value.map(item => {
            if (item.id == updated.id) {
                item = updated
            }
            return item
        })
    }
    const rentProduct = (body: rentProductType) => {
        products.value = products.value.map(item => {
            const changed = body.products.filter(pdto => pdto.item_id == item.id)
            if(changed.length > 0){
                item.stock -= changed[0].amnt
                item.rented += changed[0].amnt
            }
            return item
        })
    }
    const soldProduct = (body: soldProductType) => {
        let total = 0
        products.value = products.value.map(item => {
            const changed = body.products.filter(pdto => pdto.id == item.id)
            if (changed.length > 0) {
                item.stock -= changed[0].amount
                item.sold += changed[0].amount
                if (body.wholesale) {
                    item.onSales += (item.wholesale * changed[0].amount)
                    total += (item.wholesale * changed[0].amount)
                } else {
                    item.onSales += (item.price * changed[0].amount)
                    total += (item.price * changed[0].amount)
                }
            }
            return item
        })
        if (historic.value.length == 0) {
            historic.value = []
            historic.value.push({
                date: moment().format('YYYY-MM-DD'),
                sells: total,
                boughts: 0,
                losses: 0
            })
        } else {
            let found = false
            historic.value.map((item) => {
                if (moment(item.date).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
                    item.sells += total
                    found = true
                }
                return item
            })
            if (!found) {
                historic.value.push({
                    date: moment().format('YYYY-MM-DD'),
                    sells: total,
                    boughts: 0,
                    losses: 0
                })
            }
        }
    }
    const boughtProducts = (body: productEdited) => {
        let total = 0
        products.value.map((item) => {
            if (item.id == body.id) {
                item.stock += body.amount
                item.onBuying += (item.cost * body.amount)
                total += item.onBuying
            }
        })
        if (historic.value.length == 0) {
            historic.value = []
            historic.value.push({
                date: moment().format('YYYY-MM-DD'),
                sells: 0,
                boughts: total,
                losses: 0
            })
        } else {
            historic.value.map((item) => {
                if (moment(item.date).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
                    item.boughts += total
                }
                return item
            })
        }
    }
    const expiredProduct = (body: productEdited) => {
        let total = 0
        products.value.map((item) => {
            if (item.id == body.id) {
                item.stock -= body.amount
                item.expired += body.amount
                item.onLosses += (body.amount * item.cost)
                total += item.onLosses
            }
        })
        if (historic.value.length == 0) {
            historic.value = []
            historic.value.push({
                date: moment().format('YYYY-MM-DD'),
                sells: 0,
                boughts: 0,
                losses: total
            })
        } else {
            historic.value.map((item) => {
                if (moment(item.date).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
                    item.losses += total
                }
                return item
            })
        }
    }
    const craftedProduct = (body: craftedStock) => {
        products.value.map((item) => {
            const dec: Array<mutateStock> = body.dec.filter(pdto => pdto.id == item.id)
            if (dec.length > 0) {
                item.stock -= dec[0].amount
                item.toCraft += dec[0].amount
            } else if (item.id == body.inc.id) {
                item.stock += body.inc.amount
            }
            return item
        })
    }

    const getProducts = (body: getProductsPayload) => {
        getItems(body.userToken).then(res => {
            setProducts(res.data)
        })
    }
    const getHistoric = (body: historicQuery) => {
        queryHistory(body.token, moment().subtract(10, 'd').format('YYYY-MM-DD')).then(r => {
            setHistoric(r.data)
        })
    }
    const loadCategories = (body: historicQuery) => {
        getCategories(body.token).then(r => {
            setCategories(r.data)
        })
    }

    return {
        listProducts, listHistoric, listCategories, unsetProducts, setProducts, setHistoric,
        setCategories, addCategories, editCategory, deleteCategory, removeProduct, addProduct,
        updateProduct, soldProduct, boughtProducts, expiredProduct, craftedProduct, getProducts,
        getHistoric, loadCategories, rentProduct
    }
})
