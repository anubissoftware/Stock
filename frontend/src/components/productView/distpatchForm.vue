<template>
    <div class="w-full flex flex-row flex-wrap min-h-[20vh] items-start">
        <div class="phone:w-full tablet:w-1/2 p-2">
            <Autocomplete v-model="dispatchInfo.client" :items="clients" value="name" color="black" placeholder="Cliente"
            label="Cliente" size="md" type="text" required
            @update:model-value="listClients(dispatchInfo.client as string); getProjects('')" />
        </div>
        <div class="phone:w-full tablet:w-1/2 p-2 phone:py-4 tablet:py-2">
            <Input class="w-full" color="black" placeholder="Cantidad" label="cantidad" size="md"
            type="number" @update:model-value="null" v-model="dispatchInfo.amount" required/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { clientschema, projectSchema, token } from '@/schemas';
import { getClients, listAllProjects } from '@/services/clients';
import { useAuthStore } from '@/stores/auth';
import { ref, type Ref, onBeforeMount, computed } from 'vue';
import Autocomplete from '../Generics/Autocomplete.vue';
import Input from '../Generics/Input.vue';
import {projects as projectos} from '@/composables/permissions'

export interface dispatchInfoType{
    client: any
    project: any
    amount: number | string
}

const auth = useAuthStore()
const cancelToken: Ref<AbortController | undefined> = ref()
const clients: Ref<Array<clientschema>> = ref([])
const projects: Ref<Array<projectSchema>> = ref([])

const dispatchInfo: Ref<dispatchInfoType> = ref({
    client: '',
    amount: '',
    project: ''
})

const canSave = computed(() => {
    return typeof dispatchInfo.value.client == 'object' && 
        dispatchInfo.value.amount > 0
})

defineExpose({dispatchInfo, canSave})

const listClients = async (value: string) => {
    if(typeof value == 'object') return
    if(cancelToken.value){
        cancelToken.value.abort()
    }
    cancelToken.value = new AbortController()
    const token = auth.getUser.token as token
    let {data} = await getClients(
        token.value,
        {'c.name': value, limit: 30},
        cancelToken.value.signal
    )
    if(data && data.length){
        clients.value = data
        cancelToken.value = undefined
        getProjects('')
    }else{
        clients.value = []
    }
}

const getProjects = async (value: string) => {
    dispatchInfo.value.project = ''
    if(!projectos) return
    if(typeof dispatchInfo.value.project == 'object'){
        /**
         * Aquí se añadirá el correo electrónico del cliente, 
         * con el fin de que se puedan enviar los documentos
         * de remisión.
         * */
        if(cancelToken.value){
            cancelToken.value.abort()
        }
        cancelToken.value = new AbortController()
        const token = auth.getUser.token as token
        let {data} = await listAllProjects(
            token.value,
            {
                client_id: dispatchInfo.value.client.id,
                name: value
            },
            cancelToken.value.signal
        )
        cancelToken.value = undefined
        if(data && data.length){
            projects.value = data
        }else{
            projects.value = []
        }

    }
}

onBeforeMount(() => {
    listClients('')
})

</script>

<style>
</style>