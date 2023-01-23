<template>
    <div class="flex flex-col justify-start items-start pt-2" v-if="props.title">
        <h1 class="font-bold text-2xl">
            {{ props.title.name}}
            <span class="text-xs">
                {{props.multiple ? 'Max 10' : 'Max 1'}}
            </span>
        </h1>
        <h3 class="text-sm text-gray-400">{{ props.title.hint}}</h3>
    </div>
    <div class="flex flex-col text-left gap-3 py-2 ">
        <template v-for="(item, index) in props.content" :key="index">
            <div class=" rounded-lg border px-2 py-1 hover:bg-gray-50">
                <CheckBox v-model="item.selected" :content="item.name" @update:model-value="updateValues(item)"></CheckBox>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { CheckBox } from '@/components/Generics/generics'
export interface title {
    name: string
    hint: string
}
export interface contentSelectionList {
  modelValue: Array<any>
  content: any
  multiple?: boolean
  title?: title
  size?: string
  color?: string
}
const props = defineProps<contentSelectionList>()
const emits = defineEmits(['update:modelValue'])

const updateValues = async (itemUpdate: any) => {
    console.log(itemUpdate)
    if (props.multiple == false) {
        props.content.map( (item: any) => {
            if (itemUpdate.id == item.id) {
                item.selected = true
            } else {
                item.selected = false
            }
            return item
        })
    }
}

const selectionFinal = computed(
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