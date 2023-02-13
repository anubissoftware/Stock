<template>
    <div class="flex w-full flex-wrap">
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Autocomplete v-model="whoQuotate.client" :items="clients" value="name" color="black" placeholder="Cliente"
                label="Cliente" size="md" type="text" required :readonly="props.editable?.client"
                @update:model-value="listClients(whoQuotate.client as string); getProjects('')" />
        </div>
        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Autocomplete v-model="whoQuotate.project" :items="projects" value="name" color="black"
                :readonly="props.editable?.client" placeholder="Proyecto" label="Proyecto" size="md" type="text"
                v-if="displayInputs.projects && projectos" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" placeholder="Valor liquidado" label="Valor liquidado" size="md"
                type="text" required @update:model-value="null" :disabled="true" v-model="totalDue" />
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6 relative">
            <Input class=" w-full" color="black" placeholder="Impuestos" label="Impuestos" size="md" type="text"
                required @update:model-value="null" :disabled="props.editable?.client && false" v-model="whoQuotate.taxing" />
            <span class="absolute top-3 right-3 text-gray-400">
                {{ taxes }}
            </span>
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6 relative">
            <Input class=" w-full" color="black" placeholder="Descuento" label="Descuento" size="md" type="text"
                required @update:model-value="null" :disabled="props.editable?.client && false" v-model="whoQuotate.discount" />
            <span class="absolute top-3 right-3 text-gray-400">
                {{ discount }}
            </span>
        </div>

        <div class="laptop:w-1/2 phone:w-full pr-2 pb-6">
            <Input class=" w-full " color="black" placeholder="Valor total" label="Valor total" size="md" type="text"
                required @update:model-value="null" :disabled="true" v-model="finalDue" />
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

        <div class="w-full pr-2 pb-6">
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
            <div class="w-full pr-2 pb-6">
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

        <div class="w-full pr-2 ">
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
    </div>
</template>

<script lang="ts" setup>
import { useShoppingCart, productsInCart, loaded } from '@/composables/ShoppingCart';
import { getClients, listAllProjects } from '@/services/clients';
import moment from 'moment';
import { computed, ref, type Ref, onBeforeMount, type ComputedRef, nextTick, defineExpose, defineProps } from 'vue';
import { useRoute } from 'vue-router';
import type { clientschema, projectSchema, productsInCartType, token, quotationSchema } from '@/schemas';
import { Icon } from './Generics/generics';
import { Input, Autocomplete, CheckBox } from './Generics/generics';
import { currencyFormat } from '@/composables/utils';
import { useAuthStore } from '@/stores/auth'
import { projects as projectos } from '@/composables/permissions'

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
    min_date: string,
    max_date: string,
    renting: boolean,
    rent_min_date: string,
    rent_max_date: string,
    one_day: boolean,
    taxing: number,
    discount: number
}

const route = useRoute()
const store = useAuthStore()
const shopping = useShoppingCart()
const clients: Ref<Array<clientschema>> = ref([])
const projects: Ref<Array<projectSchema>> = ref([])
const cancelToken: Ref<AbortController | undefined> = ref(undefined)


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
    min_date: moment().format('YYYY-MM-DD'),
    max_date: moment().add(1, 'd').format('YYYY-MM-DD'),
    renting: false,
    rent_min_date: moment().add(1, 'd').format('YYYY-MM-DD'),
    rent_max_date: moment().add(2, 'd').format('YYYY-MM-DD'),
    one_day: true,
    taxing: 0,
    discount: 0
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

const getProjects = async (value: string) => {
    whoQuotate.value.project = ''
    if(!projectos) return
    if (typeof whoQuotate.value.client == 'object') {
        if (Object.keys(loaded.quotation).length > 0) {
            clientEmail.value = (loaded.quotation as quotationSchema).email ?? ''
        } else {
            clientEmail.value = whoQuotate.value.client.contact_email
        }
        if (cancelToken.value) {
            cancelToken.value.abort()
        }
        cancelToken.value = new AbortController()
        const token = store.getUser.token as token
        let { data } = await listAllProjects(
            token.value,
            { client_id: whoQuotate.value.client.id, name: value },
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
}

const listClients = async (value: string) => {
    if (typeof value == 'object') return
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
    return currencyFormat(
        parseInt((totalDue.value as any).replaceAll('$', '').replaceAll(',', ''))
        * (1 - (whoQuotate.value.discount ?? 0) / 100)
        * (1 + (whoQuotate.value.taxing ?? 0) / 100)
    )
})

defineExpose({ canSave, whoQuotate, totalDue, products, clientEmail })


const setProductsDates = () => {
    nextTick(() => {
        console.log('min', whoQuotate.value.rent_min_date)
        shopping.setDates(0, whoQuotate.value.rent_min_date, whoQuotate.value.rent_max_date)
    })

}

onBeforeMount(() => {
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
        console.log('setting data')
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
        whoQuotate.value.one_day = quote.one_day == true
        whoQuotate.value.taxing = quote.taxing
        whoQuotate.value.discount = quote.discount
    }
    console.log()
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
