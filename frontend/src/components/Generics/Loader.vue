<template>
    <!-- Container -->
    <div v-if="props.show" class="z-[10000] fixed top-0 left-0 right-0 bottom-0 bg-[#00000087] flex justify-center items-center animate__backOutDown">
        <img class="w-[100px] animate-anubis" src="@/assets/local/ourStock.svg" alt="">
    </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
export interface contentloader {
  show: boolean
}


const props = defineProps<contentloader>()
</script>