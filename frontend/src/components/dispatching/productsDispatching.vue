<template>
    <div class="w-full my-1 py-2 border flex flex-row flex-wrap text-sm rounded-lg border-black shadow-lg   "
        v-for="(pdto, index) in props.pdtos" :key="index">
        <productHandlerVue :partners="partners" :pdto="pdto" :readonly="readonly"/>
    </div>
</template>

<script lang="ts" setup>
import { useShoppingCart } from '@/composables/ShoppingCart';
import type { partnerSchema, productsInCartType } from '@/schemas';
import { onBeforeMount } from 'vue';
import { Autocomplete, Button, Icon } from '../Generics/generics';
import productHandlerVue from './productHandler.vue';


export interface productsDispatchingProps {
    pdtos: productsInCartType[]
    partners: partnerSchema[]
    readonly?: boolean
}

const props = defineProps<productsDispatchingProps>()
const shopping = useShoppingCart()

onBeforeMount(() => {
    props.pdtos.map((pdto) => {
        pdto.partners = []
        return pdto
    })
})


</script>