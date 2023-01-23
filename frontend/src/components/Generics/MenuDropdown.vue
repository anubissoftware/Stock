<template>
    <button class="flex w-fit flex-col"
    @blur="validateMenu = false"
    >
    <transition 
        enter-from-class="opacity-0"
        enter-active-class="transition duration-500"
        leave-to-class="opacity-0"
        leave-active-class="transition duration-500"
    >
        <div class="tablet:relative transition-all duration-300 ease-in-out">
            <div class="flex items-center flex-row px-2 py-1 rounded-lg" @click="validateMenu = !validateMenu">
                <span class="phone:hidden tablet:flex">{{props.content}}</span>
                <Icon v-if="props.icon" 
                class="transition-all ease-out duration-200" 
                :class="[validateMenu ? 'rotate-180' : 'rotate-0']"
                :icon="props.icon" />
            </div>
            <div v-if="validateMenu" class="absolute phone:w-full phone:h-[85vh] tablet:w-auto tablet:h-auto my-4 right-0 bg-white border rounded-lg
                flex flex-col justify-between
            ">
                <slot class="px-20"></slot>
            </div>
        </div>
    </transition>
    </button>
</template>
<script setup lang="ts">
import { defineProps, ref} from 'vue';
import Icon from '@/components/Generics/Icon.vue'

export interface menuDropdown {
    icon?: string,
    content?: string
}
const props = defineProps<menuDropdown>()
const validateMenu = ref(false)

</script>