import type { userData, modulesSchema } from '@/schemas';
import { computed } from 'vue';
import router from '@/router/index'
import type { RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export const isRenting = computed(() => {
    return useAuthStore().getUser.renting
})

export const quotate = computed(() => {
    const modules: modulesSchema[]  = useAuthStore().getMenus
    return modules.find(mod => mod.url == '/dashboard/quote')
})

export const projects = computed(() => {
    return useAuthStore().getUser.projects == 1
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
