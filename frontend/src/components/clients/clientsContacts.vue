<template>
    <div>
        <div class="w-full border-t-2 border-t-black pt-2 mb-3 text-left text-xl font-bold">
            Lista de contactos
        </div>

        <div class="w-full flex flex-row flex-wrap px-2 pb-2 border rounded-lg mb-2">
            <div class="w-full flex py-2 mt-1 text-sm font-bold italic">
                <div class="w-1/3 text-left border-r px-1">
                    Nombre
                </div>
                <div class="w-1/3 text-left border-r px-1">
                    Teléfono
                </div>
                <div class="w-1/3 text-left px-1">
                    Cargo
                </div>
            </div>
            <div class="w-full flex py-2 mt-1 text-sm hover:cursor-pointer relative border-0"
                v-for="(contacto, index) in contactsLocal" :key="index"
                :class="[contacto.id == contact.id ? 'border-l-4 border-l-primary' : 'rounded-lg']"
                @contextmenu.prevent="contacto.helper = !contacto.helper">

                <div class="w-1/3 text-left border-r px-1">
                    <span :class="[index == main ? 'font-bold' : '']" @click="main = index">
                        P
                    </span> -
                    {{ contacto.name }}
                </div>
                <div class="w-1/3 text-left border-r px-1">
                    {{ contacto.phone }}
                </div>
                <div class="w-1/3 text-left px-1">
                    {{ (contacto.client_tag as clientsTags).tag ?? contacto.client_tag }}
                </div>
                <div class="w-full absolute right-0 flex justify-center items-center bg-white opacity-80 h-full"
                    v-if="contacto.helper">
                    <Icon icon="edit" @click="() => {
                        contact = { ...contacto }
                    }" class="hover:scale-125 duration-150" />
                    <Icon icon="delete" @click="() => {
                        contactsLocal?.splice(index, 1)
                        if (main > index) {
                            main--;
                        } else if (main == index) {
                            main = -1
                        }
                    }" class="hover:scale-125 duration-150 ml-5" />
                    <Icon icon="close" @click="contacto.helper = false" class="hover:scale-125 duration-150 ml-5" />
                </div>
            </div>
        </div>

        <div class="flex flex-wrap border p-2 rounded-md mb-3" v-if="(contactsLocal?.length?? 0) < contactsAmount">
            <div class="w-full mb-7 text-left text-xl font-bold">
                <span v-if="contact.id == 0">
                    Añadir contacto
                </span>
                <span v-else>
                    Actualizar contacto
                </span>
            </div>

            <div class="laptop:w-1/3 phone:w-full pr-2 pb-6">
                <Input class=" w-full " color="black" :placeholder="'Nombre del contacto'" :label="'Nombre'" size="md"
                    type="text" v-model="contact.name" required/>
            </div>
            <div class="laptop:w-1/3 phone:w-full pr-2 pb-6">
                <Input class=" w-full " color="black" :placeholder="'Teléfono del contacto'" :label="'Teléfono'" size="md"
                    type="text" v-model="contact.phone" required/>
            </div>
            <div class="laptop:w-1/3 phone:w-full pr-2 pb-6">
                <Autocomplete v-model="contact.client_tag" :items="auth.clientsTags" value="tag" color="black"
                    placeholder="Tipo de contacto" label="Tipo de contacto" size="md" type="text" required />
            </div>
            <div class="laptop:w-1/3 phone:w-full pr-2 pb-6">
                <Input class=" w-full " color="black" :placeholder="'E-mail del contacto'" :label="'E-mail'" size="md"
                    type="text" v-model="contact.email"/>
            </div>
            <div class="laptop:w-1/3 phone:w-full pr-2 pb-6">
                <Input class=" w-full " color="black" :placeholder="'Fecha de nacimiento'" :label="'Fecha de nacimiento'"
                    size="md" type="date" v-model="contact.birth"/>
            </div>

            <div class="laptop:w-1/3 phone:w-full pr-2 pb-6 flex justify-evenly items-center">
                <Button exactColor size="sm" color="secondary" content="Cancelar" icon="close" @click="restoreContact" />
                <Button v-if="contact.id == 0" exactColor size="sm" color="primary" content="Añadir" icon="save"
                    @click="addContact" />
                <Button v-else exactColor size="sm" color="primary" content="Actualizar" icon="save"
                    @click="updateContact" />
            </div>
        </div>

        <div v-else class="py-5 italic">
            <span>
                Su suscripción solo cuenta en la posibilidad de añadir {{ contactsAmount }} por cliente
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { modalComp } from '@/classes/Modal';
import { Autocomplete, Input, Button, Icon } from '@/components/Generics/generics';
import { contactsAmount } from '@/composables/permissions';
import type { clientEnterpriseSchema, clientsContactSchema, clientsTags, projectSchema } from '@/schemas';
import { getClientsContacts, getClientsTags } from '@/services/clients';
import { useAuthStore } from '@/stores/auth';
import moment from 'moment';
import { type Ref, ref, onBeforeMount, watch } from 'vue';

export interface contactComponentProps {
    client: clientEnterpriseSchema
    project?: projectSchema
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
const main: Ref<number> = ref(0)
const props = defineProps<contactComponentProps>()
const emits = defineEmits(['update:client'])
const contactsLocal: Ref<clientsContactSchema[]> = ref([])
const contact: Ref<clientsContactSchema> = ref({...contactDraf})

watch(
    () => contactsLocal,
    () => {
        console.log('something changed')
    },
    {
        deep: true,
        immediate: true
    }
)

defineExpose({contactsLocal})


const reset = () => {
    contact.value = { ...contactDraf }
    const draft = [...(contactsLocal.value as clientsContactSchema[])]
    console.log('draft', draft)
    emits('update:client', draft)
}

const addContact = () => {
    if (contact.value.name.length < 3) {
        modalComp.modal.show({
            title: 'Verifique el nombre',
            description: 'El nombre es muy corto.',
            input: false,
            inputValue: ''
        })
        return
    }
    if (contact.value.phone.length < 6) {
        modalComp.modal.show({
            title: 'Verifique el número de teléfono',
            description: 'El número de teléfono es muy corto.',
            input: false,
            inputValue: ''
        })
        return
    }
    if(typeof contact.value.client_tag != 'object'){
        modalComp.modal.show({
            title: 'No ha seleccionado el tipo del contacto',
            description: 'Por favor ingrese un tipo de contacto válido de la lista.',
            input: false,
            inputValue: ''
        })
        return
    }
    if (moment(contact.value.birth, 'YYYY-MM-DD').year() == moment().year()) {
        modalComp.modal.show({
            title: 'Verifique la fecha de nacimiento',
            description: 'La fecha es muy reciente.',
            input: false,
            inputValue: ''
        })
        return
    }
    if (contact.value.email != '' && !String(contact.value.email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
        modalComp.modal.show({
            title: 'Valide el e-mail',
            description: 'No tiene una estructura válida.',
            input: false,
            inputValue: ''
        })
        return
    }

    const aux = Math.floor(Math.random() * 1000)
    contact.value.id = "s" + aux
    console.log(contact.value)
    contactsLocal.value?.push({ ...contact.value })
    reset() 
}

const updateContact = () => {
    contactsLocal.value = contactsLocal.value?.map((cont: clientsContactSchema) => {
        if (cont.id == contact.value.id) {
            cont = { ...contact.value }
            cont.helper = false
            console.log('here')
        }
        return cont
    })
    reset()
}

const restoreContact = () => {
    contact.value = { ...contactDraf }
}

const listContacts = async (contactsFiltering: any) => {
    let { data } = await getClientsContacts(contactsFiltering)

    contactsLocal.value = data.map((dat: clientsContactSchema) => {
        dat.client_tag = auth.clientsTags.find(tag => tag.id == dat.client_tag) ?? dat.client_tag
        dat.birth = moment(dat.birth).format('YYYY-MM-DD')
        return dat
    })

    reset()
}

onBeforeMount( async () => {
    if (auth.clientsTags.length == 0) {
        let { data } = await getClientsTags()
        auth.clientsTags = data
    }

    let contactsFiltering: any = {
        'cc.client_id': props.client.id
    }

    if(props.project){
        if(props.project.id){
            contactsFiltering['cc.project_id'] = props.project.id
            listContacts(contactsFiltering)
        }
    }else{
        contactsFiltering['cc.project_id'] = 'null'
        listContacts(contactsFiltering)
    }

})


</script>