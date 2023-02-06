<template>
    <Header2>
        <template v-slot:mainContainer>
            <div class="p-10 flex flex-col items-start min-h-[70vh]">
                <div class="flex tablet:flex-row justify-between items-center w-full phone:flex-col phone:items-start">
                    <h1 class="flex flex-row justify-center laptop:text-4xl py-2 phone:text-2xl">
                        <span class="text-left">
                            Facturación
                        </span>
                        <div
                            class="flex items-center px-2 phone:text-xs tablet:text-sm rounded-xl bg-secondary text-white ml-2">
                            {{ invoices.length + " " + 'Facturas' }}
                        </div>
                    </h1>
                    <div class="flex h-fit ">
                        <Button v-if="writePer" exactColor color="secondary" icon="Add" :content="'Nueva Factura'"
                            @click="null" />
                    </div>
                </div>
                <Input class="my-2 px-2 py-2 tablet:w-1/2 phone:w-full rounded-lg border-solid outline-secondary"
                    :placeholder="'Filtrar'" :label="'Filtrar'" v-model="filters.text"  @update:model-value="getInvoices()"/>

                <div class="flex items-center flex-wrap">
                    <span class="italic font-bold px-5">
                        Filtros:
                    </span>
                    <Tag title="@mee" v-model="filters.byMe" />
                    <Tag title="Borrador" v-model="filters.draft" />
                    <Tag title="Liquidación" v-model="filters.settlement" />
                    <Tag title="Facturación" v-model="filters.invoicing" />
                    <Tag title="This month" v-model="filters.thisMonth" @update:model-value="getInvoices()"/>
                    <Tag title="Last month" v-model="filters.lastMonth" @update:model-value="getInvoices()"/>
                </div>

                <DataTable :configTable="configTable" :header="headers" :data="invoicesFiltered"
                @openContext="null" />

                <!-- <ContextMenu>

                </ContextMenu> -->

            </div>
        </template>
        <template v-slot:helperContainer>

        </template>
    </Header2>
</template>
<script lang="ts" setup>
import DataTable from '@/components/datatable/DataTable.vue';
import { Button, Input } from '@/components/Generics/generics';
import Tag from '@/components/Generics/Tag.vue';
import Header2 from '@/components/Header2.vue';
import { writePer } from '@/composables/permissions';
import socket from '@/composables/socket';
import {listInvoices} from '@/services/accounting'
import type { invoicingSchema } from '@/schemas/InvoicingSchema';
import moment from 'moment';
import { ref, onBeforeMount, computed, type Ref, type ComputedRef } from 'vue';
import { useRouter, type Router } from 'vue-router';
import ContextMenu from '@/components/context/ContextMenu.vue';
import { useAuthStore } from '@/stores/auth';

interface invoicingViewFilters{
    byMe: boolean,
    draft: boolean,
    settlement: boolean,
    invoicing: boolean,
    thisMonth: boolean,
    lastMonth: boolean,
    text: string
}

const userStore = useAuthStore()
const router: Router = useRouter()
const filters: Ref<invoicingViewFilters> = ref({
    byMe: false,
    draft: true,
    settlement: true,
    invoicing: true,
    thisMonth: true,
    lastMonth: false,
    text: ''
})
const configTable = ref({
    color: 'black',
    dropdown: false
})
const headers = ref([
    { title: 'Ref', accesor: 'serial', config: { hex: true }, sort: true, sortDirection: 'up', width: 'phone:w-[10%] tablet:w-[10%] tablet:flex phone:block' },
    { title: 'Nombre del cliente', accesor: 'client_name', sort: true, sortDirection: 'up', width: 'phone:w-[35%] tablet:w-[30%] tablet:flex phone:block' },
    { title: 'Valor total', accesor: 'total', config: { money: true }, sort: true, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[30%] tablet:flex phone:hidden' },
    { title: 'Fecha de creación', accesor: 'creation', sort: true, config: { timeformat: true }, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[20%] tablet:flex phone:block' },
    { title: '', accesor: '', sort: false, sortDirection: 'up', width: 'phone:w-[10%] tablet:w-[10%] tablet:flex phone:block' },
])

const invoices: Ref<Array<invoicingSchema>> = ref([])
const invoicesFiltered: ComputedRef<Array<invoicingSchema>> = computed(() => {
    let inv = invoices.value.filter(nvc => {
        const user = userStore.getUser
        if(filters.value.byMe && nvc.created_by != user.id){
            return false
        }
        if(!filters.value.draft && nvc.stage == 1){
            return false
        }
        if(!filters.value.settlement && nvc.stage == 2){
            return false
        }
        if(!filters.value.invoicing && nvc.stage == 3){
            return false
        }

        return nvc.client_name?.toLowerCase().includes(filters.value.text.toLowerCase())
    })
    return inv
})
const cancelToken: Ref<AbortController | undefined> = ref() 

onBeforeMount(() => {
    getInvoices()
    socket.socket?.on('Invoicing', (body: invoicingSchema) => {
        if(Object.keys(body).length == 1){
            // Delete
        }else if(Object.keys(body).length == 2){
            // Update
        }else{
            // Create
        }
    })
})

const getInvoices: CallableFunction = async (): Promise<void> => {
    if(cancelToken.value){
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
    
    queries = {...queries, 'c.name': filters.value.text }
    
    let {data} = await listInvoices(queries, cancelToken.value.signal)
    cancelToken.value = undefined
    if(data){
        invoices.value = data
    }else{
        invoices.value = []
    }
    
}

</script>
<style>

</style>