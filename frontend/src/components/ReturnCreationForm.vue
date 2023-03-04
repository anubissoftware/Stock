
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
                    type="text" value="name" @update:model-value="updateValue(); listInfo(); returning = {}; quotation = {}" />
            </div>
        </template>
        <div v-if="!props.creation" class="w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Cliente'" :label="'Cliente'" size="md" type="text"
                v-model="returning.name" @update:model-value="updateValue()" :disabled="!props.creation" />
        </div>
        <div class="w-full pr-2 pb-6">
            <Select v-if="props.creation" class="w-full" color="black" label="Quotation" v-model="quotation"
                :items="quotationsListed" size="md" type="text" value="serial" required
                @update:model-value="updateValue()" />
            <!-- <Input v-else class=" w-full " color="black" :placeholder="'Cotización'" :label="'Cotización'" size="md"
                type="text" required v-model="returning.quotation_serial" @update:model-value="updateValue()"
                :disabled="!props.creation" /> -->
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full py-4" color="black"
                placeholder="Fecha de salida" label="Fecha de devolución (Y-M-D)" size="md" required
                :type="'datetime-local'" v-model="returning.return_date"
                @update:model-value="updateValue()" :disabled="!props.creation && !props.editing" />
        </div>

        <Divider class="my-4" />
        <!-- Products details -->
        <template v-if="returning.detail">
            <div class="w-full text-center text-xl py-2">
                Productos
            </div>
            <template v-for="(detail, index) in returning.detail" :key="index">
                <div class="flex flex-col w-full border-2 rounded-xl py-2 px-2 mb-2" :class="[detail.dispatching - detail.returning == 0 ? 'border-green-700' : null,
                props.editing ? 'bg-gray-100' : '']">
                    <div class="flex flex-row justify-between w-full items-center">
                        <div class="flex flex-col justify-start items-start">
                            <span class="font-bold">{{ detail.name }}</span>
                            <span class="text-xs">{{ 'Dispatching: ' + detail.dispatching }}</span>
                            <span class="text-xs">{{ 'Returning: ' + detail.returning }}</span>

                        </div>
                        <span class="px-2" v-if="!props.creation">{{ detail.amount }}</span>
                        <input v-else :max="detail.dispatching - detail.returning" :min="0"
                            class="border rounded-md text-center w-20 outline-primary border-primary"
                            :class="[!creation || (detail.dispatching - detail.returning == 0) ? 'border-green-700' : '']"
                            type="number" :disabled="!props.creation || (detail.dispatching - detail.returning == 0)"
                            v-model="detail.amount" @blur="validateAmount(detail)">
                    </div>
                    <div v-if="detail.dispatching - detail.returning == 0"
                        class="flex flex-col py-1 text-xs text-green-700">
                        Producto totalmente devuelto
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
import { formatSerial, listQuotations, quotationDetail } from '@/services/accounting'
import { useAuthStore } from '@/stores/auth'
import type { clientEnterpriseSchema, returnScheme, quotationDetailSchema, quotationSchema, token } from '@/schemas';
import { useRouter } from 'vue-router';

export interface ReturnCreationProps {
    return: returnScheme,
    creation: boolean,
    editing: boolean
}
const router = useRouter()
const props = defineProps<ReturnCreationProps>()
const store = useAuthStore()
const emits = defineEmits(['update'])
const returning: Ref<any | ReturnCreationProps> = ref({
    return_date: moment().format('YYYY-MM-DD HH:mm:ss')
})
const clients: Ref<Array<clientEnterpriseSchema>> = ref([])
const quotations: Ref<Array<quotationSchema>> = ref([])
const quotation: Ref<any | quotationSchema> = ref({})
const client: Ref<any | clientEnterpriseSchema> = ref({})
const filterByClient: Ref<boolean> = ref(false)

onBeforeMount(async () => {
    if (props.creation) {
        await listInfo()
    }
    returning.value = { ...returning.value, ...props.return}
    if(!props.return.quotation_serial){
        returning.value.quotation_serial = ''
    }
    // returning.value.return_date = moment(props.return.return_date).format('YYYY-MM-DD HH:mm:ss')
    console.log('RETURNING',returning.value)
    emits('update', returning.value)
})

const listInfo = async () => {

    let cancelToken = new AbortController();

    let { data } = await getClients((store.getUser.token as token).value, '', cancelToken.signal)
    if (!data) return
    clients.value = data
    if (!props.creation) {
        client.value = clients.value.filter((client) => {
            if (client.id == props.return.client_id) {
                return client
            }
        })[0]
    }
    let filter: any = {
        'q.stage': '3,4,5',
        'q.isRenting': '1',
    }
    if (router.currentRoute.value.query.id) {
        const query = router.currentRoute.value.query
        filter['q.id'] = query.id

    }

    let quotationResponse = await listQuotations((store.getUser.token as token).value, filter, cancelToken.signal)
    if (!quotationResponse.data) return
    let quotationsDispatching: Array<quotationSchema> = quotationResponse.data
    quotations.value = quotationsDispatching.map(quote => {
        if(quote.serial == null) {
            quote.serial = ' Flujo ' + formatSerial(quote.id) 
        }
        return quote
    })
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
        return quotations.value.map((quote) => {
            if(quote.serial.toString().split(' ').length == 1){
                quote.serial = formatSerial(parseInt(quote.serial.toString()))
            }
            return quote
        })
    }
})

const updateValue = async () => {
    if (quotation.value.id !== returning.value.quotation_id) {
        await listDetailQuotation()
    }
    if (props.creation) {
        returning.value.quotation_id = quotation.value.id
        returning.value.quotation_serial = quotation.value.serial
        returning.value.name = (clients.value.find(client => client.id == quotation.value.client_id))?.name
    }
    emits('update', returning.value)
}

const listDetailQuotation = async () => {
    //
    console.log(quotation)
    let { data } = await quotationDetail({ id: quotation.value.id })
    console.log('DETAIL',data)
    data.map((detail: any) => {
        detail.amount_avaliable = detail.amount
        delete detail['amount']
        detail.amount = 0
    })
    returning.value.detail = data
}
const validateAmount = (detail: quotationDetailSchema) => {
    let maxAmount = (detail.dispatching ?? 0) - (detail.returning ?? 0)
    if (detail.amount > maxAmount) {
        detail.amount = maxAmount
    }
}
</script>
