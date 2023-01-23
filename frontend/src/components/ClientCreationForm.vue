
<template>
    <div class="flex flex-row w-full flex-wrap">
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Cliente'" :label="'Cliente'" size="md" type="text"
                required v-model="client.name" @update:model-value="updateValue()" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Select class="w-full" color="black" label="Tipo" v-model="client.type" :items="clientType" size="md"
                type="text" value="name" required @update:model-value="updateValue()" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'NIT'" :label="'NIT'" size="md" type="text" required
                v-model="client.nit" @update:model-value="updateValue()"/>
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'E-mail'" :label="'Email'" size="md" type="text"
                required v-model="client.email" @update:model-value="updateValue()"/>
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Nombre del contacto principal'" :label="'Nombre del contacto principal'" size="md" type="text"
                v-model="client.contact_name" @update:model-value="updateValue()"/>
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'E-mail del contacto principal'" :label="'E-mail del contacto principal'" size="md" type="text"
                v-model="client.contact_email" @update:model-value="updateValue()"/>
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Teléfono del contacto principal'" :label="'Teléfono del contacto principal'" size="md" type="text"
                v-model="client.contact_phone" @update:model-value="updateValue()"/>
        </div>
        <div class="w-full h-32">
            <Drop v-model="client.rut" @update:model-value="updateValue()"/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { Input, Select } from './Generics/generics';
import { defineProps, defineEmits, ref, onBeforeMount, type Ref } from 'vue';
import Drop from './Generics/Drop.vue';

export interface ClientCreationProps {
    client: {
        name: string,
        type: string,
        nit: string,
        email: string,
        contact_name: string,
        contact_phone: string,
        contact_email: string,
        rut: {
            name: string,
            info: string
        }
    }
}
const props = defineProps<ClientCreationProps>()
const emits = defineEmits(['update'])
const client: Ref<any | ClientCreationProps> = ref({})

onBeforeMount(() => {
    client.value = { ...props.client }
    if(props.client.type)
    client.value.type = clientType.value.filter(type => type.id.toString() == props.client.type)[0]
    emits('update', client.value)
})

const clientType = ref([
    {
        name: 'Persona Natural',
        id: 1
    },
    {
        name: 'Persona Jurídica',
        id: 2
    }
])

const updateValue =() => {
    emits('update', client.value)
}

</script>
