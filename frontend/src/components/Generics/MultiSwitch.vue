<template>
    <div class="flex flex-row border rounded w-auto">
        <span v-for="(item, index) in props.options" :key="index" class="py-2 px-3 rounded w-1/2 cursor-pointer" :class="item.key == language ? 'bg-secondary' : ''"
            @click="setLanguage(item.key)">
            {{item.key}}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import language from '@/services/language'
import { useSettingsStore } from '@/stores/settings'

export interface switchValues {
    key: string,
    id: number,
    name: {
        Spanish: string,
        English: string
    }
}
type switchProps = {
    options: Array<switchValues>
}

const props = defineProps<switchProps>()
const emit = defineEmits(['changeLanguage'])

const setLanguage = (language: string) => {
    emit('changeLanguage', language)
}

</script>

<style>

</style>