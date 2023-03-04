<template>
    <div class="flex w-full flex-wrap">
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Nombre del proyecto'" :label="'Nombre del proyecto'" size="md" type="text"
                required @update:model-value="null" v-model="project.name" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Dirección del proyecto'" :label="'Dirección del proyecto'" size="md" type="text"
                required @update:model-value="null" v-model="project.address" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Presupuesto'" :label="'Presupuesto'" size="md" type="number"
                required @update:model-value="null" v-model="project.budget" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6" v-if="isRenting">
            <CheckBox class="" color="black" :content="'¿El proyecto solicita alquiler?'" :label="'¿El proyecto solicita alquiler?'" size="md" type="text"
                required @update:model-value="null" v-model="project.renting" />
        </div>
        <hr class="border w-full mb-2">

        <ClientsContacts :client="client" :project="project" @update:client="updateProject" />
    </div>
</template>

<script lang="ts" setup>
import { isRenting } from '@/composables/permissions';
import { ref, defineProps, defineExpose, onBeforeMount, type Ref } from 'vue';
import type { clientEnterpriseSchema, clientsContactSchema, projectSchema } from '@/schemas';
import { Input, CheckBox } from './Generics/generics';
import ClientsContacts from './clients/clientsContacts.vue';

export interface projectCreationFormProps {
    projectSelected: projectSchema
    client: clientEnterpriseSchema
}

const props = defineProps<projectCreationFormProps>()
const project: Ref<projectSchema | any> = ref({})

const accessProject = (): projectSchema | any => {
    return project.value
}

defineExpose({accessProject})

const updateProject = (event: clientsContactSchema[]) => {
    project.value.contacts = [...event]
    console.log(project.value)
}

onBeforeMount(() => {
    const pj: projectSchema ={...props.projectSelected} as projectSchema
    if(pj.id){
        pj.renting = pj.renting == 1 
        project.value = pj
    }else{
        project.value = {
            name: '',
            address: '',
            budget: 0,
            renting: false,
            contacts: []
        }
    }
})

</script>