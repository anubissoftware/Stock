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
                            {{ clients.length + " " + strings.title[language] }}
                        </div>
                    </h1>
                    <div class="flex h-fit ">
                        <Button v-if="writePer" exactColor color="secondary" icon="Add" :content=strings.newClient[language]
                            @click="unSetClient(); modalClientOpen = true" />
                    </div>
                </div>
                <Input class="my-2 px-2 tablet:w-1/2 phone:w-full rounded-lg border-solid outline-secondary"
                    :placeholder=strings.search[language] :label=strings.search[language] v-model="filter" 
                    @update:model-value="listClients()" v-if="writePer"/>
    
                <DataTable :header="headers" :data="clients" :configTable="configTable" @open-context="handleContextMenu" />
    
                <Modal v-if="modalClientOpen" @close="modalClientOpen = false">
                    <template v-slot:header>
                        <div v-if="isClientCreated">
                            Editar el cliente {{ clientSelected.name }}
                        </div>
                        <div v-else>
                            Crear cliente
                        </div>
                    </template>
    
                    <template v-slot:body>
                        <ClientCreationForm :client="clientSelected" @update="updateFinal" />
                    </template>
    
                    <template v-slot:actions>
                        <div class="flex w-full">
                            <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                                @click="modalClientOpen = false; unSetClient()" />
                            <Button exactColor color="primary" icon="save" content="Guardar" @click="addNewClient()" />
                        </div>
                    </template>
                </Modal>
                <ContextMenu class="right-click-menu" @close="contextMenuData.show = false" :top="contextMenuData.top"
                    :left="contextMenuData.left" v-if="contextMenuData.show && editPer">
                    <template v-slot:options>
                        <div @click="close(); editClient()">
                            Edit client data
                        </div>
                        <div @click="close(); openHelper()" v-if="projects">
                            Search for projects
                        </div>
                        <div @click="close(); createQuotation()" v-if="quotate">
                            Crear cotización
                        </div>
                        <div @click="close(); removeClient()">
                            Delete client
                        </div>
                    </template>
                </ContextMenu>
            </div>
        </template>
        <template v-slot:helperContainer>
            <ClientProjects :client="clientSelected"/>
        </template>
    </Header2>
</template>

<script lang="ts" setup>
import Header2 from '@/components/Header2.vue';
import language from '@/services/language';
import { Button, Modal, Input } from '@/components/Generics/generics';
import { editPer, writePer, quotate, projects } from '@/composables/permissions';
import { onBeforeMount, onMounted, onUnmounted, computed, ref, type Ref, type ComputedRef, watch } from 'vue';
import { getClients } from '@/services/clients'
import type { clientEnterpriseSchema, token } from '@/schemas'
import DataTable from '@/components/datatable/DataTable.vue';
import ClientCreationForm from '@/components/ClientCreationForm.vue';
import { modalComp } from '@/classes/Modal';
import ContextMenu from '@/components/context/ContextMenu.vue';
import { addClients, removeClient as removeClientService,
editClient as editClientService } from '@/services/clients'
import socket from '@/composables/socket'
import { setHelper, sidebarStatus } from '@/composables/sidebarStatus';
import ClientProjects from '@/components/ClientProjects.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const strings = {
    title: {
        Spanish: "Clientes",
        English: "Clients"
    },
    newClient: {
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
        Spanish: "No hay clientes registrados con estos parámetros",
        English: "There aren't clients registered"
    }
}
const clientCache = {
    name: '',
    type: 0,
    nit: '',
    email: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    rut: {
        name: '',
        info: ''
    }
}
let clientFinal = {}
const contextMenuData: Ref<{ left: number, top: number, show: boolean }> = ref({
    left: 0,
    top: 0,
    show: false
})
const clientSelected: Ref<clientEnterpriseSchema | any> = ref(clientCache)
const isClientCreated: ComputedRef<boolean> = computed(() => {
    return clientSelected.value.id
})
const modalClientOpen: Ref<boolean> = ref(false)
const close = () => { contextMenuData.value.show = false }
const auth = useAuthStore()

watch(
    () => sidebarStatus.helper,
    () => {
        if(sidebarStatus.helper == true){
            socket.socket?.on('projects' + clientSelected.value.id, (body) => {
                console.log(body)
            })
        }else{
            socket.socket?.removeListener('projects' + clientSelected.value.id)
        }
    },
    {deep: true}
)

onBeforeMount(async () => {
    await listClients()
})

const cancelToken: Ref<AbortController | undefined> = ref()

const listClients = async () => {

    if(cancelToken.value != undefined){
        cancelToken.value.abort()
    }

    cancelToken.value = new AbortController();

    let { data } = await getClients((auth.getUser.token as token).value, filter.value, cancelToken.value.signal)
    if(!data) return
    cancelToken.value = undefined
    let clientList: Array<clientEnterpriseSchema> = data
    clientList = clientList.map((client) => {
        client.rut = {
            name: client.filename ?? '',
            info: ((client.host ?? '') + (client.path ?? '') + (client.filename ?? ''))
        }
        return client
    })
    auth.setClients(clientList)
}

onMounted(() => {
    socket.socket?.on('clientCreated', (body: clientEnterpriseSchema) => {
        auth.addClient(body)
    })
    
    socket.socket?.on('clientDeleted', (body: {id: number}) => {
        auth.removeClient(body)
    })
})

onUnmounted(() => {
    socket.socket?.removeListener("clientCreated")
    socket.socket?.removeListener("clientDeleted")
})

const clients: ComputedRef<Array<clientEnterpriseSchema>> = computed(() => {
    let clients: Array<clientEnterpriseSchema> = auth.getClients

    clients = clients.filter(cli => cli.name.toLocaleLowerCase().includes(filter.value.toLocaleLowerCase()))

    return clients
})
const configTable = ref({
    color: 'black',
    dropdown: false
})
const headers = ref([
    { title: strings.name[language.value], accesor: 'name', sort: true, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[35%] tablet:flex phone:block' },
    { title: strings.contact[language.value], accesor: 'contact_name', sort: true, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[35%] tablet:flex phone:hidden' },
    { title: strings.telf[language.value], accesor: 'contact_phone', sort: true, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[20%] tablet:flex phone:block' },
    { title: '', accesor: '', sort: false, sortDirection: 'up', width: 'phone:w-[10%] tablet:w-[10%] tablet:flex phone:block' },
])

const filter: Ref<string> = ref('')

const unSetClient = () => {
    clientSelected.value = clientCache
}

const editClient = () => {
    modalClientOpen.value = true
}

const updateFinal = (event: any) => {
    clientFinal = event
}

const addNewClient = () => {
    console.log(clientFinal)
    modalComp.modal.show({
        title: clientSelected.value.id ? 'Actualizar registro' : 'Nuevo registro',
        description: clientSelected.value.id ? '¿Desea actualizar el cliente?' : '¿Desea guardar el nuevo cliente?',
        input: false,
        inputValue: '',
        inputInfo: {
            label: 'amount'
        }
    }).then(async (r) => {
        if (r.success) {
            let res
            if(clientSelected.value.id){
                res = await editClientService((auth.getUser.token as token).value, clientFinal as clientEnterpriseSchema)
            }else{
                res = await addClients((auth.getUser.token as token).value, clientFinal as clientEnterpriseSchema)
            }
            if (res?.data.ok) {
                modalClientOpen.value = false
            } else {
                modalComp.modal.show({
                    title: 'Error guardando',
                    description: 'Ha ocurrido un error al almacenar el cliente, intente nuevamente o póngase en contacto con su proveedor.',
                    input: false,
                    inputValue: '',
                    inputInfo: {
                        label: 'amount'
                    }
                })
            }
        }
    })
}

const createQuotation = () => {
    router.push({path: '/dashboard/mystock', query: {quote: 1, client: clientSelected.value.id}})
}

const removeClient = () => {
    modalComp.modal.show({
        title: 'Eliminar registro',
        description: `¿Desea eliminar el registro del cliente <strong>${clientSelected.value.name}</strong>?`,
        input: false,
        inputValue: '',
        inputInfo: {
            label: 'amount'
        }
    }).then(async (r) => {
        if (r.success) {
            const res = await removeClientService((auth.getUser.token as token).value, {id: clientSelected.value.id})
            if (res.data.ok) {
                contextMenuData.value.show = false
            } else {
                modalComp.modal.show({
                    title: 'Error guardando',
                    description: 'Ha ocurrido un error al almacenar el cliente, intente nuevamente o póngase en contacto con su proveedor.',
                    input: false,
                    inputValue: '',
                    inputInfo: {
                        label: 'amount'
                    }
                })
            }
        }
    })
}

const openHelper = () => {
    setHelper(true)
}

const handleContextMenu = (body: any) => {
    const event: PointerEvent = body.event
    const item: clientEnterpriseSchema = body.item

    setHelper(false)
    contextMenuData.value.left = event.x
    contextMenuData.value.top = event.y
    contextMenuData.value.show = true

    clientSelected.value = item
}

</script>

