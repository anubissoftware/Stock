
<template>
    <div class="flex flex-row w-full flex-wrap">
        <div v-if="props.creation" class="w-full pb-6">
            <CheckBox class="" color="black" :content="'Filtrar cotizaciones por cliente'"
                :label="'Filtrar cotizaciones por cliente'" size="md" type="text" required v-model="filterByClient"
                @update:model-value="client = {}" />
        </div>
        <template v-if="props.creation">
            <div v-if="filterByClient" class="w-full pr-2 pb-6">
                <Select class="w-full" color="black" label="Cliente" v-model="client" :items="clients" size="md"
                    type="text" value="name" @update:model-value="updateValue()" />
            </div>
        </template>
        <div v-if="!props.creation" class="w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Cliente'" :label="'Cliente'" size="md" type="text"
                v-model="dispatch.name" @update:model-value="updateValue()" :disabled="!props.creation" />
        </div>
        <div class="w-full pr-2 pb-6">
            <Select v-if="props.creation" class="w-full" color="black" label="Quotation" v-model="quotation"
                :items="quotationsListed" size="md" type="text" value="serial" required
                @update:model-value="updateValue()" />
            <Input v-else class=" w-full " color="black" :placeholder="'Cotización'" :label="'Cotización'" size="md"
                type="text" required v-model="dispatch.quotation_serial" @update:model-value="updateValue()"
                :disabled="!props.creation" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <CheckBox v-if="props.creation" class="py-2" color="black" :content="'Agregar fecha de salida'"
                :label="'Agregar fecha de salida'" size="md" type="text" required v-model="checkDateOut"
                @update:model-value="client = {}" />
            <Input v-if="!props.creation || checkDateOut" class=" w-full py-4" color="black"
                placeholder="Fecha de salida" label="Fecha salida bodega (Y-M-D)" size="md" required
                :type="props.creation || props.editing ? 'datetime-local' : 'text'" v-model="dispatch.out_store"
                @update:model-value="updateValue()" :disabled="!props.creation && !props.editing" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <CheckBox v-if="props.creation" class="py-2" color="black" :content="'Agrega fecha de recibido'"
                :label="'Agrega fecha de recibido'" size="md" type="text" required v-model="checkDateReceived"
                @update:model-value="client = {}" />
            <Input v-if="!props.creation || checkDateReceived" class=" w-full py-4" color="black"
                placeholder="Fecha de entrega" label="Fecha entrega cliente (Y-M-D)" size="md" required
                :type="props.creation || props.editing ? 'datetime-local' : 'text'" v-model="dispatch.received"
                @update:model-value="updateValue()" :disabled="!props.creation && !props.editing" />
        </div>

        <Divider class="my-4" />
        <!-- Products details -->
        <template v-if="dispatch.detail">
            <div class="w-full text-center text-xl py-2">
                Productos
            </div>
            <template v-for="(detail, index) in dispatch.detail" :key="index">
                <div class="flex flex-col w-full border-2 rounded-xl py-2 px-2 mb-2" :class="[detail.amount_avaliable - detail.dispatching == 0 ? 'border-green-700' : null,
                props.editing ? 'bg-gray-100' : '']">
                    <div class="flex flex-row justify-between w-full items-center">
                        <div class="flex flex-col justify-start items-start">
                            <span class="font-bold">{{ detail.name }}</span>
                            <span class="text-xs">{{ 'Amount:' + detail.amount_avaliable }}</span>
                            <span class="text-xs">{{ 'Dispatching:' + detail.dispatching }}</span>

                        </div>
                        <span class="px-2" v-if="!props.creation">{{ detail.amount }}</span>
                        <input v-else :max="detail.amount_avaliable - detail.dispatching" :min="0"
                            class="border rounded-md text-center w-20 outline-primary border-primary"
                            :class="[!creation || (detail.amount_avaliable - detail.dispatching == 0) ? 'border-green-700' : '']"
                            type="number" :disabled="!creation || (detail.amount_avaliable - detail.dispatching == 0)"
                            v-model="detail.amount" @blur="validateAmount(detail)">
                    </div>
                    <div v-if="detail.amount_avaliable - detail.dispatching == 0"
                        class="flex flex-col py-1 text-xs text-green-700">
                        Producto totalmente entregado
                    </div>
                </div>

            </template>
        </template>
    </div>
</template>
<script lang="ts" setup>
import { Input, Select, Divider, CheckBox } from './Generics/generics';
import { defineProps, defineEmits, ref, onBeforeMount, type Ref, computed } from 'vue';
import moment from 'moment';
import { getClients } from '@/services/clients'
import { listQuotations, quotationDetail } from '@/services/accounting'
import { useAuthStore } from '@/stores/auth'
import type { clientEnterpriseSchema, dispatchScheme, quotationDetailSchema, quotationSchema, token } from '@/schemas';
import { useRouter } from 'vue-router';

export interface DispatchCreationProps {
    dispatch: dispatchScheme,
    creation: boolean,
    editing: boolean
}
const router = useRouter()
const props = defineProps<DispatchCreationProps>()
const store = useAuthStore()
const emits = defineEmits(['update'])
const dispatch: Ref<any | DispatchCreationProps> = ref({})
const clients: Ref<Array<clientEnterpriseSchema>> = ref([])
const quotations: Ref<Array<quotationSchema>> = ref([])
const quotation: Ref<any | quotationSchema> = ref([])
const client: Ref<any | clientEnterpriseSchema> = ref({})
const filterByClient: Ref<boolean> = ref(false)
const checkDateOut: Ref<boolean> = ref(false)
const checkDateReceived: Ref<boolean> = ref(false)

onBeforeMount(async () => {
    if (props.creation) {
        await listInfo()
    }
    dispatch.value = { ...props.dispatch }
    dispatch.value.out_store = moment(dispatch.value.out_store).format('YYYY-MM-DD')
    dispatch.value.received = moment(dispatch.value.received).format('YYYY-MM-DD')
    console.log(dispatch)
    emits('update', dispatch.value)
})

const listInfo = async () => {

    let cancelToken = new AbortController();

    let { data } = await getClients((store.getUser.token as token).value, '', cancelToken.signal)
    if (!data) return
    clients.value = data
    if (!props.creation) {
        client.value = clients.value.filter((client) => {
            if (client.id == props.dispatch.client_id) {
                return client
            }
        })[0]
    }
    let filter: any = {
        'q.stage': '2,3'
    }
    if (router.currentRoute.value.query.id) {
        const query = router.currentRoute.value.query
        filter['q.id'] = query.id

    }

    let quotationResponse = await listQuotations((store.getUser.token as token).value, filter, cancelToken.signal)
    if (!quotationResponse.data) return
    let quotationsApproved = quotationResponse.data
    quotations.value = quotationsApproved
    if(router.currentRoute.value.query.id){
        quotation.value = quotations.value[0]
        updateValue()
    }
}

const quotationsListed = computed(() => {
    if (client.value.id) {
        return quotations.value.filter((quotation) => {
            if (quotation.client_id == client.value.id) {
                return quotation
            }
        })
    } else {
        return quotations.value
    }
})

const updateValue = async () => {
    if (props.creation) {
        dispatch.value.quotation_id = quotation.value.id
        dispatch.value.quotation_serial = quotation.value.serial
        dispatch.value.name = (clients.value.find(client => client.id == quotation.value.client_id))?.name
    }
    emits('update', dispatch.value)
    if (quotation.value.id) {
        console.log(quotation.value)
        await listDetailQuotation()
    }
}

const listDetailQuotation = async () => {
    //
    console.log(quotation)
    let { data } = await quotationDetail({ id: quotation.value.id })
    console.log(data)
    data.map((detail: any) => {
        detail.amount_avaliable = detail.amount
        delete detail['amount']
        detail.amount = 0
    })
    dispatch.value.detail = data
}
const validateAmount = (detail: quotationDetailSchema) => {
    let maxAmount = (detail.amount_avaliable ?? 0) - (detail.dispatching ?? 0)
    if (detail.amount > maxAmount) {
        detail.amount = maxAmount
    }
}
</script>
