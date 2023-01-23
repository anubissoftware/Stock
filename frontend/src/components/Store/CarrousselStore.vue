<template>
    <div class="flex m-8">
        <div class="flex flex-col justify-start items-start rounded-2xl shadow-2xl w-full  p-8" >
            <h1 class="text-2xl font-bold"> {{props.title}}</h1>
            <div class="flex w-full p-2 overflow-auto">
                <div class="flex w-auto flex-row gap-2 my-4 ">
                    <template v-for="(item, index) in props.items" :key="index">
                        <CardStore :content="item" image="logo.png" @click="productoDialog(item)" />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { CardStore } from '@/components/Store/componentsStore'
import { modalProductSync, type modalResponse } from '@/classes/Modal';
export interface infoCard {
    title: string,
    description: string, 
    rating: string
    price: number
}
export interface contentHaderStore {
  title: string
  items?: Array<infoCard>
}

const props = defineProps<contentHaderStore>()

const productoDialog = async (product: infoCard) => {
    console.log(product)
    modalProductSync.modal.show({
        title: product.title,
        description: product.description,
        price: product.price,
        rating: product.rating
    })
    .then( async (response : modalResponse) => {
        console.log(response)
    })
}
</script>