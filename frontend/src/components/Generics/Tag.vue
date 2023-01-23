<template>
    <div ref="tag" class="px-1 pt-1 select-none">
        <div class=" px-6 py-1 border-2 rounded-full border-secondary hover:scale-110 duration-200 cursor-pointer"
            :class="props.modelValue ? 'bg-secondary text-white font-bold' : ''"
            @click="emit('update:modelValue', !modelValue)"
        >
            {{ props.title }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

export interface tagProps {
    title: string
    modelValue?: boolean
}

const props = defineProps<tagProps>()
const emit = defineEmits(['update:modelValue'])



</script>