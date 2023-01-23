<template>
    <div class="flex flex-col justify-start items-start py-2" v-if="props.title">
        <h1 class="font-bold text-2xl">
            {{ props.title.name}}
        </h1>
        <h3 class="text-sm text-gray-400">{{ props.title.hint}}</h3>
    </div>
    <div class="flex flex-col text-left gap-3 py-2 ">
        <Input
            class="w-full"
            color="black"
            placeholder="Some instructions here"
            v-model="finalValue"
        />
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { Input } from '@/components/Generics/generics'
export interface title {
    name: string
    hint: string
}
export interface contentSelectionList {
  modelValue: string
  title?: title
  size?: string
  color?: string
}
const props = defineProps<contentSelectionList>()
const emits = defineEmits(['update:modelValue'])


const finalValue = computed(
  {
    get() :  any {
      return props.modelValue
    }, 
    set(newValue : any): void {
        console.log('Nuevo valor')
      emits('update:modelValue', newValue)

    }
  }
)

</script>