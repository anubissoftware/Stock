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
        <div class="w-full pb-6">
            <span class="font-bold text-xl italic">
                Datos de contacto
            </span>
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Nombre'" :label="'Nombre'" size="md" type="text"
                required @update:model-value="null" v-model="project.contact_name" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Teléfono'" :label="'Teléfono'" size="md" type="text"
                required @update:model-value="null" v-model="project.contact_phone" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Correo electrónico'" :label="'Correo electrónico'" size="md" type="text"
                required @update:model-value="null" v-model="project.contact_email" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { isRenting } from '@/composables/permissions';
import { ref, defineProps, defineExpose, onBeforeMount, type Ref } from 'vue';
import type { projectSchema } from '@/schemas';
import { Input, CheckBox } from './Generics/generics';

export interface projectCreationFormProps {
    projectSelected: projectSchema
}

const props = defineProps<projectCreationFormProps>()
const project: Ref<projectSchema | any> = ref({})

const accessProject = (): projectSchema | any => {
    return project.value
}

defineExpose({accessProject})

onBeforeMount(() => {
    const pj: projectSchema ={...props.projectSelected} as projectSchema
    if(pj.id){
        pj.renting = pj.renting == 1 
        project.value = pj
    }else{
        project.value = {
            name: '',
            address: '',
            contact_name: '',
            contact_phone: '',
            contact_email: '',
            budget: 0,
            renting: false
        }
    }
})

</script>