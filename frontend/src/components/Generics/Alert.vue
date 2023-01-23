<template>
    <transition 
    enter-from-class="translate-y-[150%] opacity-0"
    enter-active-class="transition duration-500"
    leave-to-class="translate-y-[150%] opacity-0"
    leave-active-class="transition duration-500"
    >
        <!-- Container -->
        <div class="fixed bottom-0 left-0 w-full phone:p-2 tablet:p-10 z-30">
            <div class="w-full flex flex-row justify-between rounded-2xl px-4 py-4
                transition-all duration-300 ease-in-out"
                :class="[
                    props.type == 'warning' ? 'bg-secondary' :
                    props.type == 'success' ? 'bg-green-500' : 
                    props.type == 'error' ? 'bg-red-600' : 
                     'bg-gray-500'

                ]"
            >
                <div class="flex flex-col">
                    <!-- Title message -->
                    <div class="laptop:text-xl pb-2 self-start phone:text-md text-white font-bold">
                        {{ props.title}}
                    </div>
                    <!-- Description message -->
                    <div class="laptop:text-lg self-start phone:text-md text-white" v-html="props.description">
                    </div>
                </div>
                <Icon class="cursor-pointer flex self-center text-white h-fit hover:bg-white hover:text-primary p-2 rounded-full" @click="close" icon="clear" />
                
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

import { Icon } from '@/components/Generics/generics'
export interface contentAlert {
  title: string | undefined
  description: string | undefined
  type: string | undefined
}

const props = defineProps<contentAlert>()
const emit = defineEmits<{(e: 'close'): void}>()

const close = () => {
    emit('close')
}
</script>