<template>
    <div class="flex w-full p-8 rounded-b-3xl" :class="[`bg-${props.color ?? 'primary'}`]">
      <Icon @click="configHeader = !configHeader" class=" cursor-pointer text-white absolute right-5 -mt-2 hover:scale-125 ease-in-out transition-all" icon="settings" />
      <div class="flex flex-wrap w-full justify-between">
        <!-- Information basic -->
        <div class="flex flex-col items-start" :class="`text-${color}`">
          <h1 class="flex text-3xl">
              {{ props.title }}
          </h1>
          <h4><strong>Rating:</strong> {{props.rating}}</h4>
          <h4><strong>Schedule:</strong> {{props.schedule}}</h4>
        </div>
        <img class="max-w-xs" 
        :class="[optionsHeader.showLogo ? 'block' : 'hidden']" 
        :src="storeLogo" alt="">
      </div>
    </div>
    <transition 
      enter-from-class="translate-y-[-150%] opacity-0"
      enter-active-class="transition duration-500"
      leave-to-class="translate-y-[150%] opacity-0"
      leave-active-class="transition duration-500">
      <div v-if="configHeader" class="flex flex-col gap-4 p-8 bg-white" >
        <h1 class="flex text-xl">
          Config header store
        </h1>
        <div class="flex flex-row justify-between p-3 shadow-lg rounded-xl border">
          <div>Orden titulo banner (basico - invertido)</div>
          <div>Je</div>
        </div>
        <div class="flex flex-row justify-between p-3 shadow-lg rounded-xl border">
          <div>Mostrar logo</div>
          <Switch color="primary" exact-color v-model="optionsHeader.showLogo" />
        </div>
        <div class="flex flex-row justify-between p-3 shadow-lg rounded-xl border">
          <div>Tipo de alineación</div>
          <div>Je</div>
        </div>
        <div class="flex flex-row justify-between p-3 shadow-lg rounded-xl border">
          <div>Color de texto</div>
          <div>Je</div>
        </div>
      </div>
    </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref, type Ref} from 'vue';
import { Icon, Switch } from '@/components/Generics/generics'
export interface contentHaderStore {
  title: string
  size?: string
  color?: string
  rating?: string
  schedule?: string
  logo: string
}

const configHeader:Ref<boolean> = ref(false)
const optionsHeader = ref({
  showLogo: true
})

const storeLogo = computed(() => {
  return ''
})

const color = computed(() => {
    // return isDarkColor(props.color) ? 'white' : 'black'
    return 'white'
})

const props = defineProps<contentHaderStore>()
</script>