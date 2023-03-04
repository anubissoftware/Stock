
<template>
    <div class="flex flex-row w-full flex-wrap">
        <div v-if="props.creation" class="w-full pb-6">
            <CheckBox class="" color="black" :content="'Filtrar cotizaciones por cliente'"
                :label="'Filtrar cotizaciones por cliente'" size="md" type="text" required v-model="filterByClient"
                @update:model-value="client = {}" />
        </div>
        <template v-if="props.creation">
            <div v-if="filterByClient" class="w-full pr-2 pb-6">
                <Select class="w-full" color="black" label="Cliente" v-model="client" :items="clients" size="md" type="text"
                    value="name" @update:model-value="updateValue()" />
            </div>
        </template>
        <div v-if="!props.creation" class="w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Cliente'" :label="'Cliente'" size="md" type="text"
                v-model="dispatch.name" @update:model-value="updateValue()" :disabled="!props.creation" />
        </div>
        <div class="w-full pr-2 pb-6">
            <Select v-if="props.creation" class="w-full" color="black" label="Quotation" v-model="quotation"
                :items="quotationsListed" size="md" type="text" value="serial" required
                @update:model-value="updateValue(); listByQuotation()" />
            <Input v-else class=" w-full " color="black" :placeholder="'Cotización'" :label="'Cotización'" size="md"
                type="text" required v-model="dispatch.quotation_serial" @update:model-value="updateValue()"
                :disabled="!props.creation" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <div class="laptop:py-5" v-if="props.creation"></div>
            <Input class=" w-full py-4"
                color="black" placeholder="Fecha de salida" label="Fecha salida bodega (Y-M-D)" size="md" required
                :type="props.creation || props.editing ? 'datetime-local' : 'text'" v-model="dispatch.out_store"
                :disabled="!props.creation && !props.editing" @update:model-value="updateValue()" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <CheckBox v-if="props.creation" class="py-2" color="black" :content="'Agregar fecha de recibido'"
                :label="'Agregar fecha de recibido'" size="md" type="text" required v-model="checkDateReceived"
                @update:model-value="updateValue()" />
            <Input v-if="(!props.creation || checkDateReceived) && dispatch.received != 'Invalid date'" class=" w-full py-4"
                color="black" placeholder="Fecha de entrega" label="Fecha entrega cliente (Y-M-D)" size="md" required
                :type="props.creation || props.editing ? 'datetime-local' : 'text'" v-model="dispatch.received"
                :disabled="!props.creation && !props.editing" @update:model-value="updateValue()" />
        </div>

        <!-- Products details -->
        <template v-if="dispatch.detail">
            <div class="w-full text-xl py-2 border-t-2 border-black text-left font-bold pb-5">
                Productos
            </div>
            <template v-for="(detail, index) in dispatch.detail" v-if="false" :key="index">
                <div class="flex flex-col w-full border-2 rounded-xl py-2 px-2 mb-2" :class="[detail.amount_avaliable - detail.dispatching == 0 ? 'border-green-700' : null,
                props.editing ? 'bg-gray-100' : '']">
                <pre>
                    {{ detail }}
                </pre>
                    <div class="flex flex-row justify-between w-full items-center">
                        <div class="flex flex-col justify-start items-start">
                            <span class="font-bold">{{ detail.name }} {{ detail.sigla ? ` > (Socio ${detail.sigla})` : '' }}
                            </span>
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
            <productsDispatchingVue :pdtos="dispatch.detail" :partners="props.partners" :readonly="!props.creation"/>
            <div class="w-full text-xl mt-2 py-2 border-t-2 border-black text-left font-bold pb-5">
                Datos de envío
            </div>

            <div class="w-full pb-6">
                <CheckBox class="" color="black" :content="'Se envía con un usuario registrado'"
                    :label="'Se envía con un usuario registrado'" size="md" type="text" required v-model="userRegistered"
                    @update:model-value="client = {}" />
            </div>

            <template v-if="userRegistered">
                <div class="phone:w-full tablet:w-1/2 pr-2 pb-6">
                    <Select :disabled="!props.creation" class="w-full" color="black" label="Usuario" v-model="userToSend.user" :items="users" size="md"
                        type="text" value="name" @update:model-value="updateValue()" />
                </div>
            </template>
            <template v-else>
                <div class="phone:w-full tablet:w-1/2 pr-2 pb-6">
                    <Input :disabled="!props.creation" color="black" placeholder="Nombre" label="Nombre" v-model="userToSend.name" size="md"
                        type="text" />
                </div>
            </template>
            <div class="phone:w-full tablet:w-1/2 pr-2 pb-6">
                <Input :disabled="!props.creation" color="black" placeholder="Placa del vehículo" label="Placa del vehículo" v-model="userToSend.plate"
                    size="md" type="text" />
            </div>

            <div class="w-full text-xl mt-2 py-2 border-t-2 border-black text-left font-bold pb-5">
                Datos de recepción
            </div>

            <div class="phone:w-full tablet:w-1/2 pr-2 pb-6">
                <Autocomplete v-model="contactToReceive.contact" :items="clientContacts" value="name" color="black"
                    placeholder="Solicitada por" label="Solicitada por" size="md" type="text" @update:model-value="() => {
                        if (typeof contactToReceive.contact == 'object') {
                            if (contactToReceive.contact.phone !== '') {
                                contactToReceive.phone = contactToReceive.contact.phone
                            } else {
                                contactToReceive.phone = ''
                            }
                        }
                    }" :disabled="!props.creation"/>
            </div>
            <div class="phone:w-full tablet:w-1/2 pr-2 pb-6">
                <Input color="black" placeholder="Número de teléfono" label="Número de teléfono"
                    v-model="contactToReceive.phone" size="md" type="text" :disabled="!props.creation"/>
            </div>

        </template>
    </div>
</template>
<script lang="ts" setup>
import { Input, Select, Autocomplete, CheckBox } from './Generics/generics';
import { defineProps, defineEmits, ref, onBeforeMount, type Ref, computed } from 'vue';
import moment from 'moment';
import { getClients, getClientsContacts } from '@/services/clients'
import { formatSerial, listQuotations, quotationDetail } from '@/services/accounting'
import { getUsers } from '@/services/users'
import { useAuthStore } from '@/stores/auth'
import type { clientEnterpriseSchema, clientsContactSchema, dispatchScheme, partnerSchema, quotationDetailSchema, quotationSchema, token, userSchema } from '@/schemas';
import { useRouter } from 'vue-router';
import productsDispatchingVue from './dispatching/productsDispatching.vue';

export interface DispatchCreationProps {
    dispatch: dispatchScheme,
    creation: boolean,
    editing: boolean,
    partners: partnerSchema[]
}
const router = useRouter()
const props = defineProps<DispatchCreationProps>()
const store = useAuthStore()
const emits = defineEmits(['update'])
const dispatch: Ref<any | DispatchCreationProps> = ref({})
const clients: Ref<Array<clientEnterpriseSchema>> = ref([])
const users: Ref<Array<userSchema>> = ref([])
const quotations: Ref<Array<quotationSchema>> = ref([])
const quotation: Ref<any | quotationSchema> = ref([])
const client: Ref<any | clientEnterpriseSchema> = ref({})
const filterByClient: Ref<boolean> = ref(false)
const checkDateOut: Ref<boolean> = ref(false)
const checkDateReceived: Ref<boolean> = ref(false)
const userRegistered: Ref<boolean> = ref(true)
const clientContacts: Ref<clientsContactSchema[]> = ref([])
const userToSend: Ref<any> = ref({
    user: [],
    name: '',
    plate: ''
})
const contactToReceive: Ref<any> = ref({
    contact: '',
    phone: ''
})

defineExpose({userToSend, contactToReceive, quotation})

onBeforeMount(async () => {
    if (props.creation) {
        await listInfo()
    }
    dispatch.value = { ...props.dispatch }
    if (!props.dispatch.quotation_serial) {
        dispatch.value.quotation_serial = ''
    }
    console.log('Se recreo', dispatch.value, users.value)
    dispatch.value.out_store = moment(dispatch.value.out_store).format('YYYY-MM-DDTHH:mm:ss')
    dispatch.value.check_out = checkDateOut.value
    dispatch.value.received = moment(dispatch.value.received).format('YYYY-MM-DDTHH:mm:ss')
    dispatch.value.check_received = checkDateReceived.value
    emits('update', dispatch.value)
    if(dispatch.value.id){
        userToSend.value.plate = dispatch.value.plate
        userToSend.value.name = dispatch.value.name_sent
        listByQuotation()
    }
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
        'q.stage': '2,3',
        '!q.serial': 'null'
    }
    if (router.currentRoute.value.query.id) {
        const query = router.currentRoute.value.query
        filter['q.id'] = query.id

    }

    let quotationResponse = await listQuotations((store.getUser.token as token).value, filter, cancelToken.signal)
    if (!quotationResponse.data) return
    let quotationsApproved = quotationResponse.data
    quotations.value = quotationsApproved
    if (router.currentRoute.value.query.id) {
        quotation.value = quotations.value[0]
        updateValue()
        listByQuotation()
    }
}

const quotationsListed = computed(() => {
    if (client.value.id) {
        return quotations.value.filter((quotation) => {
            if (quotation.client_id == client.value.id) {
                quotation.serial = formatSerial(parseInt(quotation.serial.toString()))
                return quotation
            }
        })
    } else {
        return quotations.value.map((quotation) => {
            quotation.serial = formatSerial(parseInt(quotation.serial.toString()))
            return quotation
        })
    }
})

const updateValue = async () => {
    if (props.creation) {
        if (quotation.value.id !== dispatch.value.quotation_id) {
            await listDetailQuotation()
        }
        dispatch.value.quotation_id = quotation.value.id
        dispatch.value.quotation_serial = quotation.value.serial
        dispatch.value.name = (clients.value.find(client => client.id == quotation.value.client_id))?.name
        dispatch.value.check_received = checkDateReceived.value
        dispatch.value.check_out = checkDateOut.value
    }
    emits('update', dispatch.value)
}

const listDetailQuotation = async () => {
    let { data } = await quotationDetail({ id: quotation.value.id })
    data.map((detail: any) => {
        detail.amount_avaliable = detail.amount
        detail.detail_id = detail.id
        detail.id = detail.item_id
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


const listUsers = async () => {
    let { data } = await getUsers({})

    users.value = data

    if(dispatch.value.id){
        userToSend.value.user = users.value.find(user => user.id == dispatch.value.user_sent)
    }
}

const listContacts = async () => {
    let filters: any = {}
    if (quotation.value.project_id !== null) {
        filters['cc.project_id'] = quotation.value.project_id
    }
    if (quotation.value.client_id !== null) {
        filters['cc.client_id'] = quotation.value.client_id
    }

    let { data } = await getClientsContacts(filters)

    clientContacts.value = data
    if(dispatch.value.id){
        contactToReceive.value.contact = clientContacts.value.find(cont => cont.id == dispatch.value.contact_received)
        contactToReceive.value.phone = contactToReceive.value.contact.phone
    }
}

const listByQuotation = async () => {
    listContacts()
    listUsers()
}
</script>
