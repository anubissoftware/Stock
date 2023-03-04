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
                    <div class="flex gap-3 h-fit ">
                        <Button v-if="writePer" exactColor color="secondary" icon="Add" :content=strings.newClient[language]
                            @click="unSetClient(); modalClientOpen = true" />
                        <Button exactColor size="sm" color="secondary" icon="Link" @click="generateLink()" v-if="false" />
                        <Button exactColor size="sm" color="secondary" content="CSV" icon="scan" @click="readFile()"
                            v-if="auth.getUser.isAdmin == '1'" />
                        <input class="hidden" ref="importFile" type="file"
                            @change="getFile(($event.target as HTMLInputElement).files)" accept=".xlsx,.xls,.csv" />
                    </div>
                </div>
                <Input class="my-2 px-2 tablet:w-1/2 phone:w-full rounded-lg border-solid outline-secondary"
                    :placeholder=strings.search[language] :label=strings.search[language] v-model="filter"
                    @update:model-value="listClients()" v-if="writePer" />

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
                        <div @click="close(); createQuotation()" v-if="macros.quote">
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
            <ClientProjects :client="clientSelected" />
        </template>
    </Header2>
</template>

<script lang="ts" setup>
import Header2 from '@/components/Header2.vue';
import language from '@/services/language';
import { Button, Modal, Input } from '@/components/Generics/generics';
import { editPer, writePer, projects, macros } from '@/composables/permissions';
import { onBeforeMount, onMounted, onUnmounted, computed, ref, type Ref, type ComputedRef, watch } from 'vue';
import { getClients } from '@/services/clients'
import type { clientEnterpriseSchema, token } from '@/schemas'
import DataTable from '@/components/datatable/DataTable.vue';
import ClientCreationForm from '@/components/ClientCreationForm.vue';
import { modalComp } from '@/classes/Modal';
import ContextMenu from '@/components/context/ContextMenu.vue';
import {
    addClients, importClients, removeClient as removeClientService,
    editClient as editClientService
} from '@/services/clients'
import socket from '@/composables/socket'
import { setHelper, sidebarStatus } from '@/composables/sidebarStatus';
import ClientProjects from '@/components/ClientProjects.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'
import { alertMessageApp } from '@/composables/alertFunction'

const router = useRouter()
const strings = {
    nit: {
        Spanish: "NIT",
        English: "NIT"
    },
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
    },
    email: {
        Spanish: "Correo",
        English: "E-mail"
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
    },
    contacts: []
}
const importFile = ref()
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
        if (sidebarStatus.helper == true) {
            socket.socket?.on('projects' + clientSelected.value.id, (body) => {
                console.log(body)
            })
        } else {
            socket.socket?.removeListener('projects' + clientSelected.value.id)
        }
    },
    { deep: true }
)

onBeforeMount(async () => {
    await listClients()
})

const cancelToken: Ref<AbortController | undefined> = ref()

const listClients = async () => {

    if (cancelToken.value != undefined) {
        cancelToken.value.abort()
    }

    cancelToken.value = new AbortController();

    const filtering = {
        'c.name': filter.value,
        limit: 100
    }

    let { data } = await getClients((auth.getUser.token as token).value, filtering, cancelToken.value.signal)
    if (!data) return
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
        console.log('service update', body)
        auth.addClient(body)
    })

    socket.socket?.on('clientDeleted', (body: { id: number }) => {
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
    { title: strings.nit[language.value], accesor: 'nit', sort: true, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[20%] tablet:flex phone:block' },
    { title: strings.email[language.value], accesor: 'email', sort: true, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[35%] tablet:flex phone:hidden' },
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

const generateLink = async () => {
    const initLink = window.location.hostname == 'localhost' ?
        `http://localhost:${window.location.port}/` : "https://stockapi.anubisapps.com"

    await navigator.clipboard.writeText(initLink + 'newClient');
}

const readFile = async () => {
    const file = importFile.value as HTMLElement
    file.click()
}

const getFile = async (files: any) => {
    const reader = new FileReader()
    reader.readAsText(files[0])
    reader.onload = (async (event) => {
        const csv = event.target?.result as string
        let lines = csv.split('\n')
        let productsCsv: Array<any> = []
        let headers = lines[0].split(';')

        for (let i = 1; i < lines.length; i++) {
            let clients = {} as any
            let currentline = lines[i].split(';')
            if (currentline[0] !== '') {
                for (let j = 0; j < headers.length; j++) {
                    if (headers[j] != 'INV. TOTAL'
                        && headers[j] != 'ITEMS'
                        && headers[j] != 'alquilado'
                        && headers[j] != 'disponible'
                        && currentline[j] != ''
                        && currentline[j] != '0'
                        && currentline[j] != '\r') {
                        clients[headers[j]] = currentline[j]
                    }

                }
                productsCsv.push({
                    name: currentline[headers.findIndex(key => key == 'ITEMS')],
                    stock: currentline[headers.findIndex(key => key == 'INV. TOTAL')],
                    dispatched: currentline[headers.findIndex(key => key == 'alquilado')],
                    avaliable: currentline[headers.findIndex(key => key == 'disponible')],
                    clients: clients
                })
            }
        }
        modalComp.modal.show({
            title: 'Desea ejecutar esta acción',
            description: 'Al realizar esta acción, todos los usuarios seran deslogueados por seguridad',
            inputValue: '',
        }).then(async (r) => {
            if (r.success) {
                let result = await importClients((auth.getUser.token as token).value,
                    {
                        enterprise_id: auth.getUser.enterprise_id,
                        products: productsCsv
                    })
                if (result.status == 200) {
                    alertMessage('Atención',
                        'Todos los clientes y productos fueron añadidos',
                        'success');
                }
            }
        })
    })
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


const addNewClientSender = async () => {
    let res
    if (clientSelected.value.id) {
        res = await editClientService((auth.getUser.token as token).value, clientFinal as clientEnterpriseSchema)
    } else {
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

const addNewClient = async () => {
    const handler: clientEnterpriseSchema = clientFinal as clientEnterpriseSchema
    console.log(handler)
    if (handler.contacts?.length == 0) {
        const res = await new Promise((res, rej) => {
            modalComp.modal.show({
                title: 'No se agregaron contactos',
                description: 'No se han añadido contactos al cliente, en caso de querer continuar, confirme la transacción',
                input: false,
                inputValue: ''
            }).then(r => {
                if (r.success) {
                    res(true)
                }else{
                    res(false)
                }
            })
        })
        if(!res) return
    }
    modalComp.modal.show({
        title: clientSelected.value.id ? 'Actualizar registro' : 'Nuevo registro',
        description: clientSelected.value.id ? '¿Desea actualizar el cliente?' : '¿Desea guardar el nuevo cliente?',
        input: false,
        inputValue: ''
    }).then(async (r) => {
        if (r.success) {
            addNewClientSender()
        }
    })
}

const createQuotation = () => {
    router.push({ path: '/dashboard/mystock', query: { quote: 1, client: clientSelected.value.id } })
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
            const res = await removeClientService((auth.getUser.token as token).value, { id: clientSelected.value.id })
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

