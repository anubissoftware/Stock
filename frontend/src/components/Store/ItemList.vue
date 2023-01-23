<template>
    <template v-for="(item, index2) in items" :key="index2">
        <div class="flex flex-row justify-between items-center w-full 
        p-4 rounded-xl shadow-lg border transition-all ease-in-out cursor-pointer
        hover:bg-gray-100 hover:scale-105 ">
            <div class="flex  flex-col items-start justify-start pt-4">
                <h1 class="text-lg font-bold"> {{item.title}}</h1>
                <h3 class="text-sm"> {{item.description}}</h3>
                <h4 class="text-lg font-bold"> {{'$' + item.price}}</h4>
            </div>
            <figure class="p-4 border rounded-lg">
                <img :src="cardImage" class="w-28" alt="">
            </figure>
        </div>

    </template>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

export interface contentHaderStore {
  items: Array<any>
}

const props = defineProps<contentHaderStore>()

const cardImage = computed(() => {
  return ''
})
</script>