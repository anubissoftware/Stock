<template>
    <transition enter-from-class="opacity-0" enter-active-class="transition duration-500" leave-to-class="opacity-0"
        leave-active-class="transition duration-500">
        <Modal @close="closeComponent()" class="transition-all duration-300 ease-in-out z-30" @keyup.esc="closeComponent()">
            <template v-slot:header>
                <div v-if="!initEditRecipe && props.process == 'creation'" class="font-bold">
                    {{ string.addNew[language] }}
                </div>
                <div v-if="props.process == 'edit'" class="font-bold">
                    {{ string.editTitle[language] }}
                </div>
                <div v-if="initEditRecipe">
                    {{ string.editRecipe[language] }}
                </div>
            </template>

            <template v-slot:body>
                <!-- Campos necesario edición producto  -->
                <div v-if="!initEditRecipe" class="w-full 
                                phone:max-h-none phone:py-4 phone:px-2 phone:overflow-auto
                                tablet:max-h-none ">
                    <!-- Nombre y Stock -->
                    <div class="flex tablet:flex-row phone:flex-col 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-6">
                        <Input class="phone:mb-6 phone:w-full tablet:mb-0 tablet:mr-8 tablet:w-1/2" color="black"
                            :disabled="props.process == 'edit'" :placeholder=string.nameHolder[language]
                            :label=string.name[language] v-model="newItem.name" size="md" type="text" required />
                        <Input :disabled="props.process == 'edit'" class="phone:w-full tablet:w-1/2" color="black"
                            placeholder="Stock producto" label="Stock" v-model="newItem.stock" size="md" type="number"
                            required />
                    </div>
                    <div class="flex tablet:flex-row phone:flex-col 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-6">
                        <Input class="w-full" color="black" :placeholder=string.refHolder[language]
                            :label=string.refHolder[language] v-model="newItem.ref" size="md" type="text" />
                    </div>
                    <!-- Descripción -->
                    <div class="flex tablet:flex-row phone:flex-col 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-6">
                        <Input class="w-full" color="black" :placeholder=string.descriptionHolder[language]
                            :label=string.description[language] v-model="newItem.description" size="md" type="text" />
                    </div>
                    <!-- Categorias  -->
                    <div v-if="categories.length !== 0" class="flex tablet:flex-row phone:flex-col 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-4">
                        <Select class="w-full" color="black" :label=string.categories[language] v-model="newItem.categories"
                            size="md" :items="categories" :value="'name'" required chips />
                    </div>
                    <!-- Unidades -->
                    <!-- <div
                    v-if="categories.length !== 0 && false"
                    class="flex tablet:flex-row phone:flex-col 
                    tablet:justify-between tablet:items-center 
                    phone:justify-between phone:items-start 
                    pb-6">
                        <Select
                            class="w-full"
                            color="black"
                            :label= string.units[language]
                            v-model="newItem.unit"
                            :items="categories"
                            size="md"
                            type="text"
                            value="notation"
                            required
                        />
                    </div> -->
                    <!-- Recipe? -->
                    <div class="hidden flex-row 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-10" v-if="false">
                        <div class="flex">
                            <span class="mr-2 text-base"> {{ string.recipe[language] }} </span>
                            <Switch v-model="newItem.isRecipe" size="md" color="primary" exactColor />
                        </div>
                        <Button v-if="newItem.isRecipe" @click="initEditRecipe = true" size="md" color="primary" exactColor
                            icon="edit" :content=string.editRecipe[language] />
                    </div>

                    <div class="border-t-2 border-t-black pb-8 text-left font-bold italic text-2xl">
                        Precios
                    </div>

                    <!-- Costo y deonominación -->
                    <div class="flex tablet:flex-row phone:flex-col 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-6">
                        <Input class="phone:mb-4 phone:w-full tablet:mb-0 tablet:mr-8 tablet:w-1/2" color="black"
                            :placeholder=string.costHolder[language] :label=string.cost[language] v-model="newItem.cost"
                            size="md" type="number" />
                        <Input class="phone:w-full tablet:w-1/2" color="black" :placeholder=string.coin[language]
                            :label=string.coin[language] v-model="newItem.currency" size="md" type="text" disabled />
                    </div>
                    <!-- Precio al detal y por mayor -->
                    <div class="flex tablet:flex-row phone:flex-col 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-6">
                        <Input class="phone:mb-4 phone:w-full tablet:mb-0 tablet:mr-8 tablet:w-1/2" color="black"
                            :placeholder=string.retailHolder[language] :label=string.retail[language]
                            v-model="newItem.price" size="md" type="number" />
                        <Input class="phone:w-full tablet:w-1/2" color="black" :placeholder=string.wholesaleHolder[language]
                            :label=string.wholesale[language] v-model="newItem.wholesale" size="md" type="number" />
                    </div>

                    <div class="flex tablet:flex-row phone:flex-col 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-6 tablet:pr-8">
                        <Input class="phone:mb-4 phone:w-full tablet:mb-0 tablet:mr-8 tablet:w-1/2" color="black"
                            :placeholder=string.retailHolder[language] :label=string.renting[language]
                            v-model="newItem.rent" size="md" type="number" />
                    </div>

                    <template v-if="productHandlerVersion >= 2">
                        <div class="border-t-2 border-t-black pb-8 text-left font-bold italic text-2xl">
                            Dimensiones y peso
                        </div>
                        <div class="flex w-full flex-wrap">
                            <div class="flex tablet:w-1/2 phone:w-full tablet:pr-5 pb-6">
                                <Input class="w-full" color="black" placeholder="Peso"
                                    label="Peso" v-model="newItem.weight" size="md" type="number" />
                            </div>
                            <div class="flex tablet:w-1/2 phone:w-full tablet:pl-5 pb-6">
                                <Input class="w-full" color="black" placeholder="Profundidad"
                                    label="Profundidad" v-model="newItem.depth" size="md" type="number" />
                            </div>
                            <div class="flex tablet:w-1/2 phone:w-full tablet:pr-5 pb-6">
                                <Input class="w-full" color="black" placeholder="Ancho"
                                    label="Ancho" v-model="newItem.width" size="md" type="number" />
                            </div>
                            <div class="flex tablet:w-1/2 phone:w-full tablet:pl-5 pb-6">
                                <Input class="w-full" color="black" placeholder="Alto"
                                    label="Alto" v-model="newItem.height" size="md" type="number" />
                            </div>
                            <div class="flex tablet:w-1/2 phone:w-full tablet:pr-5 pb-6">
                                <Input class="w-full" color="black" placeholder="Medida lineal"
                                    label="Medida lineal" v-model="newItem.lineal" size="md" type="number" />
                            </div>
                        </div>
                    </template>

                    <span v-if="someDetails" class="text-red-500">
                        {{ details }}
                    </span>
                </div>
                <!-- Edición de receta de productos -->
                <div v-if="initEditRecipe" class="w-full                return
                                phone:max-h-none phone:py-4 phone:px-2 phone:overflow-auto
                                tablet:max-h-none ">
                    <!-- Seleccion de producto  -->
                    {{ productToRecipe }}
                    <div class="flex tablet:flex-row phone:flex-col 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-4">
                        <Autocomplete color="black" :placeholder=string.selectProduct[language]
                            :label=string.nameHolder[language] v-model="productToRecipe.product" size="md" type="text"
                            :items="products" value="name" />
                    </div>
                    <!-- Amount y unidad -->
                    <div class="flex tablet:flex-row phone:flex-col 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-4">
                        <Input class="phone:mb-4 phone:w-full tablet:mb-0 tablet:mr-8 tablet:w-1/2" color="black"
                            :placeholder=string.amount[language] :label=string.amount[language]
                            v-model="productToRecipe.amount" size="md" type="number" />
                        <Select class="phone:w-full tablet:w-1/2" color="black" :label=string.units[language]
                            v-model="productToRecipe.unit" :items="units" size="md" type="text" value="notation" />
                    </div>
                    <!-- Extras -->
                    <div class="flex tablet:flex-row phone:flex-col 
                                    tablet:justify-between tablet:items-center 
                                    phone:justify-between phone:items-start 
                                    pb-4">
                        <Input class="w-full phone:mb-4 tablet:mb-0" color="black" :placeholder=string.infoExtra[language]
                            label="Extras" v-model="productToRecipe.extras" size="md" type="text" />
                    </div>
                    <!-- Botones de añadir a receta -->
                    <div class="flex flex-row justify-start tablet:items-center phone:items-start pb-4">
                        <Button exactColor color="third" size="sm" class="mr-2" icon="delete"
                            :content=string.clear[language] @click="clearProduct()" />
                        <Button exactColor color="secondary" size="sm" icon="add" :content=string.addRecipe[language]
                            @click="addToRecipe()" />
                    </div>
                    <!-- Detalle cuando falta algun dato -->
                    <div v-if="detailsRecipe != ''" class="text-red-500 py-2">{{ detailsRecipe }}</div>
                    <Divider class="my-4" />
                    <div v-if="recipe.length != 0">
                        <div v-for="(item, index) in recipe" :key="index" class="flex flex-row items-center justify-between py-1 px-2 border border-black shadow-lg rounded-xl mb-2
                                        hover:bg-gray-200">
                            <div class="flex-col flex items-start ">
                                <div class="font-bold ">
                                    {{ item.product.name }}
                                </div>
                                <div>
                                    {{ item.amount + ' ' + item.unit.notation }}
                                </div>
                            </div>
                            <Icon class="cursor-pointer" @click="deleteFromRecipe(item)" icon="clear" />
                        </div>
                    </div>
                    <div v-else class="py-4 text-black">
                        {{ string.noProducts[language] }}
                    </div>
                </div>
            </template>

            <template v-slot:actions>
                <div v-if="!initEditRecipe && props.process == 'creation'" class="flex w-full">
                    <Button exactColor color="third" class="mr-2" icon="close" :content=string.cancel[language]
                        @click="closeComponent()" />
                    <Button exactColor color="primary" icon="save" :content=string.save[language]
                        @click="confirmAddItem()" />
                </div>
                <!-- <div v-if="initEditRecipe" class="flex w-full">
                    <Button exactColor color="third" class="mr-2" icon="close" :content= string.cancel[language] @click="initEditRecipe = false" />
                    <Button exactColor color="secondary" icon="done" :content= string.saveRecipe[language] @click="finishRecipe()" />
                </div> -->
                <div v-if="props.process == 'edit'" class="flex w-full">
                    <Button exactColor color="third" class="mr-2" icon="close" :content=string.cancel[language]
                        @click="closeComponent()" />
                    <Button exactColor color="secondary" icon="done" :content=string.edit[language]
                        @click="confirmEditItem()" />
                </div>
            </template>
            <Alert v-show="alertMessageContent.show" @close="alertMessageContent.show = false"
                :title="alertMessageContent.title" :description="alertMessageContent.description"
                :type="alertMessageContent.type" />
        </Modal>
    </transition>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed, type Ref, type ComputedRef, defineEmits, defineProps } from 'vue';
import { Modal, Divider, Autocomplete, Button, Icon, Input, Select, Switch, Alert } from '@/components/Generics/generics'
import { Item } from '@/classes/Item'
import { getCategories, getUnits, createProduct, getItems, updateItemService } from '@/services/product';
import { modalComp, type modalResponse } from '@/classes/Modal';
import language from '@/services/language';
import { useProductStore } from '@/stores/products';
import { useAuthStore } from '@/stores/auth'
import type { productSchema, token } from '@/schemas';
import { productHandlerVersion } from '@/composables/permissions'



export interface DispatchCreationProps {
    process: 'creation' | 'edit',
    product?: any
}
const props = defineProps<DispatchCreationProps>()

const string = {
    renting: {
        Spanish: 'Renta por día',
        English: 'Rent per day'
    },
    addNew: {
        Spanish: 'Agregar nuevo item',
        English: 'Add new item'
    },
    editTitle: {
        Spanish: 'Editar item',
        English: 'Edit item'
    },
    recipe: {
        Spanish: 'Es receta',
        English: 'its recipe'
    },
    statics: {
        Spanish: 'Estadística',
        English: 'Statistics'
    },
    config: {
        Spanish: 'Configuración',
        English: 'Configuration'
    },
    logout: {
        Spanish: 'Cerrar Sesión',
        English: 'Logout'
    },
    scan: {
        Spanish: 'Scanear',
        English: 'Scan'
    },
    name: {
        Spanish: 'Nombre',
        English: 'Name'
    },
    nameHolder: {
        Spanish: 'Nombre producto',
        English: 'Name product'
    },
    description: {
        Spanish: 'Descripción',
        English: 'Description'
    },
    descriptionHolder: {
        Spanish: 'Descripción del producto',
        English: 'Description of product'
    },
    refHolder: {
        Spanish: 'Referencia',
        English: 'Ref'
    }
    ,
    categories: {
        Spanish: 'Categorias',
        English: 'Categories'
    },
    units: {
        Spanish: 'Unidades',
        English: 'Units'
    },
    cost: {
        Spanish: 'Costo',
        English: 'Cost'
    },
    costHolder: {
        Spanish: 'Costo producto',
        English: 'Product cost'
    },
    coin: {
        Spanish: 'Moneda',
        English: 'Coin'
    },
    retail: {
        Spanish: 'Al detal',
        English: 'Retail'
    },
    retailHolder: {
        Spanish: 'Precio al detal',
        English: 'Retail cost'
    },
    wholesale: {
        Spanish: 'Al mayor',
        English: 'Wholesale'
    },
    wholesaleHolder: {
        Spanish: 'Precio al mayor',
        English: 'Wholesale cost'
    },
    editRecipe: {
        Spanish: 'Editar receta',
        English: 'Edit recipe'
    },
    cancel: {
        Spanish: 'Cancelar',
        English: 'Cancel'
    },
    save: {
        Spanish: 'Guardar producto',
        English: 'Save item'
    },
    edit: {
        Spanish: 'Editar producto',
        English: 'Edit item'
    },
    saveRecipe: {
        Spanish: 'Guardar receta',
        English: 'Save recipe'
    },
    selectProduct: {
        Spanish: 'Seleccionar producto',
        English: 'Select product'
    },
    amount: {
        Spanish: 'Cantidad',
        English: 'Amount'
    },
    infoExtra: {
        Spanish: 'Información extra',
        English: 'Extra information'
    },
    clear: {
        Spanish: 'Limpiar',
        English: 'Clear'
    },
    addRecipe: {
        Spanish: 'Agregar receta',
        English: 'Add recipe'
    },
    noProducts: {
        Spanish: 'No hay productos agregados',
        English: 'No products added'
    }



}

const alertMessageContent: any = ref({
    title: '',
    description: '',
    type: '',
    show: false
})

const emit = defineEmits<{ (e: 'close'): void }>()
const socket = ref()
const pdto = useProductStore()
const auth = useAuthStore()
const newItem: Ref<Item> = ref(new Item())

const units: Ref<Array<any>> = ref([])
const categories: ComputedRef<Array<any>> = computed(() => {
    console.log('categories', pdto.listCategories)
    return pdto.listCategories
})
const products: ComputedRef<Array<any>> = computed(() => {
    return pdto.listProducts
})

const modal = ref()

const someDetails: Ref<boolean> = ref(false)
const initEditRecipe: Ref<boolean> = ref(false)
const details: Ref<string> = ref('')
const detailsRecipe: Ref<string> = ref('')
const productToRecipe: Ref<itemRecipe> = ref({
    product: '',
    amount: 1,
    unit: 1,
    extras: ''
})
const recipe: Ref<Array<any>> = ref([])

interface itemRecipe {
    product: any
    amount: number
    unit: number
    extras: string
}

onMounted(async () => {
    //Get units
    const token = auth.getUser.token as token
    // let getUn = await getUnits(token.value)
    // units.value = getUn.data 
    if (props.product != null) {
        const pdtoTemp: Item = { ...props.product }
        if (Array.isArray(JSON.parse(props.product.categories).values)) {
            let categoriesResult = categories.value.filter((cat) => JSON.parse(props.product.categories).values.includes(cat.id));
            console.log('cats', categoriesResult)
            pdtoTemp.categories = categoriesResult
        } else {
            pdtoTemp.categories = [{}]
        }
        newItem.value = pdtoTemp
    }
})
onUnmounted(() => {
    // socket.value.disconnect()
})

//Functions 
const closeComponent = () => {
    emit('close')
    return
}

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

const confirmAddItem = async () => {

    if (Object.keys(newItem.value.categories[0]).length == 0) {
        someDetails.value = true
        details.value = 'Deben asignarse categoria y unidad al producto'
    } else {
        modalComp.modal.show({
            title: 'Confirmar',
            description: 'Deseas agregar este nuevo producto?',
            inputValue: ''
        })
            .then(async (response: modalResponse) => {

                if (response.success) {
                    await reformatItem()
                    newItem.value.recipeDetail = await mapRecipe()
                    const token = auth.getUser.token as token
                    let response = await createProduct(token.value, newItem.value as unknown as productSchema)
                    if (response.status == 200) {
                        closeComponent()
                    }
                } else {
                    return
                }

            })

    }
}

const confirmEditItem = async () => {
    if (Object.keys(newItem.value.categories).length == 0) {
        someDetails.value = true
        details.value = 'Deben asignarse categoria al producto'
    }
    modalComp.modal.show({
        title: 'Confirmar edicion',
        description: 'Deseas terminar la edición del producto?',
        inputValue: ''
    })
        .then(async (response: boolean) => {
            if (response) {
                const token = auth.getUser.token as token
                let temp

                if (newItem.value.categories.length > 0) {
                    try {
                        temp = newItem.value.categories.map((cat: any) => {
                            if (!cat.id) throw new Error('')
                            return cat.id
                        })
                    } catch (err) {
                        temp = {}
                    }
                } else {
                    temp = {}
                }
                newItem.value.categories = JSON.stringify({ values: temp })
                console.log(newItem.value)
                updateItemService(token.value, newItem.value as unknown as productSchema).then(response => {
                    if (response.status == 200) {
                    } else {
                        alertMessage('Algo salio mal',
                            'Vuelve a interlo mas tarde',
                            'error')
                    }
                })
                closeComponent()
            }
        })
}

const reformatItem = async () => {
    if (newItem.value.isRecipe == false) {
        newItem.value.updateIngre = false
    }
    //Units
    // newItem.value.unit = newItem.value.unit.id
    newItem.value.unit = 1
    //Categories 
    console.log('categories', newItem.value.categories)
    if (newItem.value.categories.length > 0) {
        newItem.value.categories = newItem.value.categories.map((cat: any) => {
            return cat.id
        })
    } else {
        newItem.value.categories = {}
    }
}

const mapRecipe = async () => {
    let recipeMapped = recipe.value.map(recipe => {
        return {
            result: 0,
            required: recipe.product.id,
            amount: recipe.amount,
            unit: recipe.unit.id,
            extras: recipe.extras
        }
    })
    return recipeMapped
}

const addToRecipe = async () => {
    if (productToRecipe.value.product == '' || productToRecipe.value.unit == 0) {
        detailsRecipe.value = 'Faltan datos por diligenciar'
        return
    }

    let duplicateProduct = recipe.value.filter(product => {
        if (product.product.id == productToRecipe.value.product.id) {
            return product
        }
    })
    if (duplicateProduct.length != 0) {
        detailsRecipe.value = 'Este producto ya fue agregado'
        return
    }

    recipe.value.push(productToRecipe.value)
    detailsRecipe.value = ''
    clearProduct()
}

const deleteFromRecipe = async (item: itemRecipe) => {
    recipe.value = recipe.value.filter(detail => {
        if (detail.product.id != item.product.id) {
            return detail
        }
    })
}

const clearProduct = async () => {
    productToRecipe.value = {
        product: '',
        amount: 1,
        unit: 0,
        extras: ''
    }
}

const finishRecipe = async () => {
    // initEditRecipe.value = false
    modalComp.modal.show({
        title: 'Confirmar ingredientes',
        description: 'Deseas terminar la edición de ingrediente?',
        inputValue: ''
    })
        .then(async (response: boolean) => {
            if (response) {
                initEditRecipe.value = false
            }
        })
}



</script>