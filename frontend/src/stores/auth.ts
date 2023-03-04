import { sidebarStatus } from './../composables/sidebarStatus';
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import type { clientEnterpriseSchema, modulesSchema, notificationSchema, userSchema, clientsTags } from '@/schemas'
import socket from '@/composables/socket'
import { setHelper } from '@/composables/sidebarStatus'
import { useShoppingCart } from '@/composables/ShoppingCart';
import type { allPlugins, basicProductTransactions, enterpriseModel, macroOperations } from '@/schemas/model';

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated: Ref<boolean> = ref(false)
    const user: Ref<userSchema | JSON | {}> = ref({})
    const modules: Ref<Array<modulesSchema>> = ref([])
    const colors: Ref<any> = ref([])
    const clients: Ref<Array<clientEnterpriseSchema>> = ref([])
    const clientsTags: Ref<clientsTags[]> = ref([])
    const notifications: Ref<Array<notificationSchema>> = ref([])

    const getAuthentication: ComputedRef<boolean> = computed((): boolean => {
        return isAuthenticated.value
    })

    const getModel: ComputedRef<Array<enterpriseModel>> = computed((): Array<enterpriseModel> => {
        if(Object.keys(user.value).length == 0 ) return []
        return JSON.parse((user.value as userSchema).models as string)
    })

    const getMacros: ComputedRef<Array<macroOperations>> = computed((): Array<macroOperations> => {
        if(Object.keys(user.value).length == 0 ) return []
        return JSON.parse((user.value as userSchema).macros as string)
    })

    const getPlugins: ComputedRef<Array<allPlugins>> = computed((): Array<allPlugins> => {
        if(Object.keys(user.value).length == 0 ) return []
        return JSON.parse((user.value as userSchema).plugins as string)
    })

    const getTransactions: ComputedRef<Array<basicProductTransactions>> = computed((): Array<basicProductTransactions> => {
        if(Object.keys(user.value).length == 0 ) return []
        return JSON.parse((user.value as userSchema).transactions as string)
    })

    const getUser: ComputedRef<userSchema> = computed((): userSchema => {
        return user.value as userSchema
    })

    const getMenus: ComputedRef<Array<modulesSchema>> = computed((): Array<modulesSchema> => {
        return modules.value
    })

    const getClients: ComputedRef<Array<clientEnterpriseSchema>> = computed((): Array<clientEnterpriseSchema> => {
        return clients.value
    })

    const getNotifications: ComputedRef<Array<notificationSchema>> = computed((): Array<notificationSchema> => {
        return notifications.value
    })

    const setUser = (userLogged: JSON): void => {
        user.value = userLogged
        console.log('user', userLogged)
        isAuthenticated.value = true
        localStorage.setItem('user', JSON.stringify(user.value))
    }

    const logOut = (): void => {
        user.value = {}
        isAuthenticated.value = false
        modules.value = []
        colors.value = []
        socket.socket?.disconnect()
        socket.socket = null
        localStorage.removeItem('user')
        localStorage.removeItem('modules')
        //Colors
        localStorage.removeItem('colors')
        const root = document.querySelector(':root') as HTMLStyleElement
        root.style.setProperty('--primary', '#A64AEE') 
        root.style.setProperty('--secondary', '#F69A36') 
        root.style.setProperty('--third', '#3D256A') 

        setHelper(false)
        sidebarStatus.createQuotation = false
        useShoppingCart().clearBasket()
    }

    const setModules = (moduls: Array<modulesSchema>) => {
        modules.value = moduls
        localStorage.setItem('modules', JSON.stringify(modules.value))
    }

    const setColors = (colorArray: any) => {
        colors.value = colorArray ?? []
        localStorage.setItem('colors', JSON.stringify(colors.value))
        const root = document.querySelector(':root') as HTMLStyleElement
        

        colors.value[0] ? 
            root.style.setProperty('--primary', colors.value[0].value) :
            root.style.setProperty('--primary', '#A64AEE') 
        colors.value[1] ? 
            root.style.setProperty('--secondary', colors.value[1].value) :
            root.style.setProperty('--secondary', '#F69A36') 
            
        colors.value[2] ? 
            root.style.setProperty('--third', colors.value[2].value) :
            root.style.setProperty('--third', '#3D256A') 
    }

    const setClients = (client: Array<clientEnterpriseSchema>) => {
        clients.value = client
    }

    const addClient = (client: clientEnterpriseSchema) => {
        const exists = clients.value.filter(cli => cli.id == client.id)
        if (exists.length > 0) {
            clients.value = clients.value.map(cli => {
                if (cli.id == client.id) {
                    cli = client
                    cli.rut.info += '?' + Math.floor(Math.random() * 1000)
                }
                return cli
            })
        } else {
            clients.value.unshift(client)
        }
    }

    const removeClient = (data: { id: number }) => {
        clients.value = clients.value.filter(client => client.id != data.id)
    }

    const pushNotification = (data: notificationSchema) => {
        notifications.value.unshift(data)
    }

    return {
        getAuthentication, getUser, getMenus, getClients, getNotifications,
        getMacros, getModel, getPlugins, getTransactions, clientsTags,
        setUser, logOut, setModules, setColors, setClients, addClient, removeClient, pushNotification, modules
    }
})
