<template>
    <div class="flex flex-row flex-wrap" ref="clientProjectsContainer">
        <div class="border-b flex justify-center w-full order-1">
            <span class="text-2xl font-bold">
                {{ props.client.name }} projects
            </span>
        </div>
        <Input
            class="my-2 px-2 pt-5 tablet:w-1/2 phone:w-full rounded-lg border-solid outline-secondary tablet:order-2 phone:order-3"
            v-model="filter" placeholder="Buscar proyectos" label="Buscar proyectos" @update:model-value="search()" />
        <div class="flex pt-5 tablet:w-1/2 phone:w-full px-2 tablet:order-3 phone:order-2 items-center justify-end">
            <Button v-if="writePer" class="tablet:w-auto phone:w-full" exactColor color="secondary" icon="Add" content="Crear"
                @click="clientCreationModal = true" />
        </div>
        <div class="w-full flex flex-col order-4">
            <DataTable :data="projectsSource" :config-table="configTable" :header="headers"
                @open-context="handleContext" />
        </div>

        <Modal v-if="clientCreationModal" @close="clear(); clientCreationModal = false">
            <template v-slot:header>
                <div v-if="projectSelected.id">
                    Editar el proyecto {{ projectSelected.name }}
                </div>
                <div v-else>
                    Crear nuevo proyecto
                </div>
            </template>
            <template v-slot:body>
                <ProjectCreationForm :project-selected="projectSelected" ref="projectCreationForm"/>
            </template>
            <template v-slot:actions>
                <div class="flex w-full">
                    <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                        @click="clientCreationModal = false; clear()" />
                    <Button exactColor color="primary" icon="save" content="Guardar" @click="addNewProject()" />
                </div>
            </template>
        </Modal>

        <ContextMenu class="right-click-menu" :left="contextMenuData.left" :top="contextMenuData.top"
            v-if="contextMenuData.show" @close="contextMenuData.show = false" :width="contextMenuData.width">
            <template v-slot:options>
                <div @click="contextMenuData.show = false; clientCreationModal = true">
                    Edit
                </div>
                <div @click="createQuotation()">
                    Crear cotización
                </div>
                <div>
                    Open quotations
                </div>
                <div @click="contextMenuData.show = false; deleteProject()">
                    Delete
                </div>
            </template>
        </ContextMenu>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onBeforeMount, onBeforeUnmount, computed, type Ref } from 'vue';
import type { clientEnterpriseSchema, projectSchema, token } from '@/schemas';
import DataTable from './datatable/DataTable.vue';
import { listAllProjects, saveProject, removeProject } from '@/services/clients'
import { Input, Button, Modal } from './Generics/generics';
import ContextMenu from './context/ContextMenu.vue';
import ProjectCreationForm from './projectCreationForm.vue';
import socket from '@/composables/socket';
import moment from 'moment';
import { editPer, writePer } from '@/composables/permissions';
import { useRouter } from 'vue-router';
import { sidebarStatus } from '@/composables/sidebarStatus';
import { useAuthStore } from '@/stores/auth'


export interface clientProps {
    client: clientEnterpriseSchema
}

const clientProjectsContainer: Ref<HTMLElement | undefined> = ref()
const contextMenuData = ref({
    show: false,
    left: 0,
    top: 0,
    width: 0
})
const router = useRouter()
const projectCreationForm = ref()
const projectSelected: Ref<projectSchema | any> = ref({})
const clear = () => {
    projectSelected.value = {}
}
const cancelToken: Ref<AbortController | undefined> = ref(undefined)
const store = useAuthStore()
const props = defineProps<clientProps>()
const projects: Ref<Array<projectSchema>> = ref([])
const filter = ref('')
const clientCreationModal: Ref<boolean> = ref(false)
const projectsSource = computed(() => {
    return projects.value
})
const configTable = ref({
    color: 'black',
    dropdown: false
})
const headers = ref([
    { title: 'Nombre', accesor: 'name', sort: true, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[35%] tablet:flex phone:block' },
    { title: 'Budget', accesor: 'budget', sort: true, config: { money: true }, sortDirection: 'up', width: 'phone:w-[45%] tablet:w-[25%] tablet:flex phone:block text-right' },
    { title: 'Dirección', accesor: 'address', sort: true, sortDirection: 'up', width: 'phone:w-[0%] tablet:w-[30%] tablet:flex phone:hidden' },
    // { title: '', accesor: '', sort: false, sortDirection: 'up', width: 'phone:w-[10%] tablet:w-[10%] tablet:flex phone:block' },
])

onBeforeMount(async () => {
    await search()
    socket.socket?.on('projectsChange-' + props.client.id, (body: any) => {
        if(Object.keys(body).length > 2){
            if(body.register){
                projects.value = projects.value.map((project) =>{
                    if(project.id == body.id){
                        project = body
                        project.register = moment().format('YYYY-MM-DD')
                    }
                    return project
                })
            }else{
                projects.value.unshift(body)
            }
        }else{
            projects.value = projects.value.filter(project => project.id != body.id)
        }
    })
})

onBeforeUnmount(() => {
    socket.socket?.removeListener('projectsChange-' + props.client.id)
})

const createQuotation = () => {
    sidebarStatus.helper = false
    router.push({
        path: '/dashboard/mystock',
        query: {
            quote: 1,
            client: props.client.id,
            project: projectSelected.value.id
        }
    })
}

const search = async () => {

    if (cancelToken.value !== undefined) {
        cancelToken.value.abort()
    }

    cancelToken.value = new AbortController()
    console.log(cancelToken.value.signal)
    const token = store.getUser.token as token
    const { data } = await listAllProjects(token.value, {
        client_id: props.client.id,
        name: filter.value
    }, cancelToken.value.signal)
    if (data && data.length > 0) {
        cancelToken.value = undefined
        projects.value = data as Array<projectSchema>
    } else {
        projects.value = []
    }
}

const handleContext = (body: any) => {
    if(!editPer) return
    const event: PointerEvent = body.event
    const item: clientEnterpriseSchema = body.item
    const rect: DOMRect | undefined = clientProjectsContainer.value?.getBoundingClientRect()

    contextMenuData.value.left = event.x - (rect?.x ?? 0)
    contextMenuData.value.top = event.y
    contextMenuData.value.show = true
    contextMenuData.value.width = (rect?.width ?? 0)

    projectSelected.value = item
}

const addNewProject = async () => {
    let projectToSave = projectCreationForm.value.accessProject()
    if(!projectToSave.client_id){
        projectToSave.client_id = props.client.id
    }
    const token = store.getUser.token as token
    await saveProject(token.value, projectToSave)
    clear() 
    clientCreationModal.value = false
}

const deleteProject = async () => {
    const token = store.getUser.token as token
    await removeProject(token.value, {id: projectSelected.value.id, client_id: props.client.id})
}

</script>

