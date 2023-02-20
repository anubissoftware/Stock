<template>
    <div class="">
        <button class="relative px-2 py-1 mr-2 flex items-center justify-center rounded-lg 
            hover:bg-white hover:text-primary" :class="listOpened.view ? ' bg-white text-primary' : ''"
            @click="toggleMenu()">
            <Icon icon="local_shipping" />
            <span class="px-1 phone:hidden tablet:flex">
                {{ strings.shopping[language] }}
            </span>
            <div class="absolute -top-2 -right-2 bg-secondary rounded-full text-xs font-bold text-white h-5 w-5 flex flex-row justify-center items-center"
                :class="listOpened.view ? ' text-primary' : ''">
                <div>{{ shopping.listProducts().length < 10 ? shopping.listProducts().length : '9+' }} </div>
                </div>
        </button>
        <div v-if="listOpened.view" ref="ShoppingList" class="absolute my-2 bg-white text-black border text-xs rounded-lg tablet:w-[30rem] px-1 right-0
                phone:w-full flex flex-col justify-between phone:h-[90vh] tablet:h-auto
            ">
            <div v-if="shopping.listProducts().length > 0" class="tablet:max-h-[40vh] phone:max-h-[70vh] overflow-y-scroll">
                <div v-for="(item, index) in shopping.listProducts()" :key="index"
                    class="relative py-1 px-2 flex flex-row justify-between flex-wrap border-t first:border-b-0">
                    <img :src="getImageUrl('Recurso 7@2x.png')" class=" w-1/4 h-auto" alt="">
                    <div class=" w-2/4 text-start flex flex-col">
                        <span class=" font-bold text-sm">{{ item.name }}</span>
                        <span>Price: {{ currencyFormat(item.value * item.amount, false) }}</span>
                        <span>Rent: {{ currencyFormat((item.renting ?? 0) * item.amount, false) }} / d</span>
                    </div>
                    <div class=" w-1/4 flex flex-col items-center justify-center">
                        <Icon icon="delete" class="absolute top-2 right-2 w-3 h-5 text-sm cursor-pointer text-extra font-bold"
                                @click="shopping.deleteProduct(item)" />
                        <div class="flex flex-col items-center">
                            <span class=" h-4 flex justify-center items-center w-10 text-base cursor-pointer select-none font-bold bg-primary text-white rounded-t-lg opacity-70 hover:opacity-100"
                                @click="shopping.addToProduct(item.id)">
                                + </span>
                            <input type="number" v-model="item.amount"
                            class=" w-10 outline-primary border-primary border text-center"
                            @change="shopping.changeLocal($event, item.id)">
                            <span class=" h-4 flex justify-center items-center w-10 text-base cursor-pointer select-none font-bold bg-primary text-white rounded-b-lg opacity-70 hover:opacity-100"
                                @click="shopping.subToProduct(item.id)">
                                - </span>
                        </div>
                    </div>

                </div>
            </div>
            <div v-else class=" p-2">
                {{ strings.noProducts[language] }}
            </div>
            <div>
                <hr class="my-2" v-if="shopping.listProducts().length > 0">
                <div class="flex justify-between px-8 font-extrabold text-sm" v-if="shopping.listProducts().length > 0">
                    <span>Total:</span>
                    <span class="italic"> {{ currencyFormat(totalDue) }} </span>
                </div>
                <hr class="my-2" v-if="shopping.listProducts().length > 0">
                <div class="flex pb-2 flex-row flex-wrap" v-if="shopping.listProducts().length > 0">
                    <div class="flex py-1 rounded phone:w-full justify-center items-center cursor-pointer text-secondary hover:text-white hover:bg-secondary
                 font-bold
                " @click="sidebarStatus.createQuotation = true"
                    v-if="macros.quote"
                >
                        <Icon icon="request_quote" />
                        {{ strings.quote[language] }}
                    </div>
                    <div class="flex py-1 rounded phone:w-full tablet:w-1/2 justify-center items-center cursor-pointer text-extra hover:text-white hover:bg-extra
                 font-bold
                " @click="shopping.clearBasket()">
                        <Icon icon="delete_forever" />
                        <span>
                            {{ strings.clear[language] }}
                        </span>
                    </div>
                    <div class="flex py-1 rounded phone:w-full tablet:w-1/2 justify-center items-center cursor-pointer text-secondary hover:text-white hover:bg-secondary
                 font-bold
                " v-if="macros.dispatch" @click="sidebarStatus.createDispatch = true">
                        <Icon icon="ios_share" />
                        {{ strings.dispatch[language] }}
                    </div>
                    <div class="flex py-1 rounded phone:w-full justify-center items-center cursor-pointer text-extra hover:text-white hover:bg-extra
                 font-bold
                " @click="sidebarStatus.createQuotation = true"
                    v-if="isEditing && false"
                >
                        <Icon icon="request_quote" />
                        {{ strings.quit[language] }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Icon } from './Generics/generics';
import { computed, ref } from 'vue';
import { useShoppingCart } from '@/composables/ShoppingCart';
import { onClickOutside } from '@vueuse/core';
import { sellProduct } from '@/services/product';
import language from '@/services/language';
import {macros} from '@/composables/permissions'
import { sidebarStatus } from '@/composables/sidebarStatus';
import { useRouter } from 'vue-router';
import { currencyFormat } from '@/composables/utils';
import { useAuthStore } from '@/stores/auth'
import type { token } from '@/schemas';

const getImageUrl = (name: string) => {
    return new URL(`../assets/logo/${name}`, import.meta.url).href
}

const ShoppingList = ref(null)
const router = useRouter()
const shopping = useShoppingCart()
const user = useAuthStore()
const listOpened = ref({ view: false })

onClickOutside(ShoppingList, () => {
    listOpened.value.view = false
})

const totalDue = computed(() => {
    let total = 0
    shopping.listProducts().forEach((pdto) => {
        total += (pdto.amount * pdto.value)
    })
    return total
})

const isEditing = computed(() => {
    return router.currentRoute.value.query.id ? true : false
})

const isEnterprise = computed(() => {
    return user.getUser.enterprise_id ? true : false
})

const toggleMenu = () => {
    listOpened.value.view = !listOpened.value.view
}


const sellProducts = async () => {

    if (isEnterprise.value) {
        // Validar anotaciones
        const conUser = user.getUser.token as token
        let { status } = await sellProduct(conUser.value, shopping.listProducts().map((pdto) => {
            return { id: pdto.id, amount: pdto.amount, description: '' }
        }))
        if (status == 200) {
            shopping.clearBasket()
        }

    } else {
        //
    }
}

const strings = {
    shopping: {
        Spanish : 'Transacción',
        English : 'Transaction'
    },
    noProducts : {
        Spanish : 'No hay productos aún...',
        English : 'There arent products yet...'
    },
    clear : {
        Spanish : 'Vaciar',
        English : 'Clear basket'
    },
    dispatch : {
        Spanish : 'Remisión',
        English : 'Dispatch'
    },
    quote: {
        Spanish: 'Cotizar',
        English: 'Quote'
    },
    quit: {
        Spanish: 'Dejar de cotizar',
        English: 'Stop quoting'
    }
}

</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type=number] {
    -moz-appearance: textfield;
}
</style>
<style scoped>
/* Firefox */
* {
    scrollbar-width: auto;
    scrollbar-color: #A64AEE #ffffff;
    scroll-behavior: smooth;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
    width: 12px;
}

*::-webkit-scrollbar-track {
    background: #ffffff;
}

*::-webkit-scrollbar-thumb {
    background-color: #A64AEE;
    border-radius: 10px;
    border: 2px solid #ffffff;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type=number] {
    -moz-appearance: textfield;
}
</style>