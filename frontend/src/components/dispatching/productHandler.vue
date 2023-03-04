<template>
    <div class="flex flex-row items-center justify-between py-2 phone:w-full laptop:w-1/2 text-left italicx pl-5">
        <div class="flex flex-col justify-start items-start">
            <span class="font-bold">{{ props.pdto.name }} {{ props.pdto.sigla ? ` > (Socio ${props.pdto.sigla})` : '' }}
            </span>
            <span class="text-xs" v-if="props.pdto.amount_avaliable">{{ 'Amount:' + props.pdto.amount_avaliable }}</span>
            <span class="text-xs" v-if="props.pdto.dispatching">{{ 'Dispatching:' + props.pdto.dispatching }}</span>

        </div>
        <Button exactColor color="primary" size="xs" class="mr-2" icon="add"
            @click="props.pdto.partners?.push({ partner_id: 0, amount: 0, sigla: '' })" v-if="!props.readonly" />
    </div>
    <div class="phone:w-full laptop:w-1/2 flex flex-wrap px-3">
        <div class="w-full flex  p-1 flex-wrap" :class="[props.readonly ? ['justify-end'] : []]">
            <span class="w-1/2 italic" v-if="!props.readonly">
                propio:
            </span>
            <span class="flex justify-center w-1/2">
                <div class="flex flex-row items-center">
                    <span v-if="!props.readonly"
                        class=" h-6 flex justify-center items-center w-6 text-base cursor-pointer select-none font-bold bg-primary text-white rounded-l-lg opacity-70 hover:opacity-100"
                        :class="[alert || selfAler ? ['!bg-red-600 border'] : []]" @click="props.pdto.amount++; validateAmount(true)">
                        + </span>
                    <input type="number" v-model="props.pdto.amount" :disabled="props.readonly"
                        class=" w-10 h-6 outline-primary border-primary border text-center duration-200"
                        :class="[alert || selfAler ? ['!border-red-600 border'] : []]"
                        @change="shopping.changeLocal($event, props.pdto.id)" @blur="validateAmount(true)">
                    <span v-if="!props.readonly"
                        class=" h-6 flex justify-center items-center w-6 text-base cursor-pointer select-none font-bold bg-primary text-white rounded-r-lg opacity-70 hover:opacity-100"
                        :class="[alert || selfAler ? ['!bg-red-600 border'] : []]"
                        @click="props.pdto.amount != 0 ? props.pdto.amount-- : null; validateAmount(true)">
                        - </span>
                </div>
            </span>
            <span v-if="selfAler" class="w-full flex justify-center text-red-600 italic">
                La cantidad de items supera el límite en stock.
            </span>
        </div>
        <div class="w-full flex p-1" v-for="(partner, index) in props.pdto.partners" :key="index">
            <span class="w-1/2 italic">
                <Autocomplete class="w-full" placeholder="Socio..." label="" size="sm" v-model="partner.sigla"
                    :items="props.partners" value="sigla" color="black" type="text" @update:model-value="() => {
                        if (typeof partner.sigla == 'object') {
                            partner.partner_id = partner.sigla.id
                        }
                    }" />
            </span>
            <div class="relative w-1/2 flex justify-center items-center">
                <div class="flex flex-row items-center">
                    <span v-if="!props.readonly"
                        class=" h-6 flex justify-center items-center w-6 text-base cursor-pointer select-none font-bold bg-primary text-white rounded-l-lg opacity-70 hover:opacity-100"
                        :class="[alert ? ['!bg-red-600 border'] : []]" @click="partner.amount++; validateAmount()">
                        + </span>
                    <input type="number" v-model="partner.amount" :disabled="props.readonly"
                        class=" w-10 h-6 outline-primary border-primary border text-center duration-200"
                        :class="[alert ? ['!border-red-600 border'] : []]" @blur="validateAmount()">
                    <span v-if="!props.readonly"
                        class=" h-6 flex justify-center items-center w-6 text-base cursor-pointer select-none font-bold bg-primary text-white rounded-r-lg opacity-70 hover:opacity-100"
                        :class="[alert ? ['!bg-red-600 border'] : []]"
                        @click="partner.amount != 0 ? partner.amount-- : null; validateAmount()">
                        - </span>
                </div>
                <Icon class=" cursor-pointer absolute right-0 text-md" icon="delete" v-if="!props.readonly"
                    @click="props.pdto.partners?.splice(index, 1)" />
            </div>
        </div>
    </div>
    <div v-if="(props.pdto.amount_avaliable ?? 0) - (props.pdto.dispatching ?? 0) == 0 && (props.pdto.amount_avaliable ?? 0) != 0"
        class="w-full flex flex-col py-1 text-xs text-green-700">
        Producto totalmente entregado
    </div>
</template>

<script lang="ts" setup>
import { useShoppingCart } from '@/composables/ShoppingCart';
import type { partnerSchema, productsInCartType } from '@/schemas';
import { useProductStore } from '@/stores/products';
import { ref, type Ref, watch } from 'vue';
import { Autocomplete, Button, Icon } from '../Generics/generics';

export interface productDispatchingHandlerProps {
    pdto: productsInCartType
    readonly?: boolean
    partners: partnerSchema[]
}

const pdtos = useProductStore()
const alert: Ref<boolean> = ref(false)
const selfAler: Ref<boolean> = ref(false)
const props = defineProps<productDispatchingHandlerProps>()
const shopping = useShoppingCart()

const validateAmount = (self = false) => {
    if(props.readonly) return
    if (!props.pdto.amount_avaliable) {
        if (self) {
            const sum = props.pdto.amount
            const pdto = pdtos.listProducts.find(pdto => pdto.id == props.pdto.id)
            const max = pdto?.stock ?? 0

            if (sum > max) {
                selfAler.value = true
            } else {
                selfAler.value = false
            }
        }

    } else {
        let aux = 0
        props.pdto.partners?.forEach((pdto) => {
            aux += pdto.amount
        })
        const sum = props.pdto.amount + aux + (props.pdto.dispatching ?? 0)
        const max = props.pdto.amount_avaliable ?? 0

        const pdto = pdtos.listProducts.find(pdto => pdto.id == props.pdto.id)
        const maxStock = pdto?.stock ?? 0

        if (sum > max) {
            alert.value = true
        } else if(sum > maxStock) {
            selfAler.value = true
        } else {
            alert.value = false
            selfAler.value = false
        }
    }
}

watch(
    () => pdtos.listProducts,
    () => {
        console.log('changed')
        validateAmount(true)
    },
    {
        deep: true,
        immediate: true
    }
)


</script>