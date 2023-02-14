<template>
    <div class="m-10 flex flex-col items-start min-h-[70vh]">
        <div class="flex tablet:flex-row justify-between items-center w-full phone:flex-col phone:items-start">
            <h1 class="flex flex-row justify-center laptop:text-4xl py-2 phone:text-2xl">
                <span class="text-left">
                    {{ strings.title[language] }}
                </span>
                <div
                    class="flex items-center px-2 phone:text-xs tablet:text-sm rounded-xl bg-secondary text-white ml-2">
                    {{ data.length + strings.products[language] }}
                </div>
            </h1>
            <div class="flex h-fit ">
                <Button v-if="writePer" exactColor color="secondary" icon="Add" :content=strings.newItem[language]
                    @click="procesDialog = 'creation', dialogItem = true" />
            </div>
        </div>
        <!-- Filtro -->
        <input class="border my-2 px-2 py-2 tablet:w-1/2 phone:w-full rounded-lg border-solid outline-secondary"
            :placeholder=strings.search[language] v-model="filter" />

        <div class="flex items-center" v-if="isRenting">
            <span class="italic font-bold px-5">
                {{ strings.filter[language] }}:
            </span>
            <Tag :title="filters.venta.label[language]" v-model="filters.venta.value" />
            <Tag :title="filters.alquiler.label[language]" v-model="filters.alquiler.value" />
        </div>
        <!-- Tabla de inventario -->
        <div class="flex flex-col transition-all duration-300 ease-in-out w-full pt-3">
            <!-- Headers  -->
            <div class="flex text-black w-full">
                <div class="flex w-full border font-bold rounded-2xl bg-gray-100 px-2 py-4">
                    <div v-for="(head) in headers" :key="head.accessor" class="items-center justify-center select-none"
                        :class="[
                            head.sort ? 'cursor-pointer' : '',
                            head.width,
                            configTable.color ? `bg-[${configTable.color}]` : 'bg-blue-500',
                        ]">
                        {{ head.title }}
                    </div>
                </div>
            </div>

            <!-- Body table -->
            <div v-if="dataTabla.length != 0">
                <div v-for="item in dataTabla" :key="item.id" @mouseleave="item.showAction = false"
                    class="flex flex-wrap flex-row w-full px-2 py-4 cursor-pointer select-none my-1 border border-black rounded-2xl shadow"
                    :class="!item.showAction ? 'hover:bg-gray-50' : ''"
                    @contextmenu.prevent="contextProductData.show = false; openProductContext($event, item)"
                    @click="handleTouch(item)">
                    <div class="tablet:w-2/5 phone:w-[45%] flex flex-row text-left items-center">{{ item.name }}</div>
                    <div class="tablet:w-[14%] flex phone:w-[45%] justify-center items-center">
                        <div class="px-2 rounded"
                            :class="[item.stock > 0 ? 'bg-primary text-white' : 'bg-third text-white']">
                            {{ item.stock }}
                        </div>
                    </div>
                    <div class="w-[14%] tablet:flex phone:hidden justify-center overflow-x-hidden text-ellipsis">{{
                        currencyFormat(item.price)
                    }}</div>
                    <div class="w-[14%] tablet:flex phone:hidden justify-center overflow-x-hidden text-ellipsis">{{
                        currencyFormat(item.wholesale ?? 0)
                    }}
                    </div>
                    <div class="w-[14%] tablet:flex phone:hidden justify-center overflow-x-hidden text-ellipsis">{{
                        currencyFormat(item.rent ?? 0)
                    }}</div>
                    <div class="tablet:w-[4%] tablet:flex phone:w-[10%] justify-center">
                        <Icon v-if="editPer" icon="more_vert" class="icon_hover"
                            @click="openProductContext($event, item)" />
                    </div>
                    <div class="w-full  flex flex-wrap flex-row justify-start items-start text-left border-t-2 border-gray-400 mt-2 pt-2"
                        v-if="item.showAction">
                        <div class="phone:w-1/2 tablet:hidden">
                            <strong>
                                Precio:
                            </strong>
                            <span class="italic">{{ currencyFormat(item.price ?? 0) }}</span>
                        </div>
                        <div class="phone:w-1/2 tablet:hidden">
                            <strong>
                                Costo:
                            </strong>
                            <span class="italic">{{ currencyFormat(item.cost ?? 0) }}</span>
                        </div>
                        <div class="phone:w-1/2 tablet:hidden" v-if="item.rent">
                            <strong>
                                Alquiler:
                            </strong>
                            <span class="italic">{{ currencyFormat(item.rent ?? 0) }}</span>
                        </div>
                        <div class="phone:w-full tablet:w-full">
                            <strong>
                                {{ strings.descriptions[language] }}
                            </strong><span class="italic">{{ item.description }}</span>
                        </div>
                        <div class="phone:w-full tablet:w-1/3">
                            <strong>
                                {{ strings.OnSales[language] }}
                            </strong>
                            <span class="italic">{{ currencyFormat(item.onSales ?? 0) }} - ({{ item.sold ?? 0 }})</span>
                        </div>
                        <div class="phone:w-full tablet:w-1/3">
                            <strong>
                                {{ strings.OnBuying[language] }}
                            </strong>
                            <span class="italic">{{ currencyFormat(item.onBuying ?? 0) }}</span>
                        </div>
                        <div class="phone:w-full tablet:w-1/3">
                            <strong>
                                {{ strings.OnLosses[language] }}
                            </strong>
                            <span class="italic">{{ currencyFormat(item.onLosses ?? 0) }} - ({{ item.expired ?? 0 }})
                            </span>
                        </div>
                        <div class="phone:w-full tablet:w-1/3">
                            <strong>
                                {{ strings.profit[language] }}
                            </strong>
                            <span class="italic">{{ currencyFormat((item.onSales ?? 0) - (item.onBuying ?? 0) -
                                (item.onLosses ?? 0))
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="px-2 py-4"> {{ strings.noData[language] }}</div>
        </div>
        <div class="h-[10vh]">

        </div>
        <PdtoContext ref="productContextMenu" v-if="contextProductData.show" :top="contextProductData.top"
            :left="contextProductData.left" :product="itemSelected" @edit="editItem" @dispatch="dispatchItem"
            @close="contextProductData.show = false; itemSelected = null"
            @closeWithData="contextProductData.show = false" @return="returnItem" />
        <!-- Modal add Item -->
        <AddItem v-if="dialogItem" :process="procesDialog" :product="productToEdit"
            @close="dialogItem = false, productToEdit = null" />

        <Modal v-if="sidebarStatus.createQuotation" @close="sidebarStatus.createQuotation = false">
            <template v-slot:header>
                Crear Cotización
            </template>
            <template v-slot:body>
                <CreateQuotation ref="createQuotationComponent" />
            </template>
            <template v-slot:actions>
                <div class="flex w-full">
                    <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                        @click="sidebarStatus.createQuotation = false;" />
                    <Button exactColor color="primary" icon="save" content="Guardar" @click="addNewQuotation()"
                        :disabled="!(createQuotationComponent?.canSave ?? false)" />
                </div>
            </template>
        </Modal>

        <Modal v-if="dispatchView.show" @close="dispatchView.show = false; itemSelected = null">
            <template v-slot:header>
                Remisión de producto
            </template>
            <template v-slot:body>
                <DistpatchForm ref="dispatchForm" />
            </template>
            <template v-slot:actions>
                <div class="flex w-full">
                    <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                        @click="dispatchView.show = false;" />
                    <Button exactColor color="primary" icon="save" content="Guardar" @click="createDispatchItem()"/>
                </div>
            </template>
        </Modal>

        <Modal v-if="returnView.show" @close="returnView.show = false; itemSelected = null">
            <template v-slot:header>
                Devolución de producto
            </template>
            <template v-slot:body>
                <ReturnForm ref="returnForm" :product="itemSelected" />
            </template>
            <template v-slot:actions>
                <div class="flex w-full">
                    <Button exactColor color="third" class="mr-2" icon="close" content="Cancelar"
                        @click="returnView.show = false;" />
                    <Button exactColor color="primary" icon="save" content="Guardar" @click="createReturnItem()"/>
                </div>
            </template>
        </Modal>

        <!-- Actions decisions modals -->
        <Alert v-show="alertMessageContent.show" @close="alertMessageContent.show = false"
            :title="alertMessageContent.title" :description="alertMessageContent.description"
            :type="alertMessageContent.type" />
    </div>
</template>
  
<script setup lang="ts">
import { computed, type ComputedRef, ref, onMounted, onBeforeUnmount, onBeforeMount, type Ref } from 'vue';
import { Alert, Icon, Button, Input, Modal } from '@/components/Generics/generics'
import AddItem from '@/components/NewItem.vue'
import type { productBasicTransaction, productSchema, productsInCartType, token, productReturnTransaction } from '@/schemas'
import PdtoContext from './pdtoContext.vue';
import { onClickOutside } from '@vueuse/core'
import language from '@/services/language';
import Tag from './Generics/Tag.vue';
import { isRenting, writePer, editPer } from '@/composables/permissions'
import { sidebarStatus } from '@/composables/sidebarStatus';
import { useRoute, useRouter } from 'vue-router';
import CreateQuotation from './CreateQuotation.vue';
import { loaded, useShoppingCart } from '@/composables/ShoppingCart';
import { formatSerial, saveQuotation } from '@/services/accounting'
import moment from 'moment';
import { modalComp, type modalResponse, type promiseResponse } from '@/classes/Modal';
import { currencyFormat } from '@/composables/utils';
import { useProductStore } from '@/stores/products';
import { useAuthStore } from '@/stores/auth'
import socket from '@/composables/socket'
import DistpatchForm from './productView/distpatchForm.vue';
import { dispatchProduct, returnProduct } from '@/services/product';
import ReturnForm from './productView/returnForm.vue';

const route = useRoute()
const router = useRouter()
const shopping = useShoppingCart()
const createQuotationComponent = ref()
const dispatchForm = ref()
const returnForm = ref()

const alertMessageContent: any = ref({
    title: '',
    description: '',
    type: '',
    show: false
})

const productContextMenu = ref()
onClickOutside(productContextMenu, () => {
    if (contextProductData.value.show == true) contextProductData.value.show = false
})

const filters = ref({
    venta: {
        label: {
            Spanish: 'Venta',
            English: 'Sales'
        },
        value: true
    },
    alquiler: {
        label: {
            Spanish: 'Rentas',
            English: 'Renting'
        },
        value: true
    }
})

const strings = {
    title: {
        Spanish: 'Datos inventario',
        English: 'Data inventory'
    },
    name: {
        Spanish: 'Nombre',
        English: 'Name'
    },
    stock: {
        Spanish: 'Cantidad',
        English: 'Stock'
    },
    price: {
        Spanish: 'Precio',
        English: 'Price'
    },
    wholesale: {
        Spanish: 'Venta al por mayor',
        English: 'Wholesale'
    },
    cost: {
        Spanish: 'Costo',
        English: 'Cost'
    },
    filter: {
        Spanish: 'Filtrar tabla',
        English: 'Filter'
    },
    products: {
        Spanish: ' productos',
        English: ' products'
    },
    descriptions: {
        Spanish: 'Descripción: ',
        English: 'Description: '
    },
    categories: {
        Spanish: 'Categorias: ',
        English: 'Categories: '
    },
    OnSales: {
        Spanish: 'Ventas: ',
        English: 'On sales: '
    },
    profit: {
        Spanish: 'Balance: ',
        English: 'Profit: '
    },
    OnBuying: {
        Spanish: 'Compras: ',
        English: 'OnBuying: '
    },
    OnLosses: {
        Spanish: 'Perdidas: ',
        English: 'On losses: '
    },
    search: {
        Spanish: 'Buscar...',
        English: 'Search...'
    },
    newItem: {
        Spanish: 'Nuevo item',
        English: 'New item'
    },
    noData: {
        Spanish: 'No hay datos',
        English: 'No products added'
    },
    filters: {
        Spanish: 'Filtros',
        English: 'Filters'
    },
    renting: {
        Spanish: 'Alquiler',
        English: 'Renting'
    }
}
const dispatchView = ref({
    show: false
})
const returnView = ref({
    show: false
})
const dispatchItem = () => {
    dispatchView.value.show = true
}
const returnItem = () => {
    returnView.value.show = true
}
const createReturnItem = () => {
    if(!returnForm.value.canSave) return

    const payload: productReturnTransaction = {
        dispatch_id: returnForm.value.returnInfo.dispatch.id,
        quotation_id: returnForm.value.returnInfo.dispatch.quotation_id,
        client_id: returnForm.value.returnInfo.dispatch.client_id,
        products: [
            {
                id: itemSelected.value.id,
                amount: returnForm.value.returnInfo.amount,
                quotation_detail_id: returnForm.value.returnInfo.dispatch.quotation_detail_id
            }
        ]
    }
    console.log('payload', payload)
    modalComp.modal.show({
        title: 'Devolución de Producto',
        description: '',
        input: false,
        inputValue: '',
    }).then(async (res: promiseResponse) => {
        if (res.success) {
            const token = auth.getUser.token as token
            let { status, data }  = await returnProduct(token.value, payload)

            returnView.value.show = false
            alertMessageContent.value = {
                title: `Se ha creado la devolución #${formatSerial(data.returning_id)}`,
                description: '',
                type: 'success',
                show: true
            }
            setTimeout(() => {
                alertMessageContent.value.show = false
            }, 3000);
        }
    })
}
const createDispatchItem = () => {
    if (!dispatchForm.value.canSave) return

    const payload: productBasicTransaction = {
        client_id: dispatchForm.value.dispatchInfo.client.id,
        products: [
            {
                id: itemSelected.value.id,
                rent: itemSelected.value.rent,
                description: '',
                amount: dispatchForm.value.dispatchInfo.amount
            }
        ]
    }
    modalComp.modal.show({
        title: 'Remitiendo Producto',
        description: '',
        input: false,
        inputValue: '',
    }).then(async (res: promiseResponse) => {
        if (res.success) {
            const token = auth.getUser.token as token
            let { status, data } = await dispatchProduct(token.value, payload)
            dispatchView.value.show = false
            alertMessageContent.value = {
                title: `Se ha creado la remisión #${formatSerial(data.dispatching_id)}`,
                description: 'Este número de remisión será necesario para cuando se realice la devolución del producto',
                type: 'success',
                show: true
            }
            setTimeout(() => {
                alertMessageContent.value.show = false
            }, 3000);
        }
    })
}

const pdto = useProductStore()
const auth = useAuthStore()
const headers = ref([
    { title: strings.name[language.value], accessor: 'name', sort: true, sortDirection: '', width: 'phone:w-[45%] tablet:w-2/5 tablet:flex phone:block' },
    { title: strings.stock[language.value], accessor: 'stock', sort: true, sortDirection: '', width: 'phone:w-[45%] tablet:w-[14%] tablet:flex phone:block' },
    { title: strings.price[language.value], accessor: 'price', sort: true, sortDirection: '', width: 'tablet:w-[14%] tablet:flex phone:hidden' },
    { title: strings.wholesale[language.value], accessor: 'wholesale', sort: true, sortDirection: '', width: 'tablet:w-[14%] tablet:flex phone:hidden' },
    { title: strings.renting[language.value], accessor: 'rent', sort: true, sortDirection: '', width: 'tablet:w-[14%] tablet:flex phone:hidden' },
    { title: '', accessor: '', sort: false, sortDirection: '', width: 'phone:w-[10%] tablet:w-[4%] tablet:flex phone:block' },
])
const contextProductData = ref({
    left: 0,
    top: 0,
    show: false
})
const data: ComputedRef<Array<productSchema>> = computed(() => {
    return pdto.listProducts
})

const configTable = ref({
    color: 'black',
})

const itemSelected: Ref<any> = ref({})
const dialogItem = ref(false)
const procesDialog: Ref<'creation' | 'edit'> = ref('creation')
const productToEdit = ref(null)
const filter = ref('')

const openProductContext = (event: MouseEvent, product: productSchema) => {
    //
    contextProductData.value.left = event.x
    contextProductData.value.top = event.y
    contextProductData.value.show = true
    itemSelected.value = product
}


const dataTabla = computed(() => {
    return data.value?.filter((body) => {
        if (body.name.toLowerCase().includes(filter.value.toLowerCase())) {
            if (filters.value.alquiler.value && body.rent > 0) {
                return true
            }
            if (filters.value.venta.value && body.price > 0) {
                return true
            }
            // validate filters

        }
    })
})

const handleTouch = (item: any) => {
    if (screen.width >= 640) {
        item.showAction = !item.showAction
    }
}

const isQuoteMode = computed(() => {
    return route.query.quote == '1'
})

const alertMessage = (title: string, description: string, type: string) => {
    alertMessageContent.value = {
        title,
        description,
        type,
        show: true
    }
    setTimeout(() => {
        alertMessageContent.value.show = false
    }, 3000);
}

onBeforeMount(() => {
    if (route.query.quote == '2' && Object.keys(loaded.quotation).length == 0) {
        router.push({
            name: 'quote'
        })
    }
})

onMounted(() => {
    socket.socket?.on('productUpdated', (body: any) => {
        alertMessage(`Producto ${body.name} actualizado`,
            'Proceso completado.',
            'success')
    })

    if (isQuoteMode.value) {
        alertMessage('Modo de cotización',
            'Para crear una cotización, añada los productos al carrito y seleccione crear cotización',
            'success')
    }
    if (route.query.quote == '1') {
        shopping.clearBasket()
    }
})

onBeforeUnmount(() => {
    if (route.query.quote == '2' || route.query.quote == '1') {
        shopping.clearBasket()
        loaded.quotation = {}
    }
})

const addNewQuotation = async () => {
    if (!createQuotationComponent.value.canSave) return

    modalComp.modal.show({
        title: route.query.id ? 'Editar cotización' : 'Guardar cotización',
        description: route.query.id ?
            '¿Deseas <strong>editar</strong> esta cotización?' :
            '¿Deseas <strong>guardar</strong> esta cotización?',
        inputValue: ''
    }).then(async (r: modalResponse) => {
        if (r.success) {
            const quote = createQuotationComponent.value.whoQuotate

            const payload = {
                value: createQuotationComponent.value.totalDue.replaceAll('$', '').replaceAll(',', ''),
                id: route.query.id ?? null,
                client_id: quote.client.id,
                client_name: quote.client.name,
                project_id: quote.project?.id ?? null,
                min_validity: quote.min_date,
                max_validity: quote.max_date,
                isRenting: quote.renting,
                one_day: quote.one_day,
                from: quote.one_day ? null : quote.min_date,
                to: quote.one_day ? null : quote.max_date,
                email: createQuotationComponent.value.clientEmail,
                products: createQuotationComponent.value.products.map((pdto: productsInCartType) => {
                    pdto.days = quote.one_day ? 1 : (moment(pdto.end_rent ?? '', 'YYYY-MM-DD')).diff(moment(pdto.start_rent ?? '', 'YYYY-MM-DD'), 'days') + 1
                    return pdto
                }),
                discount: quote.discount,
                taxing: quote.taxing
            }

            let { data } = await saveQuotation((auth.getUser.token as token).value, payload)
            if (data?.ok) {
                shopping.clearBasket()
                sidebarStatus.createQuotation = false
                router.push({ name: 'quote' })
            }
        }
    })
}

const editItem = (product: any) => {
    productToEdit.value = product
    dialogItem.value = true
    procesDialog.value = 'edit'
}

</script>
  
<style scoped>
.icon_hover {
    border-radius: 99%;
    transition: 200ms;
    padding: 3px;
}

.icon_hover:hover {
    background-color: #dbdbdb;
    transition: 200ms;
}
</style>