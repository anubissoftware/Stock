<template>
    <div class="flex flex-col w-full min-w-[350px] self-center rounded-2xl p-4 pb-10 border shadow-md items-center justify-between">
        <h1 class="tablet:text-xl phone:text-base">
            {{props.title}}
        </h1>
        <div v-if="data.length == 0" class="flex text-lg text-gray-400">
            No data
        </div>
    </div>
</template>
<script setup lang="ts">
import language from '@/services/language';
import { onMounted, defineEmits, defineProps, ref, type Ref} from 'vue';

import moment from 'moment';
export interface contentLists {
    data: Array<any>
    title: string
}
const props = defineProps<contentLists>()
const emits = defineEmits(['refresh'])
const welcomeMessage = ref('')

onMounted(async () => {
    console.log(props.data)
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