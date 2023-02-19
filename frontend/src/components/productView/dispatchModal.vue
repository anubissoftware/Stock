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
        </div>

        <div class="w-full my-1 py-2 border flex flex-row flex-wrap text-sm rounded-lg border-primary"
            v-for="(pdto, index) in pdtos" :key="index">
            <div class="phone:w-full laptop:w-1/2 text-left italic font-bold pl-5">
                {{ pdto.name }}
            </div>
            <div class="phone:w-full laptop:w-1/2 flex flex-wrap px-3">
                <div class="w-full flex border p-1">
                    <span class="w-1/2 border-r italic">
                        propio:
                    </span>
                    <span class="w-1/2">
                        <input type="number" v-model="pdto.amount"
                            class=" w-20 outline-primary border-primary border rounded text-center"
                            @change="shopping.changeLocal($event, pdto.id)">
                    </span>
                </div>
                <div class="w-full flex border p-1" v-for="(partner, index) in pdto.partners" :key="index">
                    <span class="w-1/2 border-r italic">
                        <Autocomplete class="w-full" placeholder="" label="" size="sm" v-model="partner.sigla"
                            :items="partners" value="sigla" color="black" type="text" @update:model-value="() => {
                                if(typeof partner.sigla == 'object'){
                                    partner.partner_id = partner.sigla.id
                                }
                            }"  />
                    </span>
                    <div class="w-1/2 flex justify-center items-center relative">
                        <input type="number" v-model="partner.amount"
                            class=" w-20 outline-primary border-primary border rounded text-center">

                        <div class="absolute right-0 hover:cursor-pointer duration-200 hover:scale-125" >
                            <Icon icon="close" />
                        </div>
                    </div>
                </div>
                <div class="w-full flex justify-center italic pt-2">
                    <Button exactColor color="secondary" size="sm" class="mr-2" icon="add"
                        content="Añadir productos de socio"
                        @click="pdto.partners?.push({ partner_id: 0, amount: 0, sigla: '' })" />
                </div>
            </div>
        </div>

        <span class="italic text-left">
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