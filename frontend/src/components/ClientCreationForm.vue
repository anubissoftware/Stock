
<template>
    <div class="flex flex-row w-full flex-wrap">
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Cliente'" :label="'Cliente'" size="md" type="text" required
                v-model="client.name" @update:model-value="updateValue()" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Select class="w-full" color="black" label="Tipo" v-model="client.type" :items="clientType" size="md"
                type="text" value="name" required @update:model-value="updateValue()" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'NIT'" :label="'NIT'" size="md" type="text" required
                v-model="client.nit" @update:model-value="updateValue()" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'E-mail'" :label="'Email principal'" size="md" type="text"
                required v-model="client.email" @update:model-value="updateValue()" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" :placeholder="'Dirección'" :label="'Dirección'" size="md" type="text"
                required v-model="client.address" @update:model-value="updateValue()" />
        </div>

        <ContactsComponent ref="contactsListComponent" :client="client" @update:client="updated"/>

        <div class="flex w-full pr-2 pb-4 border-t-2 border-t-black pt-2">
            <span class="text-base font-bold">
                RUT
            </span>
        </div>

        <div class="w-full h-32">
            <Drop v-model="client.rut" @update:model-value="updateValue()" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { Input, Select } from './Generics/generics';
import { defineProps, defineEmits, ref, onBeforeMount, type Ref } from 'vue';
import Drop from './Generics/Drop.vue';
import type { clientsContactSchema } from '@/schemas';
import moment from 'moment';
import { useAuthStore } from '@/stores/auth'
import { getClientsTags } from '@/services/clients'
import { modalComp } from '@/classes/Modal';
import ContactsComponent from '@/components/clients/clientsContacts.vue';

export interface ClientCreationProps {
    client: {
        name: string,
        type: string,
        nit: string,
        email: string,
        address: string,
        contact_name: string,
        contact_phone: string,
        contact_email: string,
        rut: {
            name: string,
            info: string
        }
        contacts: clientsContactSchema[]
    }
}

const updated = (clientUpdated: any) => {
    client.value.contacts = [...clientUpdated]
    updateValue()
}
const contactDraf: clientsContactSchema = {
    name: '',
    id: 0,
    client_id: 0,
    phone: '',
    client_tag: '',
    birth: moment().format('YYYY-MM-DD'),
    main: 0,
    email: '',
    helper: false
}
const auth = useAuthStore()
const contact: Ref<clientsContactSchema> = ref({ ...contactDraf })
const props = defineProps<ClientCreationProps>()
const emits = defineEmits(['update'])
const client: Ref<any | ClientCreationProps> = ref({})

onBeforeMount(async () => {
    client.value = { ...props.client }
    if (props.client.type)
        client.value.type = clientType.value.filter(type => type.id.toString() == props.client.type)[0]
    client.value.contacts = []
    
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

const updateValue = () => {
    emits('update', client.value)
}

</script>
