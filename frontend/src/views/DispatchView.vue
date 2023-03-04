<template>
    <Header2>
        <template v-slot:mainContainer>
            <div class="p-10 flex flex-col items-start min-h-[70vh]">
                <div
                    class="pb-4 flex tablet:flex-row justify-between items-center w-full phone:flex-col phone:items-start">
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
                        <Button v-if="writePer && macros.quote && macros.dispatch"
                            @click="modalDispatch = true, dispatchSelected = {}, creationDispatch = true, editingDispatch = false"
                            exactColor color="secondary" icon="Add" :content=strings.newDispatch[language] />
                    </div>
                </div>
                <Input class="my-2 px-2 tablet:w-1/2 phone:w-full rounded-lg border-solid outline-secondary"
                    :placeholder=strings.search[language] :label=strings.search[language] v-model="filter"
                    @update:model-value="listDispatchs()" />

                <div class="flex items-center flex-wrap">
                    <span class="italic font-bold px-5">
                        Filtros:
                    </span>
                    <Tag title="Relanded" v-if="relanded" v-model="relanded" @click="unSetDispatch()" />
                    <Tag title="This month" v-model="dates.thisMonth" @update:model-value="listDispatchs"/>
                    <Tag title="Last Month" v-model="dates.lastMonth" @update:model-value="listDispatchs"/>
                    <!--    <Tag title="" /> -->
                </div>

                <DataTable :header="headers" :data="dispatchs" :configTable="configTable"
                    @open-context="handleContextMenu" />

                <Modal v-if="modalDispatch" @close="modalDispatch = false, creationDispatch = true">
                    <template v-slot:header>
                        <div v-if="creationDispatch">
                            Creation Dispatch
                        </div>
                        <div v-else>
                            <span v-if="dispatchSelected.quotation_serial">
                                Dispatch, Quotation {{ formatSerial(dispatchSelected.quotation_serial) }}
                            </span>
                            <span v-else>
                                <span class="font-bold">
                                    Dispatch {{ formatSerial(dispatchSelected.id) }} 
                                </span>
                                <br> 
                                <span class="italic text-2xl">
                                    Serial del flujo: {{ formatSerial(dispatchSelected.quotation_id) }}
                                </span>
                            </span>
                        </div>
                    </template>

                    <template v-slot:body>
                        <DispatchCreationForm :dispatch="dispatchSelected" @update="updateFinal"
                            :creation="creationDispatch" :editing="editingDispatch" ref="dispatchCreationForm" :partners="partners"/>
                    </template>

                    <template v-slot:actions>
                        <div v-if="creationDispatch" class="flex w-full">
                            <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                                @click="modalDispatch = false; unSetDispatch()" />
                            <Button exactColor color="primary" icon="save" content="Guardar"
                                @click="addNewDispatch()" />
                        </div>
                        <div v-if="editingDispatch" class="flex w-full">
                            <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                                @click="modalDispatch = false; unSetDispatch()" />
                            <Button exactColor color="primary" icon="update" content="Actualizar"
                                @click="updateChangesDispatch()" />
                        </div>
                    </template>
                </Modal>
                <ContextMenu class="right-click-menu" @close="contextMenuData.show = false" :top="contextMenuData.top"
                    :left="contextMenuData.left" v-if="contextMenuData.show && editPer">
                    <template v-slot:options>
                        <div @click="close(); viewDetail()">
                            Ver detalle
                        </div>
                        <div @click="showDispatch()">
                            Visualizar
                        </div>
                        <div @click="close(); editDispatch()">
                            Edit
                        </div>
                        <div v-if="dispatchSelected.out_store == null" @click="setOutStore">
                            Saliendo de bodega
                        </div>
                        <div v-if="dispatchSelected.received == null" @click="setReceived">
                            Entregado en obra
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
import { getDispatch, getDispatchDetail, createDispatch, updateDispatch, formatSerial } from '@/services/accounting'
import { Button, Modal, Input } from '@/components/Generics/generics';
import { editPer, macros, writePer } from '@/composables/permissions';
import { onBeforeMount, onMounted, onUnmounted, computed, ref, type Ref, type ComputedRef, watch } from 'vue';
import { useAuthStore } from '@/stores/auth'
import type { dispatchDetailSchema, dispatchScheme, partnerSchema, token } from '@/schemas';
import DataTable from '@/components/datatable/DataTable.vue';
import DispatchCreationForm from '@/components/DispatchCreationForm.vue';
import ContextMenu from '@/components/context/ContextMenu.vue';
import socket from '@/composables/socket';
import { alertMessageApp} from '@/composables/alertFunction'
import { setHelper } from '@/composables/sidebarStatus';
import { useRouter } from 'vue-router';
import Tag from '@/components/Generics/Tag.vue';
import moment from 'moment';
import { getPartners } from '@/services/partners';
import { setDocumentViewerAttributes } from '@/composables/documentViewer';
import { dispatchURL } from '@/config';

const router = useRouter()
const strings = {
    title: {
        Spanish: "Remisiones",
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

const dates = ref({
    thisMonth: true,
    lastMonth: false
})
const dispatchCache = {
    id: '',
    user_id: '',
    quotation_serial: '',
    out_store: null,
    received: null,
    detail: ''
}
const dispatchSelected: Ref<dispatchScheme | any> = ref(dispatchCache)
let dispatchFinal = {}
const dispatchCreationForm  = ref()

const dispatchs: Ref<Array<dispatchScheme>> = ref([])

const relanded: Ref<boolean> = ref(router.currentRoute.value.query.action ? true : false)

// Creating section functions 
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
const unSetDispatch = () => {
    if (router.currentRoute.value.query.id) {
        let query = Object.assign({}, router.currentRoute.value.query);
        delete query.id;
        delete query.action;
        router.replace({ query });
        listDispatchs()
    }
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
const partners: Ref<partnerSchema[]> = ref([])

onBeforeMount(async () => {
    if (router.currentRoute.value.query.id && router.currentRoute.value.query.action == '1') {
        modalDispatch.value = true
        dispatchSelected.value = {}
        creationDispatch.value = true
        editingDispatch.value = false
    }
    listingPartners()
    await listDispatchs()
})

const showDispatch = () => {
    contextMenuData.value.show = false
    setDocumentViewerAttributes(
        'Remisión '+ formatSerial(dispatchSelected.value.id),
        dispatchURL + dispatchSelected.value.id
    )
}

const listingPartners = async () => {
    const token: token = store.getUser.token as token
    let {data} = await getPartners(token.value, { 'p.name': '' }, new AbortController().signal)
    partners.value = data
}

const cancelToken: Ref<AbortController | undefined> = ref()
const filter: Ref<string> = ref('')

const listDispatchs = async () => {

    if (cancelToken.value != undefined) {
        cancelToken.value.abort()
    }

    cancelToken.value = new AbortController();
    let filters: any = {}

    if(dates.value.thisMonth && dates.value.lastMonth){
        filters = {
            date: 'created_at',
            min_date: moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
            max_date: moment().endOf('month').format('YYYY-MM-DD')
        }
    }else if(dates.value.thisMonth){
        filters = {
            date: 'created_at',
            min_date: moment().startOf('month').format('YYYY-MM-DD'),
            max_date: moment().endOf('month').format('YYYY-MM-DD')
        }
    }else if(dates.value.lastMonth){
        filters = {
            date: 'created_at',
            min_date: moment().add(-1, 'month').startOf('month').format('YYYY-MM-DD'),
            max_date: moment().add(-1, 'month').endOf('month').format('YYYY-MM-DD')
        }
    }

    if (router.currentRoute.value.query.id && router.currentRoute.value.query.action == '0' && relanded.value) {
        console.log('query',router.currentRoute.value.query)
        filters['q.id'] = router.currentRoute.value.query.id
    }

    let { data } = await getDispatch((store.getUser.token as token).value, { 'c.name': filter.value, ...filters }, cancelToken.value.signal)
    cancelToken.value = undefined
    if (!data) {
        dispatchs.value = []
        return
    }
    dispatchs.value = data
    console.log(dispatchs)
}

onMounted(() => {
    socket.socket?.on('dispatchCreate', (body: dispatchScheme) => {
        if(dispatchs.value.length > 0){
            //
        }else{
            dispatchs.value = []
        }
        dispatchs.value.unshift(body)
    })
    socket.socket?.on('dispatchUpdate', (body: dispatchScheme) => {
        console.log('Dispatch actualizado ws', body)
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
    { title: 'Cot.', accesor: 'quotation_serial', config: { hex: true }, sort: true, sortDirection: 'up', width: 'phone:w-[20%] tablet:w-[10%] phone:flex' },
    { title: 'Cliente', accesor: 'name', sort: true, sortDirection: 'up', width: 'phone:w-[35%] tablet:w-[30%] phone:flex' },
    { title: 'Salida de la tienda', accesor: 'out_store', config: { dateTimeFormat: true }, sort: true, sortDirection: 'up', width: 'phone:w-[35%] tablet:w-[25%] phone:flex' },
    { title: 'Recibida', accesor: 'received', config: { dateTimeFormat: true }, sort: true, sortDirection: 'up', width: 'tablet:w-[25%] tablet:flex phone:hidden' },
    { title: '', accesor: '', sort: false, sortDirection: 'up', width: 'phone:w-[10%] tablet:w-[10%] phone:flex' }
])


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
    let { data } = await getDispatchDetail((store.getUser.token as token).value, { id: dispatchSelected.value.id }) 
    
    console.log('detail', data)
    
    
    dispatchSelected.value.detail = (data as dispatchDetailSchema)
    creationDispatch.value = false
    modalDispatch.value = true
}

const editDispatch = async () => {
    console.log(dispatchSelected)
    let { data } = await getDispatchDetail((store.getUser.token as token).value, { id: dispatchSelected.value.id })
    dispatchSelected.value.detail = data
    editingDispatch.value = true
    creationDispatch.value = false
    modalDispatch.value = true
}

const addNewDispatch = async () => {
    console.log('form', dispatchCreationForm.value.userToSend, 
    dispatchCreationForm.value.contactToReceive)
    console.log(dispatchSelected.value)

    if (!dispatchSelected.value.quotation_id || !dispatchSelected.value.detail) {
        alertMessage('Faltan datos',
            'Debes seleccionar una cotización y productos a entregar',
            'error');
        console.error('cotización y productos')
        return
    } else {
        let productResult = dispatchSelected.value.detail.find((product:any) => {
            if(product.amount > 0){
                return true
            }
            const anyPartner = (product?.partners as any[])?.filter(pdto => pdto.amount > 0)
            if(anyPartner.length > 0){
                return true
            }
            return false
        })
        if (!productResult) {
            alertMessage('Faltan datos',
            'Debes llenar productos a entregar',
            'error');
            console.error('cantidad de productos')
            return
        } else {
            //Find if any product missing to dispatch amount
            let dispatchCompleted = dispatchSelected.value.detail.find((product:any) => product.amount_avaliable != (product.dispatching + product.amount))
            if (!dispatchCompleted) {
                dispatchSelected.value.isCompleted = true
            } else {
                dispatchSelected.value.isCompleted = false
            }

            
            if (!(await validateDate())) {
                alertMessage('Error en fechas',
                'La fecha de recibido debe ser despues a la de salida de tienda',
                'error');
                console.error('fecha de recibido')
                return
            }
            delete dispatchSelected.value.check_out
            delete dispatchSelected.value.check_received

            dispatchSelected.value.products = []
            let products = dispatchSelected.value.detail
            for (const product of products) {
                const anyPartner = (product?.partners as any[])?.filter(pdto => pdto.amount > 0)
                if (product.amount != 0 || anyPartner.length > 0) {
                    const productToDispatch = {
                        quotation_detail_id: product.detail_id,
                        amount: product.amount,
                        item_id: product.item_id,
                        partners: (product?.partners as any[])?.map(pdto => {
                            return {
                                amount: pdto.amount,
                                partner_id: pdto.partner_id
                            }
                        })
                    }
                    dispatchSelected.value.products.push(productToDispatch)
                }
            }
            dispatchSelected.value.created_by = store.getUser.id
            const payload = {
                ...dispatchSelected.value,
                contact_received: dispatchCreationForm.value.contactToReceive.contact.id ?? null,
                plate: dispatchCreationForm.value.userToSend.plate ?? '',
                user_sent: dispatchCreationForm.value.userToSend.user.id ?? null,
                name_sent: dispatchCreationForm.value.userToSend.name ?? '',
                client_id: dispatchCreationForm.value.quotation.client_id ?? null
            }
            let creationResult = await createDispatch((store.getUser.token as token).value, payload)
            if (creationResult.status == 200) {
                modalDispatch.value = false
                alertMessage(`Proceso completado`,
                'Entrega creada',
                'success');
                unSetDispatch()
            }
        }
    }
    
}

const validateDate = async (): Promise<boolean> => {
    //Validate dates 
    if(!dispatchSelected.value.check_received) dispatchSelected.value.received = null
    if (dispatchSelected.value.received == null || dispatchSelected.value.out_store == null) {
        return true
    } else {
        return moment(dispatchSelected.value.received).isAfter(dispatchSelected.value.out_store)
    }
    
}

const dispatching = () => {
    dispatchSelected.value.out_store = moment().format('YYYY-MM-DD HH:ii:ss')
}

const updateChangesDispatch = async () => {
    if (dispatchSelected.value.out_store == "Invalid date" && dispatchSelected.value.received == "Invalid date") {
        alertMessage('Debes diligenciar las fechas correctamente',
            '',
            'error');
        return
    }

    if(dispatchSelected.value.out_store == "Invalid date") dispatchSelected.value.out_store = null
    if(dispatchSelected.value.received == "Invalid date") dispatchSelected.value.received = null

    if (!(dispatchSelected.value.received == null || dispatchSelected.value.out_store == null)) {
        const isAfter = moment(dispatchSelected.value.received).isAfter(dispatchSelected.value.out_store)
        if (!isAfter) {
            alertMessage('Error en fechas',
            'La fecha de recibido debe ser despues a la de salida de tienda',
            'error');
            return
        }
    }
    

    const result = await updateDispatch((store.getUser.token as token).value, dispatchSelected.value)
    if (result.status == 200) {
        modalDispatch.value = false
        unSetDispatch()
    }
}

const setOutStore = async () => {
    console.log(dispatchSelected.value)
    const payload = {
        id: dispatchSelected.value.id,
        out_store: moment().format('YYYY-MM-DD HH:mm:ss'),
        discount: true
    }
    const result = await updateDispatch((store.getUser.token as token).value, payload)
    contextMenuData.value.show = false
}

const setReceived = async () => {
    console.log(dispatchSelected.value)
    const payload = {
        id: dispatchSelected.value.id,
        out_store: moment(dispatchSelected.value.out_store).format('YYYY-MM-DD HH:mm:ss'),
        received: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    const result = await updateDispatch((store.getUser.token as token).value, payload)
    contextMenuData.value.show = false
}

</script>