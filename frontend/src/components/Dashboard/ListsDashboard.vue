<template>
    <div class="flex flex-col w-full self-center rounded-2xl p-4 border shadow-md items-center justify-between">
        <h1 class="tablet:text-xl phone:text-base">
            {{props.title}}
        </h1>
        <div v-if="data.length == 0" class="flex text-lg text-gray-400">
            No data
        </div>
        <div v-else class="flex flex-col gap-2 w-full pt-4 justify-start items-start max-h-[80%] overflow-auto">
            <template  v-for="(item, index) in props.data" :key="index">
                <div class="px-2 py-1 w-full bg-primary text-white text-start border rounded-xl">{{ item[props.value] }}</div>
            </template>
        </div>
        <h3 class="py-2">{{ 'Total ' + props.data.length }}</h3>

    </div>
</template>
<script setup lang="ts">
import language from '@/services/language';
import { onMounted, defineEmits, defineProps, ref, type Ref} from 'vue';

import moment from 'moment';
export interface contentLists {
    data: Array<any>
    title: string
    value?: string
}
const props = defineProps<contentLists>()
const emits = defineEmits(['refresh'])
const welcomeMessage = ref('')

onMounted(async () => {
})


const phrases = [
    {
        Spanish: 'Ten un gran dia en el trabajo',
        English: 'Have a nice day at Work'
    },
    {
        Spanish: 'Ten un gran dia en el trabajo',
        English: 'Have a nice day at Work'
    }
]
</script>