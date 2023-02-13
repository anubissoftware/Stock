<template>
    <div class="w-full flex flex-row flex-wrap min-h-[20vh] items-start">
        <div class="phone:w-full tablet:w-1/2 p-2">
            <Autocomplete v-model="returnInfo.dispatch" :items="dispatchs" value="serial" color="black"
                placeholder="Remisión" label="Remisión" size="md" type="text" required
                @update:model-value="listDispatchs(returnInfo.dispatch as string)" />
        </div>
        <div class="phone:w-full tablet:w-1/2 p-2 phone:py-4 tablet:py-2">
            <Input class="w-full" color="black" placeholder="Cantidad" label="cantidad" size="md" type="number"
                @update:model-value="null" v-model="returnInfo.amount" required/>
        </div>
        <div class="italic" v-if="(typeof returnInfo.dispatch == 'object')">
            La pendiente del producto por devolver es: {{ returnInfo.dispatch.dispatching - returnInfo.dispatch.returning }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { dispatchScheme, token } from '@/schemas';
import { useAuthStore } from '@/stores/auth';
import { ref, type Ref, onBeforeMount, computed, watch } from 'vue';
import Autocomplete from '../Generics/Autocomplete.vue';
import Input from '../Generics/Input.vue';
import { convertSerial, formatSerial, getDispatch } from '@/services/accounting';

export interface dispatchInfoType {
    dispatch: any
    amount: number | string
}

export interface returnFormInterface {
    product: any
}

const props = defineProps<returnFormInterface>()
const auth = useAuthStore()
const cancelToken: Ref<AbortController | undefined> = ref()
const dispatchs: Ref<Array<dispatchScheme>> = ref([])
const returnInfo: Ref<dispatchInfoType> = ref({
    dispatch: '',
    amount: ''
})

watch(
    () => returnInfo,
    () => {
        const aux = returnInfo.value.dispatch.dispatching - returnInfo.value.dispatch.returning
        if(aux < returnInfo.value.amount){
            returnInfo.value.amount = aux
        }
    },
    {deep: true, immediate:true}
)

const canSave = computed(() => {
    return typeof returnInfo.value.dispatch == 'object' &&
        returnInfo.value.amount > 0
})

defineExpose({ returnInfo, canSave })


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
    listDispatchs('')
})

</script>

<style>

</style>