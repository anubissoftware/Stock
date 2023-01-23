<template>
    <div class="border-b border-b-black border-solid w-full"> 
    </div>
</template>

<script setup lang="ts">
import { defineProps} from 'vue';
export interface contentIcon {
  size?: string
}
const props = defineProps<contentIcon>()
</script>