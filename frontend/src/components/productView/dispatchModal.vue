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

        <productsDispatchingVue :pdtos="pdtos" :partners="partners"  />

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
import productsDispatchingVue from '../dispatching/productsDispatching.vue';

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