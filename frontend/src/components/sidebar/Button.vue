<template>
    <div class="flex flex-row flex-wrap cursor-pointer hover:bg-secondary duration-150 py-3 rounded"
        @click="goPath(props.menu.url)">
        <div class="flex w-1/4">
            <Icon :icon="props.menu.icon" class="w-full h-auto" />
        </div>
        <div class="flex w-3/4 font-bold">
            {{ props.menu.name }}
        </div>
        <transition name="downliding">
            <div class="flex flex-col cursor-pointer pb-2 overflow-hidden" v-if="false">
                <div class="flex flex-row flex-wrap cursor-pointer hover:bg-secondary duration-150 py-2 rounded pl-5">
                    <div class="flex w-1/4">
                        <Icon icon="home" class="w-full h-auto" />
                    </div>
                    <div class="flex w-3/4 font-bold">
                        Home
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import type { modulesSchema } from '@/schemas'
import { defineProps } from 'vue'
import { Icon } from '../Generics/generics';
import { useRouter } from 'vue-router';
import { isTablet, setSidebar } from '@/composables/sidebarStatus';
import { useShoppingCart } from '@/composables/ShoppingCart';

export interface SidebarButtonProps {
    menu: modulesSchema
}
const shopping = useShoppingCart()
const router = useRouter()
const props = defineProps<SidebarButtonProps>()
const goPath = (path: string): void => {
    if(isTablet.value){
        setSidebar(false)
    }

    if(router.currentRoute.value.query.id){
        shopping.clearBasket()
    }

    router.replace({
        path
    })
}

</script>

<style>

</style>

