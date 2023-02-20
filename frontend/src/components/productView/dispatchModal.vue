<template>
    <div class="w-full flex flex-row flex-wrap">
        <div class="phone:w-full">
            <CheckBox color="black" disabled :content="'Añadir a un ID de proceso antiguo'"
                :label="'Añadir a un ID de proceso'" required v-model="dispatchingInfo.old_process" />
        </div>

        <div class="phone:w-full laptop:w-1/2 pt-4">
            <Autocomplete class="w-full" placeholder="Clientes" label="Clientes" size="md" v-model="dispatchingInfo.client"
                :items="clientes" value="name" color="black" type="text" required @update:model-value="null" />
        </div>

        <!-- El de aquí es para los proyectos -->
        <div class="phone:w-full laptop:w-1/2">

        </div>

        <div class="w-full pr-2 pb-4 border-t-2 mt-4 pt-2">
            <span class="text-xl font-bold">
                Información de los productos
            </span>
            <br>
            <span class="text-xs">Presiona + para añadir productos de socios</span>
        </div>

        <div class="w-full my-1 py-2 border flex flex-row flex-wrap text-sm rounded-lg border-black shadow-lg   "
            v-for="(pdto, index) in pdtos" :key="index">
            <div class="flex flex-row items-center justify-between py-2 phone:w-full laptop:w-1/2 text-left italic font-bold pl-5">
                <span>{{ pdto.name }}</span>
                <Button exactColor color="primary" size="xs" class="mr-2" icon="add"
                    @click="pdto.partners?.push({ partner_id: 0, amount: 0, sigla: '' })" />
            </div>
            <div class="phone:w-full laptop:w-1/2 flex flex-wrap px-3">
                <div class="w-full flex  p-1">
                    <span class="w-1/2 italic">
                        propio:
                    </span>
                    <span class="flex justify-center w-1/2">
                        <div class="flex flex-row items-center">
                            <span class=" h-6 flex justify-center items-center w-6 text-base cursor-pointer select-none font-bold bg-primary text-white rounded-l-lg opacity-70 hover:opacity-100"
                                @click="pdto.amount++">
                                + </span>
                            <input type="number" v-model="pdto.amount"
                            class=" w-10 h-6 outline-primary border-primary border text-center"
                            @change="shopping.changeLocal($event, pdto.id)">
                            <span class=" h-6 flex justify-center items-center w-6 text-base cursor-pointer select-none font-bold bg-primary text-white rounded-r-lg opacity-70 hover:opacity-100"
                                @click="pdto.amount != 0 ? pdto.amount-- : null">
                                - </span>
                        </div>
                    </span>
                </div>
                <div class="w-full flex p-1" v-for="(partner, index) in pdto.partners" :key="index">
                    <span class="w-1/2 italic">
                        <Autocomplete class="w-full" placeholder="Socio.." label="" size="sm" v-model="partner.sigla"
                            :items="partners" value="sigla" color="black" type="text" @update:model-value="() => {
                                if(typeof partner.sigla == 'object'){
                                    partner.partner_id = partner.sigla.id
                                }
                            }"  />
                    </span>
                    <div class="relative w-1/2 flex justify-center items-center">
                        <div class="flex flex-row items-center">
                            <span class=" h-6 flex justify-center items-center w-6 text-base cursor-pointer select-none font-bold bg-primary text-white rounded-l-lg opacity-70 hover:opacity-100"
                                @click="partner.amount++">
                                + </span>
                            <input type="number" v-model="partner.amount"
                            class=" w-10 h-6 outline-primary border-primary border text-center">
                            <span class=" h-6 flex justify-center items-center w-6 text-base cursor-pointer select-none font-bold bg-primary text-white rounded-r-lg opacity-70 hover:opacity-100"
                                @click="partner.amount != 0 ? partner.amount-- : null">
                                - </span>
                        </div>
                        <Icon class=" cursor-pointer absolute right-0 text-md" icon="delete" @click="pdto.partners.splice(index,1)" />
                    </div>
                </div>
            </div>
        </div>

        <span class="py-2 text-md italic text-center">
            Verifica que las cantidades correspondan a lo que se remitirá.
        </span>

    </div>
</template>

<script lang="ts" setup>
import { useShoppingCart } from '@/composables/ShoppingCart';
import type { clientschema, token, productsInCartType, partnerSchema } from '@/schemas';
import { getClients } from '@/services/clients';
import { useAuthStore } from '@/stores/auth';
import { ref, type Ref, onMounted,computed, type ComputedRef } from 'vue';
import { getPartners } from '@/services/partners'
import Button from '../Generics/Button.vue';
import { Autocomplete, CheckBox, Icon } from '../Generics/generics';

const auth = useAuthStore()
const dispatchingInfo = ref({
    old_process: false,
    client: ''
})

const shopping = useShoppingCart()
const pdtos: Ref<productsInCartType[]> = ref([])
const partners: Ref<partnerSchema[]> = ref([])
const clientes: Ref<Array<clientschema>> = ref([])

const canSave: ComputedRef<boolean> = computed(() => {

    return typeof dispatchingInfo.value.old_process == 'object'
})

defineExpose({ dispatchingInfo, pdtos, canSave })

const cancelToken: Ref<undefined | AbortController> = ref(undefined)

const listClients = async (value: string) => {
    if (typeof value == 'object') return
    if (cancelToken.value) {
        cancelToken.value.abort()
    }
    cancelToken.value = new AbortController()
    const token = auth.getUser.token as token
    let { data } = await getClients(
        token.value,
        { 'c.name': value, limit: 30 },
        cancelToken.value.signal
    )
    if (data && data.length) {
        clientes.value = data
        cancelToken.value = undefined
    } else {
        clientes.value = []
    }
}

const listPartners = async () => {
    let { data } = await getPartners((auth.getUser.token as token).value, { 'p.name': '' }, new AbortController().signal)
    console.log('partners', data)
    partners.value = data
}


onMounted(() => {
    listClients('')
    listPartners()
    pdtos.value = shopping.listProducts().map((pdto) => {
        pdto.partners = []
        return pdto
    })
})

</script>

<style scoped>
input[type=number] {
    -moz-appearance: textfield;
}
</style>