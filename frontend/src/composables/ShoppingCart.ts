import router from '@/router'
import { computed, reactive, watch, type ComputedRef, type UnwrapNestedRefs } from 'vue'
import type { productSchema, productsInCartType, quotationSchema } from '@/schemas'

const key = 'ShoppingCartOurStock'

export interface loadedTypes{
    loaded: boolean;
    editing: boolean;
    quotation: quotationSchema | {};
}

const route: ComputedRef<string> = computed((): string => {
    return router.currentRoute.value.path
})
const productsInfo: ComputedRef<Array<productSchema>> = computed(
    (): Array<productSchema> => {
        return []
    }
)
export const loaded: UnwrapNestedRefs<loadedTypes> = reactive({
    loaded: false,
    editing: false,
    quotation: {}
})

export const productsInCart: UnwrapNestedRefs<Array<productsInCartType>> = reactive([])

watch(
    () => productsInCart,
    () => {
        if(productsInCart.length == 2 && productsInCart[0].id == productsInCart[1].id){
            productsInCart.pop()
        }
    },
    {
        deep: true
    }
)

export const useShoppingCart = () => {
    const local = window.localStorage.getItem(key)
    if(local && loaded.loaded){
        loaded.loaded = true
        const arrays: Array<productsInCartType> = JSON.parse(local)
        arrays.map(pdto => productsInCart.push(pdto))
    }

    return {
        listProducts: () => {
            return productsInCart
        },
        showCart: () => {
            return productsInCart.length > 0
            || route.value == '/dashboard/mystock'
        },
        addProduct: (el: productsInCartType) => {
            const exists = productsInCart.filter(pdto => pdto.id == el.id)
            if(exists.length > 0){
                return
            }
            productsInCart.push(el)
            useShoppingCart().updateStorage()
        },
        changeLocal: (event: any, id: number) => {
            const product: Array<productSchema> = productsInfo.value.filter(pdto => pdto.id == id)
            const max = product[0].stock
            if(max && event.target.value > max){
                productsInCart.map((pdto) => {
                    if(pdto.id == id){
                        pdto.amount == max
                    }
                })
            }
            useShoppingCart().updateStorage()
        },
        addToProduct: (id: number) => {
            productsInCart.map((pdto) => {
                if(pdto.id == id){
                    const product: Array<productSchema> = productsInfo.value.filter((pto: any) => pto.id == pdto.id)
                    if(product[0].stock > pdto.amount){
                        pdto.amount++
                    }
                }
            })
            useShoppingCart().updateStorage()
        },
        subToProduct: (id: number) => {
            productsInCart.map((pdto) => {
                if(pdto.id == id && pdto.amount > 0){
                    pdto.amount--
                }
            })
            useShoppingCart().updateStorage()
        },
        deleteProduct: (el: productsInCartType) => {
            productsInCart.splice(productsInCart.indexOf(el), 1)
            useShoppingCart().updateStorage()
        },
        clearBasket: () => {
            productsInCart.splice(0, productsInCart.length)
            useShoppingCart().updateStorage()
        },
        updateStorage: () => {
            localStorage.setItem(key, JSON.stringify(productsInCart))
        },
        setDates: (id: number, start: string, end: string) => {
            if(id == 0){
                productsInCart.map((pdto) => {
                    pdto.start_rent = start
                    pdto.end_rent = end
                })
            }else{
                productsInCart.map((pdto) => {
                    if(pdto.id == id){
                        pdto.start_rent = start
                        pdto.end_rent = end
                    }
                })
            }
        } 
    }
}
