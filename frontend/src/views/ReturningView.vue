<template>
    <Header2>
        <template v-slot:mainContainer>
            <div class="p-10 flex flex-col items-start min-h-[70vh]">
                <div
                    class="pb-4 flex flex-row justify-between items-center w-full">
                    <h1 class="flex flex-row justify-center laptop:text-4xl py-2 phone:text-2xl">
                        <span class="text-left">
                            {{ strings.title[language] }}
                        </span>
                        <div
                            class="flex items-center px-2 phone:text-xs tablet:text-sm rounded-xl bg-secondary text-white ml-2">
                            {{ returns.length + " " + strings.title[language] }}
                        </div>
                    </h1>
                    <div class="flex h-fit ">
                        <Button v-if="writePer"
                            @click="modalReturn = true, returnSelected = {}, creationReturn = true, editingReturn = false"
                            exactColor color="secondary" icon="Add" :content=strings.newReturn[language] />
                    </div>
                </div>
                <Input class="my-2 px-2 tablet:w-1/2 phone:w-full rounded-lg border-solid outline-secondary"
                    :placeholder=strings.search[language] :label=strings.search[language] v-model="filter"
                    @update:model-value="listReturns()" />

                <div class="flex items-center flex-wrap">
                    <span class="italic font-bold px-5">
                        Filtros:
                    </span>
                    <div class="flex">
                        <Tag class="phone:text-sm tablet:text-base" title="Relanded" v-if="relanded" v-model="relanded" @click="unSetReturn()" />
                        <Tag class="phone:text-xs tablet:text-base" title="This month" />
                        <Tag class="phone:text-xs tablet:text-base" title="Last Month" />
                    </div>
                    <!--    <Tag title="" /> -->
                </div>

                <DataTable :header="headers" :data="returns" :configTable="configTable"
                    @open-context="handleContextMenu" />

                <Modal v-if="modalReturn" @close="modalReturn = false, creationReturn = true">
                    <template v-slot:header>
                        <div v-if="creationReturn">
                            Creation Return
                        </div>
                        <div v-else>
                            Return, Quotation {{ returnSelected.quotation_serial.toString(36) }}
                        </div>
                    </template>

                    <template v-slot:body>
                        <ReturnCreationForm :return="returnSelected" @update="updateFinal"
                            :creation="creationReturn" :editing="editingReturn" />
                    </template>

                    <template v-slot:actions>
                        <div v-if="creationReturn" class="flex w-full">
                            <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                                @click="modalReturn = false; unSetReturn()" />
                            <Button exactColor color="primary" icon="save" content="Guardar"
                                @click="addNewReturn()" />
                        </div>
                        <div v-if="editingReturn" class="flex w-full">
                            <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                                @click="modalReturn = false; unSetReturn()" />
                            <Button exactColor color="primary" icon="update" content="Actualizar"
                                @click="updateChangesReturn()" />
                        </div>
                    </template>
                </Modal>
                <ContextMenu class="right-click-menu" @close="contextMenuData.show = false" :top="contextMenuData.top"
                    :left="contextMenuData.left" v-if="contextMenuData.show && editPer">
                    <template v-slot:options>
                        <div @click="close(); viewDetail()">
                            Ver detalle
                        </div>
                        <div @click="close(); editReturn()">
                            Edit
                        </div>
                    </template>
                </ContextMenu>
            </div>
        </template>
    </Header2>
</template>

<script lang="ts" setup>
import Header2 from '@/components/Header2.vue';
import language from '@/services/language';
import { getReturn, getReturnDetail, createReturn, updateReturn } from '@/services/accounting'
import { Button, Modal, Input, Alert } from '@/components/Generics/generics';
import { editPer, writePer } from '@/composables/permissions';
import { onBeforeMount, onMounted, onUnmounted, computed, ref, type Ref, type ComputedRef, watch } from 'vue';
import { useAuthStore } from '@/stores/auth'
import type { returnScheme, token } from '@/schemas';
import DataTable from '@/components/datatable/DataTable.vue';
import ReturnCreationForm from '@/components/ReturnCreationForm.vue';
import ContextMenu from '@/components/context/ContextMenu.vue';
import socket from '@/composables/socket';
import { setHelper } from '@/composables/sidebarStatus';
import { alertMessageApp} from '@/composables/alertFunction'
import { useRouter } from 'vue-router';
import Tag from '@/components/Generics/Tag.vue';

const router = useRouter()
const strings = {
    title: {
        Spanish: "Devoluciones",
        English: "Returnings"
    },
    newReturn: {
        Spanish: "Agregar",
        English: "Add"
    },
    search: {
        Spanish: "Buscar ...",
        English: "Search ..."
    },
    name: {
        Spanish: "Nombre",
        English: "Name"
    },
    contact: {
        Spanish: "Contacto",
        English: "Contact"
    },
    telf: {
        Spanish: "Teléfono",
        English: "Phone"
    },
    noData: {
        Spanish: "No hay devoluciones registrados con estos parámetros",
        English: "There aren't returns registered"
    }
}
const alertMessage = (title: string, description: string, type: string) => {
    alertMessageApp.value = {
        title,
        description,
        type,
        show: true
    }
    setTimeout(() => {
        alertMessageApp.value.show = false
    }, 3000);
}
const returnCache = {
    id: '',
    user_id: '',
    quotation_serial: '',
    return_date: null,
    detail: ''
}
const returnSelected: Ref<returnScheme | any> = ref(returnCache)

const returns: Ref<Array<returnScheme>> = ref([])

const relanded: Ref<boolean> = ref(router.currentRoute.value.query.action ? true : false)

// Creating section functions 
const unSetReturn = () => {
    if (router.currentRoute.value.query.id) {
        let query = Object.assign({}, router.currentRoute.value.query);
        delete query.id;
        delete query.action;
        router.replace({ query });
        listReturns()
    }
    returnSelected.value = returnCache
}

const updateFinal = (event: any) => {
    returnSelected.value = event
}
const contextMenuData: Ref<{ left: number, top: number, show: boolean }> = ref({
    left: 0,
    top: 0,
    show: false
})
const modalReturn: Ref<boolean> = ref(false)
const close = () => { contextMenuData.value.show = false }
const store = useAuthStore()
const creationReturn: Ref<boolean> = ref(true)
const editingReturn: Ref<boolean> = ref(false)

onBeforeMount(async () => {
    if (router.currentRoute.value.query.id && router.currentRoute.value.query.action == '1') {
        modalReturn.value = true
        returnSelected.value = {}
        creationReturn.value = true
        editingReturn.value = false
    }
    await listReturns()
})

const cancelToken: Ref<AbortController | undefined> = ref()
const filter: Ref<string> = ref('')

const listReturns = async () => {

    if (cancelToken.value != undefined) {
        cancelToken.value.abort()
    }

    cancelToken.value = new AbortController();
    let filters: any = {}
    if (router.currentRoute.value.query.id && router.currentRoute.value.query.action == '0' && relanded.value) {
        console.log(router.currentRoute.value.query)
        filters['q.id'] = router.currentRoute.value.query.id
    }

    let { data } = await getReturn((store.getUser.token as token).value, { 'c.name': filter.value, ...filters }, cancelToken.value.signal)
    if (!data) return
    cancelToken.value = undefined
    returns.value = data
    console.log(returns)
}

onMounted(() => {
    socket.socket?.on('returnCreate', (body: returnScheme) => {
        returns.value.unshift(body)
    })
    socket.socket?.on('returnUpdate', (body: returnScheme) => {
        console.log('Return actualizado ws', body)
        let returnToChange = returns.value.find((returning) => returning.id == body.id)
        if (returnToChange) {
            returnToChange.return_date = body.return_date
        }
    })
})

onUnmounted(() => {
    socket.socket?.removeListener("returnCreate")
    socket.socket?.removeListener("returnUpdate")
})

const configTable = ref({
    color: 'black',
    dropdown: false
})

const headers = ref([
    { title: 'Cot.', accesor: 'quotation_serial', config: { hex: true }, sort: true, sortDirection: 'up', width: 'phone:w-[20%] tablet:w-[10%] phone:flex' },
    { title: 'Cliente', accesor: 'name', sort: true, sortDirection: 'up', width: 'phone:w-[70%] tablet:w-[40%] phone:flex' },
    { title: 'Retorno en tienda', accesor: 'return_date', config: { dateTimeFormat: true }, sort: true, sortDirection: 'up', width: 'phone:w-[35%] tablet:w-[40%] tablet:flex phone:hidden' },
    { title: '', accesor: '', sort: false, sortDirection: 'up', width: 'phone:w-[10%] tablet:w-[10%] phone:flex justify-end' }
])


const handleContextMenu = (body: any) => {
    const event: PointerEvent = body.event
    const item: returnScheme = body.item

    setHelper(false)
    contextMenuData.value.left = event.x
    contextMenuData.value.top = event.y
    contextMenuData.value.show = true

    returnSelected.value = item
}


const viewDetail = async () => {
    console.log(returnSelected)
    let { data } = await getReturnDetail((store.getUser.token as token).value, { id: returnSelected.value.id })
    returnSelected.value.detail = data
    creationReturn.value = false
    editingReturn.value = false
    modalReturn.value = true
}

const editReturn = async () => {
    console.log(returnSelected)
    let { data } = await getReturnDetail((store.getUser.token as token).value, { id: returnSelected.value.id })
    returnSelected.value.detail = data
    editingReturn.value = true
    creationReturn.value = false
    modalReturn.value = true
}

const addNewReturn = async () => {
    if (!returnSelected.value.quotation_id || !returnSelected.value.detail) {
        alertMessage('Faltan datos',
            'Debes seleccionar una cotización y productos a devolver',
            'error');
        return
    } else {
        let productResult = returnSelected.value.detail.find((product:any) => product.amount > 0)
        if (!productResult) {
            console.log(returnSelected)
            alertMessage('Faltan datos',
            'Debes llenar productos a devolver',
            'error');
            return
        } else {
            //Find if any product missing to return amount
            let returnCompleted = returnSelected.value.detail.find((product:any) => product.dispatching != (product.returning + product.amount))
            if (!returnCompleted) {
                returnSelected.value.isCompleted = true
            } else {
                returnSelected.value.isCompleted = false
            }
            
            returnSelected.value.products = []
            let products = returnSelected.value.detail
            for (const product of products) {
                if (product.amount != 0) {
                    const productToReturn = {
                        quotation_detail_id: product.id,
                        amount: product.amount
                    }
                    returnSelected.value.products.push(productToReturn)
                }
            }
            returnSelected.value.created_by = store.getUser.id
            console.log(returnSelected.value)
            let creationResult = await createReturn((store.getUser.token as token).value, returnSelected.value)
            if (creationResult.status == 200) {
                modalReturn.value = false
                alertMessage(`Proceso completado`,
                'Devolucion hecha',
                'success');
                unSetReturn()
            }
        }
    }
}

const updateChangesReturn = async () => {
    const result = await updateReturn((store.getUser.token as token).value, returnSelected.value)
    if (result.status == 200) {
        modalReturn.value = false
        unSetReturn()
    }
}

</script>