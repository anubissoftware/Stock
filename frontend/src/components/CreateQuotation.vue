<template>
    <div class="flex w-full flex-wrap">
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Autocomplete v-model="whoQuotate.client" :items="clients" value="name" color="black" placeholder="Cliente"
                label="Cliente" size="md" type="text" required :readonly="props.editable?.client"
                @update:model-value="listClients(whoQuotate.client as string); getProjects('')" />
        </div>
        <div class="laptop:w-1/2 phone:w-full" v-if="!displayInputs.projects"></div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6" v-if="displayInputs.projects && projectos">
            <Autocomplete v-model="whoQuotate.project" :items="projects" value="name" color="black"
                :readonly="props.editable?.client" placeholder="Proyecto" label="Proyecto" size="md" type="text" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6" v-if="displayInputs.projects && projectos">
            <Autocomplete v-model="whoQuotate.contact" :items="clientsContact" value="name" color="black"
                placeholder="Solicitada por" label="Solicitada por" size="md" type="text" @update:model-value="() => {
                    if (typeof whoQuotate.contact == 'object') {
                        if (whoQuotate.contact.email !== '') {
                            clientEmail = whoQuotate.contact.email
                        } else {
                            clientEmail = (whoQuotate.client as clientschema).email
                        }
                    }
                }" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6" v-if="displayInputs.projects">
            <Input class=" w-full " color="black" placeholder="Correo electrónico" label="Correo electrónico" size="md"
                type="text" required @update:model-value="null" v-model="clientEmail" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <CheckBox class="" :readonly="route.query.quote == '2'" color="black"
                :content="'¿La cotización es para alquiler?'" :label="'¿La cotización es para alquiler?'" size="md"
                type="text" required v-model="whoQuotate.renting" @update:model-value="setProductsDates()" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <CheckBox class="" color="black"
                :content="'Incluir transporte'" :label="'Incluir transporte'" size="md"
                type="text" required v-model="whoQuotate.hasTransport" @update:model-value="setProductsDates()" />
        </div>
        
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6" v-if="whoQuotate.hasTransport">
            <Input class=" w-full " color="black" placeholder="Valor de transporte" label="Valor de transporte" size="md" type="text"
                required @update:model-value="null" v-model="whoQuotate.transport" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" placeholder="Valor Cotizado" label="Valor cotizado" size="md" type="text"
                required @update:model-value="null" disabled v-model="totalDue" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" placeholder="Peso apróximado" label="Peso apróximado" size="md" type="text"
                required disabled v-model="totalWeight" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6 relative">
            <Input class=" w-full" color="black" placeholder="Impuestos" label="Impuestos" size="md" type="text" required
                @update:model-value="null" :disabled="props.editable?.client && false" v-model="whoQuotate.taxing" />
            <span class="absolute top-3 right-3 text-gray-400">
                {{ taxes }}
            </span>
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6 relative">
            <Input class=" w-full" color="black" placeholder="Descuento" label="Descuento" size="md" type="text" required
                @update:model-value="null" :disabled="props.editable?.client && false" v-model="whoQuotate.discount" />
            <span class="absolute top-3 right-3 text-gray-400">
                {{ discount }}
            </span>
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" placeholder="Valor total" label="Valor total" size="md" type="text"
                required @update:model-value="null" disabled v-model="finalDue" />
        </div>

        <div class="w-full pr-2 pb-6 border-t-2 border-t-black pt-2">
            <span class="text-xl font-bold">
                Fechas de válidez
            </span>
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" placeholder="Fecha Mínima" label="Fecha Mínima (M-D-Y)" size="md"
                type="date" @update:model-value="null" v-model="whoQuotate.min_date" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" placeholder="Fecha máxima" label="Fecha máxima (M-D-Y)" size="md"
                type="date" @update:model-value="null" v-model="whoQuotate.max_date" />
        </div>
        <template v-if="whoQuotate.renting">
            <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
                <CheckBox class="" color="black" :content="'Cotizar el valor de un solo día'"
                    :label="'Cotizar el valor de un solo día'" size="md" type="text" required
                    v-model="whoQuotate.one_day" />
            </div>
        </template>
        <div class="flex w-full flex-wrap" v-if="whoQuotate.renting && !whoQuotate.one_day">
            <div class="w-full pr-2 pb-6 border-t-2 border-t-black pt-2">
                <span class="text-xl font-bold">
                    Fechas del Alquiler
                </span>
            </div>
            <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
                <Input class=" w-full " color="black" placeholder="Fecha de inicio" label="Fecha de inicio (M-D-Y)"
                    size="md" type="date" @update:model-value="setProductsDates()" v-model="whoQuotate.rent_min_date" />
            </div>
            <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
                <Input class=" w-full " color="black" placeholder="Fecha de fin" label="Fecha de fin (M-D-Y)" size="md"
                    type="date" @update:model-value="setProductsDates()" v-model="whoQuotate.rent_max_date" />
            </div>
        </div>

        <div class="w-full pr-2 border-t-2 border-t-black pt-2">
            <span class="text-xl font-bold">
                Resumen de productos
            </span>
        </div>
        <span class="italic pb-6" v-if="whoQuotate.renting">
            Solo se mostrarán los productos que cuentan con precios de alquiler
        </span>
        <div class="laptop:w-1/2 phone:w-full pr-2 py-1 h-auto flex" v-for="(item, index) in products" :key="index">
            <div class="flex relative flex-wrap w-full py-2 px-5 border border-primary rounded-2xl">
                <span class="absolute top-1 right-1" @click="shopping.deleteProduct(item)">
                    <Icon class="cursor-pointer hover:scale-110 duration-200" icon="delete" />
                </span>
                <span class="w-full text-left font-bold italic text-lg">
                    {{ item.name }}
                </span>
                <div class="tablet:w-1/3 phone:w-2/3 relative">
                    <input type="number" v-model="item.value" v-if="!whoQuotate.renting"
                        class=" w-full h-8 pr-2 outline-primary border-primary border rounded text-center phone:text-right"
                        @change="null">
                    <input type="number" v-model="item.renting" v-else
                        class=" w-full h-8 pr-2 outline-primary border-primary border rounded text-center phone:text-right">
                    <Icon class="w-4 h-4 absolute left-1 top-1 cursor-pointer" icon="settings_backup_restore"
                        @click="shopping.restoreValueFromStore(item, whoQuotate.renting)" />
                </div>
                <span class="pl-3 self-end">
                    {{ ' x' + item.amount }}
                </span>
                <span class="w-full text-left" v-if="!whoQuotate.renting">
                    {{ currencyFormat((item.value * item.amount)) }}
                </span>
                <span class="w-full text-left" v-else>
                    {{ currencyFormat((item.renting ?? 0) * item.amount) }} / d
                </span>
            </div>
        </div>
        <div class="w-full mt-4 pr-2 border-t-2 border-t-black pt-2">
            <span class="text-xl font-bold">
                Condiciones de cotización
            </span>
        </div>
        <div class="w-full flex-wrap flex">
            <div class="tablet:w-1/2 phone:w-full flex p-2" v-for="(item, index) in quotationTerms" :key="index">
                <div class="flex w-full border rounded px-3 py-2">
                    <CheckBox class="" color="black"
                        :content="item.condition_text" :label="item.condition_text" size="md"
                        type="text" required v-model="item.checked" @update:model-value="setProductsDates()" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useShoppingCart, productsInCart, loaded } from '@/composables/ShoppingCart';
import { getClients, getClientsContacts, listAllProjects } from '@/services/clients';
import moment from 'moment';
import { computed, ref, type Ref, onBeforeMount, type ComputedRef, nextTick, defineExpose, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import type { clientschema, projectSchema, productsInCartType, token, quotationSchema, clientsContactSchema, quotationTermsOnQuote, quotationTermsSchema } from '@/schemas';
import { Icon } from './Generics/generics';
import { Input, Autocomplete, CheckBox } from './Generics/generics';
import { currencyFormat } from '@/composables/utils';
import { useAuthStore } from '@/stores/auth'
import { projects as projectos } from '@/composables/permissions'
import { listQuotationTerms } from '@/services/quotation';
import { subscribe, unsubscribe } from '@/suscribers/quotationTermsSuscriber';
import { getTotalValue } from '@/services/accounting';

export interface createQuotationProps {
    editable?: {
        client?: boolean,
        dates?: boolean,
        products?: boolean
    }
}
export interface whoQuotateType {
    client: clientschema | string,
    project: projectSchema | string,
    contact: clientsContactSchema | string,
    min_date: string,
    max_date: string,
    renting: boolean,
    rent_min_date: string,
    rent_max_date: string,
    one_day: boolean,
    taxing: number,
    discount: number,
    hasTransport: boolean,
    transport: number
}

const route = useRoute()
const store = useAuthStore()
const shopping = useShoppingCart()
const clients: Ref<Array<clientschema>> = ref([])
const projects: Ref<Array<projectSchema>> = ref([])
const clientsContact: Ref<Array<clientsContactSchema>> = ref([])
const cancelToken: Ref<AbortController | undefined> = ref(undefined)
const quotationTerms: Ref<quotationTermsOnQuote[]> = ref([])


const props = ref({
    editable: {
        client: false,
        dates: false,
        products: false
    }
})



const firstTimes: Ref<{ client: boolean, project: boolean }> = ref({
    client: false,
    project: false
})
const whoQuotate: Ref<whoQuotateType> = ref({
    client: '',
    project: '',
    contact: '',
    min_date: moment().format('YYYY-MM-DD'),
    max_date: moment().add(1, 'd').format('YYYY-MM-DD'),
    renting: false,
    rent_min_date: moment().add(1, 'd').format('YYYY-MM-DD'),
    rent_max_date: moment().add(2, 'd').format('YYYY-MM-DD'),
    one_day: true,
    taxing: 0,
    discount: 0,
    hasTransport: false,
    transport: 0
})

const canSave: ComputedRef<boolean> = computed(() => {
    let can = false
    if (typeof whoQuotate.value.client == 'object' && products.value.length > 0) {
        if (whoQuotate.value.renting) {
            can = whoQuotate.value.max_date > whoQuotate.value.min_date
        } else {
            can = true
        }
    }
    return can
})


const displayInputs = computed(() => {
    return {
        projects: typeof whoQuotate.value.client == 'object'
    }
})

const products: ComputedRef<Array<productsInCartType>> = computed(() => {
    let pdtos = productsInCart
    if (whoQuotate.value.renting) {
        pdtos = pdtos.filter(pdto => pdto.renting != null)
    }
    return pdtos
})
const clientEmail = ref('')

const listProjects = async (value: string) => {
    if (Object.keys(loaded.quotation).length > 0) {
        clientEmail.value = (loaded.quotation as quotationSchema).email ?? ''
    } else {
        clientEmail.value = (whoQuotate.value.client as clientschema).email
    }
    if (cancelToken.value) {
        cancelToken.value.abort()
    }
    cancelToken.value = new AbortController()
    const token = store.getUser.token as token
    let { data } = await listAllProjects(
        token.value,
        { client_id: (whoQuotate.value.client as clientschema).id, name: value },
        cancelToken.value.signal
    )
    cancelToken.value = undefined
    if (data && data.length) {
        projects.value = data
        if (route.query.project && !firstTimes.value.project) {
            whoQuotate.value.project = projects.value.filter(project => parseInt(route.query.project?.toString() ?? '0') == project.id)[0]
            firstTimes.value.project = true
        }
    } else {
        projects.value = []
    }
}

const listContacts = async () => {
    const contactsFiltering = {
        'cc.client_id': (whoQuotate.value.client as clientschema).id
    }

    let { data } = await getClientsContacts(contactsFiltering)

    clientsContact.value = data.map((dat: clientsContactSchema) => {
        dat.client_tag = store.clientsTags.find(tag => tag.id == dat.client_tag) ?? dat.client_tag
        dat.birth = moment(dat.birth).format('YYYY-MM-DD')
        return dat
    })

    const quotation: quotationSchema = loaded.quotation as quotationSchema
    if (quotation.contact_id) {
        whoQuotate.value.contact = clientsContact.value.filter((contact) => contact.id == quotation.contact_id)[0] ?? ''
    }
}

const getProjects = async (value: string) => {
    whoQuotate.value.project = ''
    if (!projectos) return
    if (typeof whoQuotate.value.client == 'object') {
        listProjects(value)
        listContacts()
    }
}

const listClients = async (value: string) => {
    if (typeof value == 'object') return
    clientEmail.value = ''
    whoQuotate.value.contact = ''
    /**
     * Hay que añadir un validador para que cada vez que la cantidad de resultados sea menor a 100
     * no se consuma más el WS y se filtre con la propiedad computada del autocomplete.
     * */
    if (cancelToken.value) {
        cancelToken.value.abort()
    }
    cancelToken.value = new AbortController()
    const token = store.getUser.token as token
    let { data } = await getClients(
        token.value,
        value,
        cancelToken.value.signal
    )
    if (data && data.length) {
        clients.value = data
        if (route.query.client && !firstTimes.value.client) {
            whoQuotate.value.client = clients.value.filter(client => parseInt(route.query.client?.toString() ?? '0') == client.id)[0]
            firstTimes.value.client = true
            getProjects('')
        }
    } else {
        clients.value = []
    }
}

const totalDue = computed(() => {
    let total = 0
    products.value.forEach((pdto) => {
        if (whoQuotate.value.renting) {
            let diff = 0
            if (!whoQuotate.value.one_day) {
                diff = (moment(pdto.end_rent ?? '', 'YYYY-MM-DD')).diff(moment(pdto.start_rent ?? '', 'YYYY-MM-DD'), 'days')
            }
            total += (pdto.amount * (pdto.renting ?? 0) * (diff + 1))
        } else {
            total += (pdto.amount * pdto.value)
        }
    })
    return currencyFormat(total)
})

const totalWeight = computed(() => {
    return shopping.getWeight.value
})

const taxes = computed(() => {
    return currencyFormat(
        (parseInt((totalDue.value as any).replaceAll('$', '').replaceAll(',', ''))
            - parseInt((totalDue.value as any).replaceAll('$', '').replaceAll(',', ''))
            * ((whoQuotate.value.discount ?? 0) / 100)
        )
        * ((whoQuotate.value.taxing ?? 0) / 100)
    )
})

const discount = computed(() => {
    return currencyFormat(
        parseInt((totalDue.value as any).replaceAll('$', '').replaceAll(',', ''))
        * ((whoQuotate.value.discount ?? 0) / 100)
    )
})

const finalDue = computed(() => {
    // Preguntar cómo se aplican los descuentos e impuestos
    const total = getTotalValue(
        parseInt((totalDue.value as any).replaceAll('$', '').replaceAll(',', '')),
        whoQuotate.value.transport,
        whoQuotate.value.discount,
        whoQuotate.value.taxing,
        true
    )
    return total
})

defineExpose({ canSave, whoQuotate, totalDue, totalWeight, products, clientEmail, quotationTerms })


const setProductsDates = () => {
    nextTick(() => {
        console.log('min', whoQuotate.value.rent_min_date)
        shopping.setDates(0, whoQuotate.value.rent_min_date, whoQuotate.value.rent_max_date)
    })

}

onBeforeMount(async () => {
    listClients('')
    if (route.query.client) {
        props.value.editable.client = true
    }
    if (route.query.quote == '3') {
        props.value.editable.client = true
        props.value.editable.dates = true
        props.value.editable.products = true
    }
    if (Object.keys(loaded.quotation).length > 0) {
        console.log('setting data', loaded.quotation)
        const quote: quotationSchema = loaded.quotation as quotationSchema
        whoQuotate.value.min_date = moment(quote.min_date).format('YYYY-MM-DD')
        whoQuotate.value.max_date = moment(quote.max_date).format('YYYY-MM-DD')
        whoQuotate.value.renting = quote.renting ? true : false
        if (quote.rent_min_date) {
            whoQuotate.value.rent_min_date = moment(quote.rent_min_date).format('YYYY-MM-DD')
        }
        if (quote.rent_max_date) {
            whoQuotate.value.rent_max_date = moment(quote.rent_max_date).format('YYYY-MM-DD')
        }
        whoQuotate.value.hasTransport = quote.transport > 0
        whoQuotate.value.transport = quote.transport ?? 0
        whoQuotate.value.one_day = quote.one_day == true
        whoQuotate.value.taxing = quote.taxing
        whoQuotate.value.discount = quote.discount
    }
    let { data } = await listQuotationTerms()
    quotationTerms.value = (data as quotationTermsSchema[]).map(term => {
        const aux: quotationTermsOnQuote = {...term, checked: false}
        if((loaded.quotation as quotationSchema)?.conditions?.includes(term.id.toString())) aux.checked = true
        return aux
    })

    subscribe(quotationTerms, true)
})

onBeforeUnmount(() => {
    unsubscribe()
})

</script>

<style scoped>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
}
</style>
