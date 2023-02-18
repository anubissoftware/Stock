import type { userData, modulesSchema, basicProductTransactionPermissions, 
macroOperationsPermissions } from '@/schemas';
import { computed } from 'vue';
import router from '@/router/index'
import type { RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export const isRenting = computed(() => {
    return useAuthStore().getModel.includes('rent')
})

export const canShoppingCart = computed(() => {
    return useAuthStore().getPlugins.includes('cart')
})

export const productTransactions = computed((): basicProductTransactionPermissions => {
    const trans = useAuthStore().getTransactions
    return {
        sale: trans.includes('sale'),
        bought: trans.includes('bought'),
        whole: trans.includes('whole'),
        dispatch: trans.includes('dispatch'), 
        return: trans.includes('return'),
        expire: trans.includes('expire')
    }
})

export const macros = computed((): macroOperationsPermissions => {
    const macros = useAuthStore().getMacros
    return {
        quote: macros.includes('quote'),
        dispatch: macros.includes('dispatch'), 
        return: macros.includes('return'), 
        report: macros.includes('report'),
        invoice: macros.includes('invoice'),
        settlement: macros.includes('settlement')
    }
})

export const projects = computed(() => {
    return useAuthStore().getPlugins.includes("proj")
})

export const writePer = computed(() => {
    const route = router.currentRoute.value.path
    const modules: Array<modulesSchema> = useAuthStore().getMenus
    const filtering = modules.filter((module) => module.url == route)
    return filtering[0]?.write
})

export const readPer = (to: RouteLocationNormalized) => {
    const route = to.path
    const modules: Array<modulesSchema> = useAuthStore().getMenus
    const filtering = modules.filter((module) => module.url == route)
    return filtering[0]?.read
}

export const editPer = computed(() => {
    const route = router.currentRoute.value.path
    const modules: Array<modulesSchema> = useAuthStore().getMenus
    const filtering = modules.filter((module) => module.url == route)
    return filtering[0]?.edit
})
