<template>
    <div class="w-full flex flex-wrap text-left text-xl italic border-t-2 mt-4">
        <span class="w-full text-left">
            Condicionales de cotización:
        </span>
        <div class="flex flex-wrap w-full">
            <Sortable :list="list" sort="condition_text" />
        </div>
        <div class="flex flex-wrap w-full mt-4">
            <Input class=" w-full " color="black" :placeholder="'Inserte la condición de cotización'" :label="'Condición'"
                size="md" type="text" v-model="newCondition.condition_text" required @keyup.enter="addNew" />
            <span class="w-full text-sm">
                Presion la tecla "Enter" para añadir o modificar la condición
            </span>
        </div>
        <div class="flex w-full justify-end pt-2">
            <Button exactColor size="sm" color="primary" content="Guardar" icon="save" @click="saveConditions" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, type Ref, onBeforeMount, onBeforeUnmount } from 'vue';
import { Sortable, Input, Button } from '../Generics/generics';
import { listQuotationTerms, saveQuotationTerms } from '@/services/quotation'
import type { quotationTermsSchema } from '@/schemas'
import { useAuthStore } from '@/stores/auth';
import { subscribe, unsubscribe } from '@/suscribers/quotationTermsSuscriber'


const auth = useAuthStore()
const list: Ref<Array<quotationTermsSchema>> = ref([])
const newCondition: Ref<quotationTermsSchema> = ref({
    condition_text: '',
    enterprise_id: auth.getUser.enterprise_id,
    place: 0,
    id: 't' + Math.floor(Math.random() * 1000)
})

const addNew = () => {
    list.value.push({ ...newCondition.value })
    newCondition.value = {
        condition_text: '',
        enterprise_id: auth.getUser.enterprise_id,
        place: 0,
        id: 't' + Math.floor(Math.random() * 1000)
    }
}

const saveConditions = async () => {
    list.value.map((term, index) => {
        term.place = index
        return term
    })
    await saveQuotationTerms(list.value)
    list.value = list.value.filter(item => !item.id.toString().includes('t'))
}

onBeforeMount(async () => {
    let { data } = await listQuotationTerms()
    list.value = data
    subscribe(list, false)
})

onBeforeUnmount(() => {
    unsubscribe()
})


</script>