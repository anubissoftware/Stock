<template>
    <div>
        <Header />
        <div class="flex w-full flex-row p-8">
            <div class="flex flex-col justify-start items-start w-1/3 border-r-2">
                <div class="w-full flex p-2 hover:bg-gray-100 select-none cursor-pointer" 
                @click="selectionView = optionView.basics"
                :class="[selectionView == optionView.basics ? 'bg-gray-100' : 'bg-transparent']">
                    Informacion basica
                </div>
                <div class="w-full flex p-2 hover:bg-gray-100 select-none cursor-pointer" 
                @click="selectionView = optionView.notification"
                :class="[selectionView == optionView.notification ? 'bg-gray-100' : 'bg-transparent']">
                    Notificaciones
                </div>
                <div class="w-full flex p-2 hover:bg-gray-100 select-none cursor-pointer" 
                @click="selectionView = optionView.storeView"
                :class="[selectionView == optionView.storeView ? 'bg-gray-100' : 'bg-transparent']">
                    Vista
                </div>
            </div>
            <div class="flex flex-col gap-3 w-2/3 px-4">
                <!-- Basic information form  -->
                <template v-if="selectionView == optionView.basics">
                    <h1 class="flex text-2xl"> Basic Information</h1>
                    <Input
                        class="w-full"
                        :color="notificationColor"
                        placeholder="Store Name"
                        label="Name"
                        v-model="store.basics.name"
                    />
                    <Input
                        class="w-full"
                        :color="notificationColor"
                        placeholder="Cll 2..."
                        label="Adress"
                        v-model="store.basics.address"
                    />
                    <Input
                        class="w-full"
                        :color="notificationColor"
                        placeholder="300-1..."
                        label="Cellphone"
                        type="number"
                        v-model="store.basics.cellphone"
                    />
                    <Input
                        class="w-full"
                        :color="notificationColor"
                        placeholder="Fast food"
                        label="Type"
                        v-model="store.basics.type"
                    />
                    <Input
                        class="w-full"
                        :color="notificationColor"
                        placeholder="12:.. - 8:.."
                        label="Schedule"
                        type="time"
                        v-model="store.basics.schedule"
                    />
                </template> 
                <template v-if="selectionView == optionView.notification">
                    <h1 class="flex text-2xl"> Notifications</h1>
                    <div>Notification View</div>
                </template>
                <template v-if="selectionView == optionView.storeView">
                    <h1 class="flex text-2xl"> Store</h1>
                    <Button @click="showStore = !showStore" class="w-fit justify-center"  color="primary" icon="verified" content="Show preview" exactColor />
                </template>
            </div>
        </div>
        <transition 
        enter-from-class="translate-y-[-150%] opacity-0"
        enter-active-class="transition duration-500"
        leave-to-class="translate-y-[150%] opacity-0"
        leave-active-class="transition duration-500"
        >
            <div v-if="selectionView == optionView.storeView && showStore" class="flex flex-col" id="storePreview">
                <HeaderStore 
                    title="Cesar Store" 
                    color="primary" 
                    logo="Recurso 3@2x.png"
                    rating="4.5"
                    schedule="10:30 - 3:00"
                />
                <CarrousselStore title="Top sells" :items="itemsCarrousel" />
                <TabsStore :menus="menus" :contentsMenus="contentsMenus" />
            </div>
        </transition>
        <Footer />
    </div>
</template>

<script lang="ts" setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue';
import { ref, type Ref } from 'vue';
import {Alert, Input, Button, CheckBox, OTPInput} from '@/components/Generics/generics'
import { HeaderStore, CarrousselStore, TabsStore } from '@/components/Store/componentsStore'

enum optionView {
    basics,
    notification,
    storeView
}

const notificationColor = ref('black')
const store = ref({
    basics: {
        name: '',
        cellphone: '',
        address: '',
        type:'',
        schedule: ''
    },
    password: ''
})
const showStore: Ref<boolean> = ref(false)
const itemsCarrousel = ref([
    {
        title: 'Ejemplo 1',
        description: 'Descripcion de ejemplo',
        rating: '4.5',
        price: 2000
    },
    {
        title: 'Ejemplo 2',
        description: 'Descripcion de ejemplo',
        rating: '4.5',
        price: 2000
    },
    {
        title: 'Ejemplo 3',
        description: 'Descripcion de ejemplo',
        rating: '4.5',
        price: 2000
    },
    {
        title: 'Ejemplo 4',
        description: 'Descripcion de ejemplo',
        rating: '4.5',
        price: 2000
    },
    {
        title: 'Ejemplo 4',
        description: 'Descripcion de ejemplo',
        rating: '4.5',
        price: 2000
    }
])

const menus = ref([
    {
        id:1,
        name:'Hamburguesas',
        selected: true
    },
    {
        id:2,
        name:'Pizzas',
        selected: false
    },
    {
        id:3,
        name:'Perros',
        selected: false
    },
    {
        id:4,
        name:'Bebidas',
        selected: false
    }
])

const contentsMenus = ref([
    {
        id:1,
        name: 'Hamburguesas',
        items: [
            {
                title: 'Hamburguesas 1',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Hamburguesas 2',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Hamburguesas 3',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Hamburguesas 4',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Hamburguesas 4',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            }
        ]
    },
    {
        id:2,
        name: 'Pizzas',
        items: [
            {
                title: 'Pizzas 1',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Pizzas 2',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Pizzas 3',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Pizzas 4',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Pizzas 4',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            }
        ]
    },
    {
        id:3,
        name: 'Perros',
        items: [
            {
                title: 'Perros 1',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Perros 2',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Perros 3',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Perros 4',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Perros 4',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            }
        ]
    },
    {
        id:4,
        name: 'Bebidas',
        items: [
            {
                title: 'Bebidas 1',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Bebidas 2',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Bebidas 3',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Bebidas 4',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            },
            {
                title: 'Bebidas 4',
                description: 'Descripcion de ejemplo',
                image: 'logo.png',
                price: 1500
            }
        ]
    }
])

const selectionView: Ref<optionView> = ref(optionView.basics)
 

</script>

<style scoped>
body{
    scroll-behavior: smooth !important;
}
</style>