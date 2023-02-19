<template>
    <Header2>
        <template v-slot:mainContainer>
            <div class="p-10 flex flex-col items-start min-h-[75vh]">
                <div class="flex tablet:flex-row justify-between items-center w-full phone:flex-col phone:items-start">
                    <h1 class="flex flex-row justify-center laptop:text-4xl py-2 phone:text-2xl">
                        <span class="text-left" v-if="macros.quote">
                            Cotizaciones
                        </span>
                        <span class="text-lef" v-else>
                            Flujos únicos
                        </span>
                        <div
                            class="flex items-center px-2 phone:text-xs tablet:text-sm rounded-xl bg-secondary text-white ml-2">
                            {{ listedQuotations.length + " " + (macros.quote ? 'cotizaciones' : 'Flujos')}}
                        </div>
                    </h1>
                    <div class="flex h-fit ">
                        <Button v-if="writePer && macros.quote" exactColor color="secondary" icon="Add" :content="'Nueva cotización'"
                            @click="router.push({ path: '/dashboard/mystock', query: { quote: '1' } })" />
                    </div>
                </div>
                <Input class="my-2 px-2 py-2 tablet:w-1/2 phone:w-full rounded-lg border-solid outline-secondary"
                    :placeholder="'Filtrar'" :label="'Filtrar'" v-model="filter"  @update:model-value="getQuotations()"/>

                <div class="flex items-center flex-wrap">
                    <span class="italic font-bold px-5">
                        Filtros:
                    </span>
                    <Tag title="@mee" v-if="macros.quote" v-model="filters.byMe" />
                    <Tag title="Pending" v-if="macros.quote" v-model="filters.pending" />
                    <Tag title="Rejected" v-if="macros.quote" v-model="filters.rejected" />
                    <Tag title="Approved" v-if="macros.quote" v-model="filters.approved" />
                    <Tag title="This month" v-model="filters.thisMonth" @update:model-value="getQuotations"/>
                    <Tag title="Last month" v-model="filters.lastMonth" @update:model-value="getQuotations"/>
                </div>

                <DataTable :config-table="configTable" :header="headers" :data="listedQuotations"
                    @open-context="handleContext" />
                <ContextMenu class="right-click-menu" :left="contextOptions.left" :top="contextOptions.top"
                    v-if="contextOptions.show" @close="contextOptions.show = false">
                    <template v-slot:options>
                        <div v-if="quoteSelected.stage == 0 && macros.quote" @click="editQuotation()">
                            Editar <span :class="loadingQuotation ? 'inline' : 'hidden'">...</span>
                        </div>
                        <div @click="deleteQuotation()" v-if="quoteSelected.stage == 0">
                            Eliminar
                        </div>
                        <div v-if="quoteSelected.stage == 2 || quoteSelected.stage == 3"
                            @click="creatingDispatch()"
                        >
                            Crear remisión
                        </div>
                        <div v-if="quoteSelected.stage >= 3"
                            @click="watchDispatches()"
                            >
                            Ver remisiones
                        </div>
                        <div v-if="(quoteSelected.stage == 4 || quoteSelected.stage == 5 || !macros.quote) && quoteSelected.isRenting == 1"
                        @click="creatingReturn()">
                            Crear devolución
                        </div>
                        <div v-if="quoteSelected.stage >= 5 && quoteSelected.isRenting == 1" @click="watchReturns()">
                            Ver devoluciones
                        </div>
                        <div v-if="(quoteSelected.stage == 6) || (quoteSelected.stage >= 2 && quoteSelected.isRenting != 1)">
                            Facturar
                        </div>
                        <div v-if="quoteSelected.stage >= 7">
                            Ver Factura
                        </div>
                        <div v-if="quoteSelected.stage == 0" @click="resendingQuotation(); contextOptions.show = false">
                            Enviar correo
                        </div>
                        <div v-if="quoteSelected.stage == 0" @click="approvingQuotation()">
                            Aprobar
                        </div>
                        <div v-if="quoteSelected.stage == 0" @click="rejectingQuotation()">
                            Rechazar
                        </div>
                    </template>
                </ContextMenu>
            </div>
        </template>
    </Header2>
</template>

<script lang="ts" setup>
import Header2 from '@/components/Header2.vue';
import { editPer, macros, writePer } from '@/composables/permissions';
import { Button, Input } from '@/components/Generics/generics';
import { ref, onMounted, onUnmounted, type Ref, type ComputedRef, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { quotationSchema, quotationDetailSchema, token } from '@/schemas';
import { listQuotations, removeQuotation, rejectQuotation, approveQuotation, quotationDetail, resendQuotation } from '@/services/accounting'
import DataTable from '@/components/datatable/DataTable.vue';
import socket from '@/composables/socket';
import moment from 'moment';
import ContextMenu from '@/components/context/ContextMenu.vue';
import { modalComp, type modalResponse } from '@/classes/Modal';
import Tag from '@/components/Generics/Tag.vue';
import { useShoppingCart, loaded } from '@/composables/ShoppingCart';
import { useProductStore } from '@/stores/products';
import { useAuthStore } from '@/stores/auth'

const cancelToken: Ref<AbortController | undefined> = ref(undefined)
const router = useRouter()
const loadingQuotation = ref(false)
const shopping = useShoppingCart()
const filter = ref('')
const pdto = useProductStore()
const auth = useAuthStore()
const quoteSelected: Ref<quotationSchema | any> = ref({})
const quotations: Ref<Array<quotationSchema>> = ref([])

interface quotationFilters {
    byMe: boolean;
    pending: boolean;
    rejected: boolean;
    approved: boolean;
    thisMonth: boolean;
    lastMonth: boolean;
}
const filters: Ref<quotationFilters> = ref({
    byMe: false,
    pending: true,
    rejected: true,
    approved: true,
    thisMonth: true,
    lastMonth: false
})
const listedQuotations: ComputedRef<Array<quotationSchema>> = computed(() => {
    return quotations.value.filter((quote) => {
        if (filters.value.byMe && quote.user != auth.getUser.id) {
            return false
        }
        if (!filters.value.pending && quote.stage == 0) {
            return false
        }
        if (!filters.value.rejected && quote.stage == 1) {
            return false
        }
        if (!filters.value.approved && (quote.stage >= 2)) {
            return false
        }

        return quote.client_name?.toLowerCase().includes(filter.value.toLowerCase())
    })
})


const contextOptions = ref({
    left: 0,
    top: 0,
    show: false
})

const configTable = ref({
    color: 'black',
    dropdown: false
})
const headers = ref([
    { title: 'Ref', accesor: 'serial', config: { hex: true }, sort: true, sortDirection: 'up', width: 'phone:w-[10%] tablet:w-[10%] tablet:flex phone:block' },
    { title: 'Nombre del cliente', accesor: 'client_name', sort: true, sortDirection: 'up', width: 'phone:w-[35%] tablet:w-[25%] tablet:flex phone:block' },
    { title: 'Valor', accesor: 'value', config: { money: true }, sort: true, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[35%] tablet:flex phone:hidden' },
    { title: 'Fecha de creación', accesor: 'creation', sort: true, config: { timeformat: true }, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[20%] tablet:flex phone:block' },
    { title: '', accesor: '', sort: false, sortDirection: 'up', width: 'phone:w-[10%] tablet:w-[10%] tablet:flex phone:block' },
])

onMounted(() => {
    socket.socket?.on('quotationChange', (body: quotationSchema) => {
        if (Object.keys(body).length == 1) {
            quotations.value = quotations.value.filter(quotation => quotation.id != body.id)
        } else if (Object.keys(body).length == 2) {
            quotations.value = quotations.value.map((quotation) => {
                if (quotation.id == body.id) {
                    quotation.stage = body.stage
                }
                return quotation
            })
        } else {
            if (body.creation) {
                quotations.value = quotations.value.map((quotation) => {
                    if (quotation.id == body.id) {
                        quotation = body
                    }
                    return quotation
                })
            } else {
                body.creation = moment().format('YYYY-MM-DD')
                quotations.value.unshift(body)
            }
        }
    })
    getQuotations()
})

onUnmounted(() => {
    socket.socket?.removeListener('quotationChange')
})

const getQuotations = async () => {
    if (cancelToken.value) {
        cancelToken.value.abort()
    }

    cancelToken.value = new AbortController()
    let queries: any = {}
    if(filters.value.thisMonth && filters.value.lastMonth){
        queries = {
            date: 'creation',
            min_date: moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
            max_date: moment().endOf('month').format('YYYY-MM-DD')
        }
    }else if(filters.value.thisMonth){
        queries = {
            date: 'creation',
            min_date: moment().startOf('month').format('YYYY-MM-DD'),
            max_date: moment().endOf('month').format('YYYY-MM-DD')
        }
    }else if(filters.value.lastMonth){
        queries = {
            date: 'creation',
            min_date: moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
            max_date: moment().add(-1, 'month').endOf('month').format('YYYY-MM-DD')
        }
    }

    let { data } = await listQuotations((auth.getUser.token as token).value, {'c.name': filter.value, ...queries}, cancelToken.value.signal)
    cancelToken.value = undefined
    if (data) {
        quotations.value = data
    } else {
        quotations.value = []
    }
}

const deleteQuotation = () => {
    const item: quotationSchema = quoteSelected.value as quotationSchema
    modalComp.modal.show({
        title: 'Eliminar cotización',
        description: '¿Deseas eliminar esta cotización?',
        inputValue: ''
    }).then((r: modalResponse) => {
        if (r.success) {
            removeQuotation((auth.getUser.token as token).value, { id: item.id })
        }
    })
}

const editQuotation = async () => {
    loadingQuotation.value = true
    let { data } = await quotationDetail({ id: quoteSelected.value.id })
    loadingQuotation.value = false
    shopping.clearBasket()
    const quotation = quoteSelected.value as quotationSchema
    loaded.quotation = {
        min_date: quotation.min_validity,
        max_date: quotation.max_validity,
        renting: quotation.isRenting == 1 ? true : false,
        rent_min_date: quotation.from,
        rent_max_date: quotation.to,
        one_day: quotation.one_day == 1 ? true : false,
        email: quotation.email,
        discount: quotation.discount,
        taxing: quotation.taxing
    }
    data.forEach((element: quotationDetailSchema) => {
        shopping.addProduct({
            amount: element.amount,
            days: element.days,
            start_rent: element.from,
            detail_id: element.id,
            id: element.item_id,
            end_rent: element.to,
            name: element.name ?? '',
            value: element.value,
            renting: element.value
        })
    });

    router.push({
        path: '/dashboard/mystock',
        query: {
            quote: 2,
            client: quoteSelected.value.client_id,
            project: quoteSelected.value.project_id,
            id: quoteSelected.value.id
        }
    })
}

const rejectingQuotation = () => {
    const item: quotationSchema = quoteSelected.value as quotationSchema
    modalComp.modal.show({
        title: 'Rechazar cotización',
        description: '¿Deseas marcar esta cotización como <strong>rechazada</strong>?',
        inputValue: ''
    }).then((r: modalResponse) => {
        if (r.success) {
            rejectQuotation((auth.getUser.token as token).value, { id: item.id })
        }
    })
}

const watchDispatches = () =>{
    router.push({
        name: 'dispatch',
        query: {id: quoteSelected.value.id, action: 0},
    })
}
const watchReturns = () =>{
    router.push({
        name: 'return',
        query: {id: quoteSelected.value.id, action: 0},
    })
}

const creatingDispatch = () => {
    router.push({
        name: 'dispatch',
        query: {id: quoteSelected.value.id, action: 1}
    })
}

const creatingReturn = () => {
    router.push({
        name: 'return',
        query: {id: quoteSelected.value.id, action: 1}
    })
}

const approvingQuotation = () => {
    const item: quotationSchema = quoteSelected.value as quotationSchema
    modalComp.modal.show({
        title: 'Aprobar cotización',
        description: '¿Deseas marcar esta cotización como <strong>aprobada</strong>?',
        inputValue: ''
    }).then((r: modalResponse) => {
        if (r.success) {
            approveQuotation((auth.getUser.token as token).value, { id: item.id })
        }
    })
}

const resendingQuotation = () => {
    resendQuotation((auth.getUser.token as token).value, { quotation_id: quoteSelected.value.id })
}


const handleContext = (body: any) => {
    if (!editPer) return
    const event: PointerEvent = body.event
    const item: quotationSchema = body.item
    contextOptions.value.left = event.x
    contextOptions.value.top = event.y
    contextOptions.value.show = true

    quoteSelected.value = item
}


</script>