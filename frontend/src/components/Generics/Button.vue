<template>
     <button class="flex items-center shadow-lg border-2 rounded-lg hover:text-white gap-2 duration-200"
    :class="[
        props.size == 'lg' ? 'px-3 py-2' :
        props.size == 'md' ? 'px-2 py-1' :
        props.size == 'sm' ? 'px-1 py-1' : 'tablet:px-3 tablet:py-2 phone:px-2 phone:py-1',
        exactColor ? `border-${props.color} text-${props.color} hover:bg-${props.color}` : 
        `border-${props.color}-600 text-${props.color}-600 hover:bg-${props.color}-600`,
        'disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:border-none disabled:text-white',
        props.disabled ? 'hover:bg-opacity-10' : ''
    ]"
    >
        <Icon v-if="props.icon" :icon="props.icon" />
        <span v-if="props.content" class="tablet:text-base phone:text-sm">{{ props.content}}</span>
    </button>
</template>
<script setup lang="ts">
import Icon from '@/components/Generics/Icon.vue'
import { defineProps } from 'vue';
export interface contentButton {
  icon?: string
  content?: string | undefined
  color: string
  size?: string
  exactColor?: boolean
  disabled?: boolean
}
const props = defineProps<contentButton>()
</script>