<template>
    <div class="flex w-full">
        <div class="flex flex-row w-full self-center rounded-2xl p-4 border shadow-md items-center justify-between">
            <div class="flex flex-col">
                <h1 class="tablet:text-xl phone:text-base">
                    {{ welcomeMessage + ',' }}
                    <span class="font-bold text-primary">{{ name }}</span>
                </h1>
                <h3 class="tablet:text-sm phone:text-xs py-1 text-start">
                    {{ phrases[0][language] }}
                </h3>
            </div>
            <img class="w-[80px]" :src="logo" alt=""/>
        </div>
    </div>
</template>
<script setup lang="ts">
import language from '@/services/language';
import { onMounted, onUnmounted, defineEmits, defineProps, ref, type Ref} from 'vue';
import moment from 'moment';
import { useAuthStore } from '@/stores/auth';
import socket from '@/composables/socket';
export interface contentWelcome {
    name: string
}
const auth = useAuthStore()
const props = defineProps<contentWelcome>()
const emits = defineEmits(['refresh'])
const counter: Ref<number> = ref(Math.floor(Math.random() * 1000))
const logo: Ref<string> = ref('')
const welcomeMessage = ref('')

const updateLogo = () => {
    counter.value ++
    logo.value = auth.getUser.enterprise_path + '?v=' + counter.value
}

onMounted(async () => {
    generateMessage()
    console.log(welcomeMessage.value)
    logo.value = auth.getUser.enterprise_path + '?v=' + counter.value
    socket.socket?.on('logoUpdated', updateLogo)
})

onUnmounted(() => {
    socket.socket?.off('logoUpdated', updateLogo)
})

const generateMessage = () => {

    const currentHour = Number(moment().format("HH"));
    console.log(currentHour)
    if (currentHour >= 0 && currentHour < 12){
        welcomeMessage.value = "Buen día";
    } else if (currentHour >= 12 && currentHour < 15){
        welcomeMessage.value = "Buena tarde";
    } else if (currentHour >= 15 && currentHour < 18){
        welcomeMessage.value = "Buena tarde";
    } else if (currentHour >= 20 ){
        welcomeMessage.value = "Buena noche";
    }
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