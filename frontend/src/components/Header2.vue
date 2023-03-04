<template>
    <div class=" w-full h-auto flex flex-row flex-nowrap min-h-screen relative">
        <!-- Left container-->
        <transition name="sliding">
            <div class="laptop:w-72 select-none phone:w-full bg-primary text-white flex flex-col justify-between px-4"
                v-if="barStatus">
                <div class="flex flex-col phone:relative">
                    <div class="absolute top-5 right-2 laptop:hidden"
                        :class="barStatus ? ' phone:block' : 'phone:hidden'">
                        <transition name="leftation">
                            <Icon class="cursor-pointer select-none" icon="close" v-if="barStatus"
                                @click="setSidebar(!barStatus)" />
                        </transition>
                    </div>
                    <span class="font-bold py-8">
                        {{ user.enterprise_name }}
                    </span>
                    <div class="flex flex-col">
                        <Button v-for="(menu, index) in menus" :key="index" :menu="menu" />
                    </div>
                </div>
                <div class="p-4 w-full font-bold italic flex justify-center cursor-pointer rounded hover:bg-secondary duration-150"
                    @click="logout()">
                    <Icon icon="logout" />
                    {{ user.nickname }}
                </div>
            </div>
        </transition>
        <!-- Right -> Header and Content-->
        <div class="flex flex-col w-full max-h-screen overflow-y-scroll overflow-x-hidden"
            :class="barStatus || helperStatus ? ' phone:hidden laptop:flex' : ''">
            <div class="flex sticky top-0 w-full justify-between items-center p-4 px-8 bg-primary text-white"
                style="z-index: 2;">
                <div>
                    <transition name="rotation">
                        <Icon class="cursor-pointer select-none" icon="menu" v-if="!barStatus"
                            @click="setSidebar(!barStatus)" />
                    </transition>
                    <transition name="leftation">
                        <Icon class="cursor-pointer select-none" icon="close" v-if="barStatus"
                            @click="setSidebar(!barStatus)" />
                    </transition>
                </div>
                <div class="flex flex-row px-2 text-lg">
                    <button class="px-2 py-1 flex justify-center rounded-lg 
            hover:bg-white hover:text-primary" v-if="false">
                        <Icon icon="qr_code_scanner" />
                        <span class="phone:hidden laptop:flex">{{ string.scan[language] }}</span>
                    </button>
                    <Cart v-if="showCart" @quotate="handleQuotation()"/>

                    <!-- NOTIFICATION ELEMENT -->
                    <button class="px-2 py-1 flex justify-center rounded-lg 
            hover:bg-white hover:text-primary" v-if="notifications.length > 0 && false">
                        <Icon icon="notifications" />
                        <span class="phone:hidden laptop:flex">{{ string.alerts[language] }}</span>
                    </button>
                </div>
            </div>
            <div>
                <slot name="mainContainer"></slot>
            </div>
            <Footer />
        </div>
        <transition name="resliding">
            <div class="laptop:w-2/3 h-screen z-20 absolute top-0 right-0 select-none phone:w-screen bg-white flex flex-col p-4 border-l-2 border-l-secondary"
                v-if="helperStatus" ref="helperContainer">
                <div class="flex pb-6 h-[10vh]" @click="setHelper(false)">
                    <Icon icon="keyboard_double_arrow_right" 
                    class="px-4 py-1 cursor-pointer border rounded-lg flex items-center hover:bg-primary hover:text-white duration-200" />
                </div>
                <slot name="helperContainer"></slot>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, type ComputedRef } from 'vue';
import { type Router, useRouter } from 'vue-router';
import Footer from './Footer.vue';
import { Icon, Alert } from './Generics/generics';
import Button from './sidebar/Button.vue';
import { setSidebar, sidebarStatus, setHelper } from '@/composables/sidebarStatus'
import { useShoppingCart } from '@/composables/ShoppingCart';
import language from '@/services/language';
import Cart from './Cart.vue';
import { onClickOutside } from '@vueuse/core';
import type { notificationSchema } from '@/schemas';
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/products';
import { modalComp } from '@/classes/Modal';

const auth = useAuthStore()
const pdto = useProductStore()
const router: Router = useRouter()
const shopping = useShoppingCart()
const helperContainer = ref()

onClickOutside(helperContainer, () => {
    if(!modalComp.modal.showModal){
        setHelper(false)
    }
})

const showCart = computed(() => {
    return shopping.showCart()
})

const logout = () => {
    auth.logOut()
    pdto.unsetProducts()
    router.push({
        path: '/login',
    })
}

const menus = computed(() => {
    return auth.getMenus
})
const user = computed(() => {
    return auth.getUser
})
const notifications: ComputedRef<Array<notificationSchema>> = computed(() => {
    return auth.getNotifications
})

const option = ref(false)
const barStatus = computed(() => {
    return sidebarStatus.open
})
const helperStatus = computed(() => {
    return sidebarStatus.helper
})

const handleQuotation = () => {
    console.log(router.currentRoute.value.params)
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

<style scoped>
.sliding-enter-active,
.sliding-leave-active {
    transition: width 0.4s ease;
}

.sliding-enter-from,
.sliding-leave-to {
    width: 0;
}

.resliding-enter-active,
.resliding-leave-active {
    transition: width 0.4s ease;
}

.resliding-enter-from,
.resliding-leave-to {
    width: 0;
}


.downliding-enter-active,
.downliding-leave-active {
    transition: height 0.5s ease;
}

.downliding-enter-from,
.downliding-leave-to {
    height: 0;
}

.rotation-enter-active {
    transition-delay: 0.25s;
}

.rotation-leave-active {
    transition: transform 0.25s ease;
}

.rotation-enter-from {
    opacity: 0;
}

.rotation-leave-to {
    transform: rotate(360deg);
}

.leftation-enter-active {
    transition-delay: 0.25s;
}

.leftation-leave-active {
    transition: transform 0.25s ease;
}

.leftation-enter-from {
    opacity: 0;
}

.leftation-leave-to {
    transform: rotate(-180deg);
}
</style>