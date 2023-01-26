<template>
    <Header2>
        <template v-slot:mainContainer>
            <div class="p-10 flex flex-col items-start min-h-[70vh]">
                <div class="pb-4 flex tablet:flex-row justify-between items-center w-full phone:flex-col phone:items-start">
                    <h1 class="flex flex-row justify-center laptop:text-4xl py-2 phone:text-2xl">
                        <span class="text-left">
                            {{ strings.title[language] }}
                        </span>
                        <div
                            class="flex items-center px-2 phone:text-xs tablet:text-sm rounded-xl bg-secondary text-white ml-2">
                            {{ dispatchs.length + " " + strings.title[language] }}
                        </div>
                    </h1>
                    <div class="flex h-fit ">
                        <Button v-if="writePer" 
                        @click="modalDispatch = true, dispatchSelected = {}, creationDispatch = true, editingDispatch = false"  
                        exactColor color="secondary" icon="Add" 
                        :content=strings.newDispatch[language] />
                    </div>
                </div>
                <Input class="my-2 px-2 tablet:w-1/2 phone:w-full rounded-lg border-solid outline-secondary"
                    :placeholder=strings.search[language] :label=strings.search[language] v-model="filter" 
                    @update:model-value="listDispatchs()"/>
    
                <DataTable :header="headers" :data="dispatchs" :configTable="configTable" @open-context="handleContextMenu" />
    
                <Modal v-if="modalDispatch" @close="modalDispatch = false, creationDispatch = true">
                    <template v-slot:header>
                        <div v-if="creationDispatch">
                            Creation Dispatch
                        </div>
                        <div v-else>
                            Dispatch, Quotation {{ dispatchSelected.quotation_serial.toString(36) }}
                        </div>
                    </template>
    
                    <template v-slot:body>
                        <DispatchCreationForm :dispatch="dispatchSelected" @update="updateFinal" :creation="creationDispatch" :editing="editingDispatch" />
                    </template>
    
                    <template v-slot:actions>
                        <div v-if="creationDispatch" class="flex w-full">
                            <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                                @click="modalDispatch = false; unSetDispatch()" />
                            <Button exactColor color="primary" icon="save" content="Guardar" @click="addNewDispatch()" />
                        </div>
                        <div v-if="editingDispatch" class="flex w-full">
                            <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                                @click="modalDispatch = false; unSetDispatch()" />
                            <Button exactColor color="primary" icon="update" content="Actualizar" @click="updateChangesDispatch()" />
                        </div>
                    </template>
                </Modal>
                <ContextMenu class="right-click-menu" @close="contextMenuData.show = false" :top="contextMenuData.top"
                    :left="contextMenuData.left" v-if="contextMenuData.show && editPer">
                    <template v-slot:options>
                        <div @click="close(); viewDetail()">
                            Ver detalle
                        </div>
                        <div @click="close(); editDispatch()">
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
import { getDispatch, getDispatchDetail, createDispatch, updateDispatch } from '@/services/accounting'
import { Button, Modal, Input } from '@/components/Generics/generics';
import { editPer, writePer } from '@/composables/permissions';
import { onBeforeMount, onMounted, onUnmounted, computed, ref, type Ref, type ComputedRef, watch } from 'vue';
import { useAuthStore } from '@/stores/auth'
import type { dispatchScheme, token } from '@/schemas';
import DataTable from '@/components/datatable/DataTable.vue';
import DispatchCreationForm from '@/components/DispatchCreationForm.vue';
import ContextMenu from '@/components/context/ContextMenu.vue';
import socket from '@/composables/socket';
import { setHelper } from '@/composables/sidebarStatus';
import { useRouter } from 'vue-router';

const router = useRouter()
const strings = {
    title: {
        Spanish: "Despachos",
        English: "Dispatchs"
    },
    newDispatch: {
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
        Spanish: "No hay despachos registrados con estos parámetros",
        English: "There aren't dispatchs registered"
    }
}
const dispatchCache = {
    id: '',
    user_id: '',
    quotation_serial: '',
    out_store: null,
    received: null,
    detail: ''
}
const dispatchSelected: Ref<dispatchScheme | any> = ref(dispatchCache)

const dispatchs: Ref<Array<dispatchScheme>> = ref([])

// Creating section functions 
const unSetDispatch = () => {
    dispatchSelected.value = dispatchCache
}

const updateFinal = (event: any) => {
    dispatchSelected.value = event
}
const contextMenuData: Ref<{ left: number, top: number, show: boolean }> = ref({
    left: 0,
    top: 0,
    show: false
})
const isClientCreated: ComputedRef<boolean> = computed(() => {
    return dispatchSelected.value.id
})
const modalDispatch: Ref<boolean> = ref(false)
const close = () => { contextMenuData.value.show = false }
const store = useAuthStore()
const creationDispatch: Ref<boolean> = ref(true) 
const editingDispatch: Ref<boolean> = ref(false) 

onBeforeMount(async () => {
    await listDispatchs()
})

const cancelToken: Ref<AbortController | undefined> = ref()

const listDispatchs = async () => {

    if(cancelToken.value != undefined){
        cancelToken.value.abort()
    }

    cancelToken.value = new AbortController();

    let { data } = await getDispatch((store.getUser.token as token).value, filter.value, cancelToken.value.signal)
    if(!data) return
    cancelToken.value = undefined
    dispatchs.value = data
    console.log(dispatchs)
}

onMounted(() => {
    socket.socket?.on('dispatchCreate', (body: dispatchScheme) => {
        dispatchs.value.unshift(body)
    })
    socket.socket?.on('dispatchUpdate', (body: dispatchScheme) => {
        console.log('Dispatch actualizado ws',body)
        let dispatchToChange = dispatchs.value.find(dispatch => dispatch.id == body.id)
        if (dispatchToChange) {
            dispatchToChange.out_store = body.out_store
            dispatchToChange.received = body.received
        }
    })
})

onUnmounted(() => {
    socket.socket?.removeListener("dispatchChange")
})

const configTable = ref({
    color: 'black',
    dropdown: false
})

const headers = ref([
    { title: 'Ref', accesor: 'quotation_serial', config: { hex: true }, sort: true, sortDirection: 'up', width: 'phone:w-[20%] tablet:w-[20%] tablet:flex phone:block' },
    { title: 'Salida de la tienda', accesor: 'clientout_store_name', config: { timeformat: true }, sort: true, sortDirection: 'up', width: 'phone:w-[80%] tablet:w-[40%] tablet:flex phone:block' },
    { title: 'Recibida', accesor: 'received', config: { timeformat: true }, sort: true, sortDirection: 'up', width: 'phone:w-[40%] tablet:w-[40%] tablet:flex phone:hidden' }
])

const filter: Ref<string> = ref('')

const handleContextMenu = (body: any) => {
    const event: PointerEvent = body.event
    const item: dispatchScheme = body.item

    setHelper(false)
    contextMenuData.value.left = event.x
    contextMenuData.value.top = event.y
    contextMenuData.value.show = true

    dispatchSelected.value = item
}


const viewDetail = async () => {
    console.log(dispatchSelected)
    let {data} = await getDispatchDetail((store.getUser.token as token).value,{id: dispatchSelected.value.id})
    dispatchSelected.value.detail = data
    creationDispatch.value = false
    modalDispatch.value = true
}

const editDispatch = async () => {
    console.log(dispatchSelected)
    let {data} = await getDispatchDetail((store.getUser.token as token).value,{id: dispatchSelected.value.id})
    dispatchSelected.value.detail = data
    editingDispatch.value = true
    creationDispatch.value = false
    modalDispatch.value = true
}

const addNewDispatch = async () => {
    //
    dispatchSelected.value.products = []
    let products = dispatchSelected.value.detail
    for (const product of products) {
        if (product.toDispatch != 0 ) {
            const productToDispatch = {
                quotation_detail_id: product.id,
                amount: product.amount
            }
            dispatchSelected.value.products.push(productToDispatch)
        }
    }
    dispatchSelected.value.created_by = store.getUser.id
    console.log(dispatchSelected.value)
    let creationResult = await createDispatch((store.getUser.token as token).value, dispatchSelected.value )
    if (creationResult.status == 200) {
        modalDispatch.value = false
        unSetDispatch()
    }
}

const updateChangesDispatch = async () => {
    const result = await updateDispatch((store.getUser.token as token).value, dispatchSelected.value )
    if (result.status == 200) {
        modalDispatch.value = false
        unSetDispatch()
    }
}

</script>