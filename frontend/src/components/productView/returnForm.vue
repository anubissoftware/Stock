<template>
    <div class="w-full flex flex-row flex-wrap min-h-[20vh] items-start pt-3">
        <div class="phone:w-full tablet:w-1/2 p-2" v-if="!props.filterClient">
            <Autocomplete v-model="returnInfo.dispatch" :items="dispatchs" value="serial" color="black"
                placeholder="Remisión" label="Remisión" size="md" type="text" required
                @update:model-value="listDispatchs(returnInfo.dispatch as string)" />
        </div>
        <div class="phone:w-full tablet:w-1/2 p-2" v-else>
            <Autocomplete v-model="returnInfo.client" :items="clients" value="client_name" color="black"
                placeholder="Cliente" label="Cliente" size="md" type="text" required
                @update:model-value="listClients(returnInfo.client as string)" />
        </div>
        <div class="phone:w-full tablet:w-1/2 p-2 phone:py-4 tablet:py-2">
            <Input class="w-full" color="black" placeholder="Cantidad" label="cantidad" size="md" type="number"
                @update:model-value="null" v-model="returnInfo.amount" required @blur="validateMaximum()"/>
        </div>
        <div class="italic" v-if="(typeof returnInfo.dispatch == 'object') && !props.filterClient">
            La pendiente del producto por devolver es: {{ returnInfo.dispatch.dispatching - returnInfo.dispatch.returning }}
        </div>
        <div class="italic" v-else-if="(typeof returnInfo.client == 'object') && props.filterClient">
            La pendiente del producto por devolver es: {{ returnInfo.client.amount_imported }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { clientschema, dispatchScheme, token } from '@/schemas';
import { useAuthStore } from '@/stores/auth';
import { ref, type Ref, onBeforeMount, computed, watch } from 'vue';
import Autocomplete from '../Generics/Autocomplete.vue';
import Input from '../Generics/Input.vue';
import { convertSerial, formatSerial, getDispatch } from '@/services/accounting';
import { clientProducts } from '@/services/clients';

export interface dispatchInfoType {
    dispatch: any
    client?: any
    amount: number | string
}

export interface returnFormInterface {
    product: any
    filterClient?: boolean
}

const props = defineProps<returnFormInterface>()
const auth = useAuthStore()
const cancelToken: Ref<AbortController | undefined> = ref()
const dispatchs: Ref<Array<dispatchScheme>> = ref([])
const clients: Ref<Array<clientschema>> = ref([])
const returnInfo: Ref<dispatchInfoType> = ref({
    dispatch: '',
    amount: '',
    client: ''
})

watch(
    () => returnInfo,
    () => {
        const aux = returnInfo.value.dispatch.dispatching - returnInfo.value.dispatch.returning
        if(aux <= returnInfo.value.amount){
            returnInfo.value.amount = aux
        }
    },
    {deep: true}
)

const canSave = computed(() => {
    const aux = returnInfo.value.dispatch.dispatching - returnInfo.value.dispatch.returning
    return (
        typeof returnInfo.value.dispatch == 'object' || 
        typeof returnInfo.value.client == 'object'
    ) &&
        returnInfo.value.amount > 0 &&
        (returnInfo.value.amount <= aux || returnInfo.value.amount <= returnInfo.value.client?.amount_rented)
    
})

defineExpose({ returnInfo, canSave })

const listClients = async (value: string) => {
    if(cancelToken.value != undefined) cancelToken.value.abort()

    cancelToken.value = new AbortController()
    let filter: any = {
        limit: 100,
        'p.id': props.product.id,
        'cp.amount>': 0
    }
    let {data} = await clientProducts((auth.getUser.token as token).value, {'c.name': value, ...filter}, cancelToken.value.signal)
    clients.value = data
    if(!data) clients.value = []
    cancelToken.value = undefined
}

const listDispatchs = async (value: string) => {

    if (cancelToken.value != undefined) {
        cancelToken.value.abort()
    }

    cancelToken.value = new AbortController();
    let filters: any = {
        limit: 100,
        'dd.item_id': props.product.id,
        '!qd.dispatching': 'qd.returning'
    }

    let { data } = await getDispatch((auth.getUser.token as token).value, { 'd.id': convertSerial(value) == 0 ? '' : convertSerial(value), ...filters }, cancelToken.value.signal)
    if (!data) dispatchs.value = []
    cancelToken.value = undefined
    dispatchs.value = data.map((dis: any) => {
        dis.serial = formatSerial(dis.id) + ' - ' + dis.name
        return dis
    })
    console.log(dispatchs)
}

onBeforeMount(() => {
    if(props.filterClient){
        listClients('')
    }else{
        listDispatchs('')
    }
})

const validateMaximum = () => {
    console.log('validating')
    // if(returnInfo.value.amount > (returnInfo.dispatch.dispatching - returnInfo.dispatch.returning) ){
    //     returnInfo.value.amount = returnInfo.dispatch.dispatching - returnInfo.dispatch.returning 
    // }
}
</script>

<style>

</style>