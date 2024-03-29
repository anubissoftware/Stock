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
                            {{ partners.length + " " + strings.title[language] }}
                        </div>
                    </h1>
                    <div class="flex h-fit ">
                        <Button v-if="writePer"
                            @click="modalPartner = true, partnerSelected = {...partnerCache}, creationPartner = true, editingPartner = false"
                            exactColor color="secondary" icon="Add" :content=strings.new[language] />
                    </div>
                </div>
                <!-- Search -->
                <Input class="my-2 px-2 tablet:w-1/2 phone:w-full rounded-lg border-solid outline-secondary"
                    :placeholder=strings.search[language] :label=strings.search[language] v-model="filter"
                    @update:model-value="listPartners()" />
                <DataTable :header="headers" :data="partners" :configTable="configTable"
                    @open-context="handleContextMenu" />
                <ContextMenu class="right-click-menu" @close="contextMenuData.show = false" :top="contextMenuData.top"
                    :left="contextMenuData.left" v-if="contextMenuData.show && editPer">
                    <template v-slot:options>
                        <div @click="close(),edit()">
                            Edit
                        </div>
                        <div @click="close(),remove()">
                            Delete
                        </div>
                    </template>
                </ContextMenu>
                <Modal v-if="modalPartner" @close="modalPartner = false, creationPartner = true">
                    <template v-slot:header>
                        <div v-if="creationPartner">
                            Creation Partner
                        </div>
                        <div v-else>
                            Partner editr
                        </div>
                    </template>
                    <template v-slot:body>
                        <div class="flex flex-col w-full justify-center items-center gap-6">
                            <Input class=" w-full " color="black" :placeholder="'Nombre'" :label="'Nombre'" size="md" type="text" v-model="partnerSelected.name"/>
                            <Input class=" w-full " color="black" :placeholder="'Nit'" :label="'Nit'" size="md" type="number" v-model="partnerSelected.nit"/>
                            <Input class=" w-full " color="black" :placeholder="'Sigla'" :label="'Sigla'" size="md" type="text" v-model="partnerSelected.sigla"/>
                            <span v-if="hintForm.active" class="phone:text-sm tablet:text-md text-red-600" >
                                {{ hintForm.message }}
                            </span>
                        </div>
                    </template>
                    <template v-slot:actions>
                        <Button exactColor color="third" class="mr-2" content="Cancelar"
                            @click="modalPartner = false; unSetPartner()" />
                        <Button exactColor color="primary" :icon="creationPartner ? 'save' : 'update'" :content="creationPartner ? 'Crear' : 'Actualizar'"
                            @click="actionPartner()" />
                    </template>
                </Modal>
            </div>
        </template>
    </Header2>
</template>

<script lang="ts" setup>
import Header2 from '@/components/Header2.vue';
import language from '@/services/language';
import { editPer, writePer } from '@/composables/permissions';
import { alertMessageApp} from '@/composables/alertFunction';
import { Button, Modal, Input, Alert, Tag} from '@/components/Generics/generics';
import type { partnerSchema } from '@/schemas/partnerSchema';
import { onBeforeMount, onMounted, onUnmounted, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import DataTable from '@/components/datatable/DataTable.vue';
import ContextMenu from '@/components/context/ContextMenu.vue';
import socket from '@/composables/socket';
import { setHelper } from '@/composables/sidebarStatus';
import moment from 'moment';
import type { token } from '@/schemas';
import { getPartners, createPartners, updatePartners } from '@/services/partners'
import { modalComp, type modalResponse, type promiseResponse } from '@/classes/Modal';
import { subscribe, unsubscribe } from '@/suscribers/partnerSuscriber';
const router = useRouter()
const strings = {
    title: {
        Spanish: "Socios",
        English: "Partners"
    },
    new: {
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
const partnerCache: partnerSchema = {
    id: 0,
    name: '',
    nit: '',
    sigla: '',
}
const partnerSelected: Ref<partnerSchema | any> = ref(partnerCache)
const partners: Ref<Array<partnerSchema>> = ref([])
const relanded: Ref<boolean> = ref(router.currentRoute.value.query.action ? true : false)
const dates = ref({
    thisMonth: true,
    lastMonth: false
})

const contextMenuData: Ref<{ left: number, top: number, show: boolean }> = ref({
    left: 0,
    top: 0,
    show: false
})
const modalPartner: Ref<boolean> = ref(false)
const hintForm: Ref<any> = ref({
    active: false,
    message: ''
})
const close = () => { contextMenuData.value.show = false }
const store = useAuthStore()
const creationPartner: Ref<boolean> = ref(true)
const editingPartner: Ref<boolean> = ref(false)
const cancelToken: Ref<AbortController | undefined> = ref()
const filter: Ref<string> = ref('')

const configTable = ref({
    color: 'black',
    dropdown: false
})

const headers = ref([
    { title: 'Sigla', accesor: 'sigla', sort: true, sortDirection: 'up', width: 'phone:w-[35%] tablet:w-[20%] phone:flex' },
    { title: 'Cliente', accesor: 'name', sort: true, sortDirection: 'up', width: 'phone:w-[60%] tablet:w-[40%] phone:flex' },
    { title: 'Nit', accesor: 'nit', sort: true, sortDirection: 'up', width: 'phone:w-[35%] tablet:w-[20%] tablet:flex phone:hidden' },
    { title: '', accesor: '', sort: false, sortDirection: 'up', width: 'phone:w-[10%] tablet:w-[10%] phone:flex justify-end' }
])

/**
 * HOOKS
 */
onBeforeMount(async () => {
    if (router.currentRoute.value.query.id && router.currentRoute.value.query.action == '1') {
        modalPartner.value = true
        partnerSelected.value = {}
        creationPartner.value = true
        editingPartner.value = false
    }
    await listPartners()
})
onMounted(() => {
    subscribe(partners)
})
onUnmounted(() => {
   unsubscribe()
})


/**
 * FUNCTIONS
 */
const unSetPartner = () => {
    if (router.currentRoute.value.query.id) {
        let query = Object.assign({}, router.currentRoute.value.query);
        delete query.id;
        delete query.action;
        router.replace({ query });
        listPartners()
    }
    partnerSelected.value = partnerCache
    creationPartner.value = false
    editingPartner.value = false
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
const handleContextMenu = (body: any) => {
    const event: PointerEvent = body.event
    const item: partnerSchema = body.item

    setHelper(false)
    contextMenuData.value.left = event.x
    contextMenuData.value.top = event.y
    contextMenuData.value.show = true

    partnerSelected.value = item
}

const listPartners = async () => {

    if (cancelToken.value != undefined) {
        cancelToken.value.abort()
    }

    cancelToken.value = new AbortController();
    let filters: any = {}

    let { data } = await getPartners((store.getUser.token as token).value, { 'p.name,p.sigla': filter.value, ...filters }, cancelToken.value.signal)
    cancelToken.value = undefined
    if (!data) {
        partners.value = []
        return
    }
    console.log(data)
    partners.value = data
}

const actionPartner = async () => {
    if (await validateField(partnerSelected.value.name) ||
    await validateField(partnerSelected.value.nit) ||
    await validateField(partnerSelected.value.sigla)) {
        hintForm.value.active = true
        hintForm.value.message = 'Faltan datos'
        return
    }
    hintForm.value = {
        active: false,
        message: ''
    }
    let response;
    if (editingPartner ) {
        const partnerUpdate = {...partnerSelected.value}
        delete partnerUpdate.created_at
        delete partnerUpdate.enterprise
        delete partnerUpdate.showAction
        response = await updatePartners((store.getUser.token as token).value, partnerUpdate)
    } else {
        response = await createPartners((store.getUser.token as token).value, partnerSelected.value)
    }
    if (response.status == 200) {
        modalPartner.value = false
        alertMessage('Correcto', 'Socio creado satisfactoriamente', 'success')
    } else {
        alertMessage('Atención', 'Algo salio mal', 'warning')
    }
    unSetPartner()
}

const validateField = async (field: string) :Promise<boolean> => {
    field = field.toString().trim()
    return !(field != null && field != '')
}

const remove = async () => {
    modalComp.modal.show({
        title: 'Confirmación',
        description: `Desea eliminar el socio ${partnerSelected.value.name}`,
        input: false,
        inputValue: '',
    }).then(async (res: promiseResponse) => {
        if (res.success) {
            const response = await updatePartners((store.getUser.token as token).value, {
                id : partnerSelected.value.id,
                removed : 1,
            })
        }
    })
}

const edit = async () => {
    editingPartner.value = true
    creationPartner.value = false
    modalPartner.value = true
    partnerSelected.value = {...partnerSelected.value}
}


</script>

<style>
</style>
