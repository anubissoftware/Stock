import { sidebarStatus } from './../composables/sidebarStatus';
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import type { clientEnterpriseSchema, modulesSchema, notificationSchema, userSchema } from '@/schemas'
import socket from '@/composables/socket'
import { setHelper } from '@/composables/sidebarStatus'
import { useShoppingCart } from '@/composables/ShoppingCart';

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated: Ref<boolean> = ref(false)
    const user: Ref<userSchema | JSON | {}> = ref({})
    const modules: Ref<Array<modulesSchema>> = ref([])
    const clients: Ref<Array<clientEnterpriseSchema>> = ref([])
    const notifications: Ref<Array<notificationSchema>> = ref([])

    const getAuthentication: ComputedRef<boolean> = computed((): boolean => {
        return isAuthenticated.value
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
        isAuthenticated.value = true
        localStorage.setItem('user', JSON.stringify(user.value))
    }

    const logOut = (): void => {
        user.value = {}
        isAuthenticated.value = false
        modules.value = []
        socket.socket?.disconnect()
        socket.socket = null
        localStorage.removeItem('user')
        localStorage.removeItem('modules')
        setHelper(false)
        sidebarStatus.createQuotation = false
        useShoppingCart().clearBasket()
    }

    const setModules = (moduls: Array<modulesSchema>) => {
        modules.value = moduls
        localStorage.setItem('modules', JSON.stringify(modules.value))
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
        setUser, logOut, setModules, setClients, addClient, removeClient, pushNotification, modules
    }
})
