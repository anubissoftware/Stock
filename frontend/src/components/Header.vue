<template>
    <div
        class="flex sticky top-0 w-full tablet:justify-between phone:justify-end items-center p-4 px-8 bg-primary text-white"
        style="z-index: 2;"
        >
        <img class=" phone:hidden tablet:block w-32 max-w-md cursor-pointer"
            :src="''" alt="" @click="goPath('/dashboard')">

        <div class="flex flex-row px-2 text-lg">

            <!-- SCAN PRODUCT CODES -->
            <button class="px-2 py-1 flex justify-center rounded-lg 
            hover:bg-white hover:text-primary" v-if="false">
                <Icon icon="qr_code_scanner" />
                <span class="phone:hidden tablet:flex">{{string.scan[language]}}</span>
            </button>

            <Cart v-if="shopping.showCart()" />

            <!-- NOTIFICATION ELEMENT -->
            <button class="px-2 py-1 flex justify-center rounded-lg 
            hover:bg-white hover:text-primary" v-if="false">
                <Icon icon="notifications" />
                <span class="phone:hidden tablet:flex">{{string.alerts[language]}}</span>
            </button>

            <MenuDropdown class="text-white hover:bg-white hover:text-primary rounded-lg" icon="expand_more"
                :content="user.nickname">
                <div class="w-full px-2 flex gap-2 justify-start py-1 cursor-pointer text-black 
              hover:bg-gray-100 rounded-t-lg" @click="goPath('/dashboard')">
                    <Icon icon="home"/>
                    Home
                </div>
                <div>
                    <div class="w-full px-2 flex gap-2 py-1 cursor-pointer justify-start  text-black
              hover:bg-gray-100" @click="goPath('/dashboard/mystock')">
                        <Icon icon="inventory" />
                        <span class=" phone:px-5 tablet:px-0"> {{string.mystock[language]}} </span>
                    </div>
                    <div class="w-full px-2 flex gap-2 py-1 cursor-pointer justify-start  text-black
              hover:bg-gray-100" @click="goPath('/dashboard/')">
                        <Icon icon="query_stats" />
                        <span class=" phone:px-5 tablet:px-0"> {{string.statics[language]}} </span>
                    </div>
                    <div class="w-full px-2 flex gap-2 py-1 cursor-pointer justify-start  text-black
              hover:bg-gray-100" @click="goPath('/dashboard/mystore')">
                        <Icon icon="query_stats" />
                        <span class=" phone:px-5 tablet:px-0"> {{string.mystore[language]}} </span>
                    </div>
                    <div class="w-full px-2 flex gap-2 py-1 cursor-pointer justify-start text-black
              hover:bg-gray-100" @click="goPath('/dashboard/config')">
                        <Icon icon="settings" />
                        <span class=" phone:px-5 tablet:px-0"> {{string.config[language]}} </span>
                    </div>
                </div>
                <div class="w-full px-2 flex gap-2 justify-start py-1 cursor-pointer border-t text-extra
              hover:bg-extra hover:text-white rounded duration-200" @click="logout()">
                    <Icon icon="logout" />
                    <span class=" phone:px-5 tablet:px-0"> {{string.logout[language]}} </span>
                </div>
            </MenuDropdown>
        </div>
        
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { MenuDropdown, Icon } from '@/components/Generics/generics'
import { useRouter, type Router } from 'vue-router'
import Cart from './Cart.vue';
import { useShoppingCart } from '@/composables/ShoppingCart';
import language from '@/services/language';
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/products';

const shopping = useShoppingCart()
const auth = useAuthStore()
const pdtos = useProductStore()
const user = computed(() => {
    return auth.getUser
})
const router: Router = useRouter()

const logout = () => {
    auth.logOut()
    pdtos.unsetProducts()
    router.push({
        path: '/login'
    })
}

const goPath = (path: string): void => {
    router.replace({
        path
    })
}


/**
 * Dejar siempre al final [*LANGUAGE*]
*/
const string = {
    alerts: {
        Spanish: 'Alertas',
        English: 'Alerts'
    },
    mystock: {
        Spanish: 'Mi inventario',
        English: 'My Stock'
    },
    statics: {
        Spanish: 'Estadística',
        English: 'Statistics'
    },
    mystore: {
        Spanish: 'Mi Tienda',
        English: 'My Store'
    },
    config: {
        Spanish: 'Configuración',
        English: 'Configuration'
    },
    logout: {
        Spanish: 'Cerrar Sesión',
        English: 'Logout'
    },
    scan: {
        Spanish: 'Scanear',
        English: 'Scan'
    }
}

</script>