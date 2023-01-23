<template>
    <div class="material-symbols-outlined">
        {{ props.icon}}
    </div>
</template>

<script setup lang="ts">
import { defineProps} from 'vue';
export interface contentIcon {
  icon: string
}
const props = defineProps<contentIcon>()
</script>