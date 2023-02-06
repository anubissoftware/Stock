<template>
    <div class=" flex tablet:my-[5%] phone:my-[10%] phone:w-full tablet:w-1/2 laptop:w-1/4 desktop:w-1/4 h-[150px] px-1 items-center justify-between cursor-pointer"
    @click="redirectLink(props.link)">
        <div class="relative flex flex-col border h-full w-full p-1 rounded-3xl items-center bg-primary  shadow-md">
            <div class="absolute mt-[5%] -top-1/3 w-16 h-16 border border-primary flex items-center justify-center rounded-3xl 
            bg-white text-primary">
                <Icon class="text-3xl" :icon="props.icon" />
            </div>
            <div class="flex flex-col w-full justify-between">
                <h1 class="text-white phone:pt-[12%] tablet:pt-[10%] tablet:text-xl phone:text-base">
                    {{props.title}}
                </h1>
                <h4 class="py-2 text-2xl text-white">
                    {{ props.total }}
                </h4>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import language from '@/services/language';
import { useRouter } from 'vue-router';
import { onMounted, defineEmits, defineProps, ref, type Ref} from 'vue';
import { Icon } from '@/components/Generics/generics'

import moment from 'moment';
export interface contentLists {
    title: string
    icon: string
    total: number
    link: string
}
const props = defineProps<contentLists>()
const router = useRouter()

onMounted(async () => {
    // 
})

const redirectLink = (path: string) => {
    router.replace({
        path
    })
}


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