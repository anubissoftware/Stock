<template>
    <div class="flex w-60 hover:bg-gray-100 hover:scale-105 transition-all ease-in-out rounded-2xl shadow-xl p-4" >
        <div class="flex flex-col justify-start items-start w-full">
            <figure class="p-4">
                <img :src="cardImage" alt="">
            </figure>
            <div class="flex  flex-col items-start justify-start pt-4">
                <h1 class="text-lg font-bold"> {{props.content.title}}</h1>
                <h3 class="text-sm"> {{props.content.description}}</h3>
                <h3 class="text-sm"> {{props.content.rating}}</h3>
                <strong class="text-lg"> {{'$' + props.content.price}}</strong>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
export interface infoCard {
    title: string,
    description: string, 
    rating: string
    price: number
}

export interface contentHaderStore {
  content: infoCard
  image: string
}

const props = defineProps<contentHaderStore>()

const cardImage = computed(() => {
  return ''
})
</script>