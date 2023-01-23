<template>
    <div class="flex gap-3 py-2 items-center" @click="changeValue()">
        <input class="w-5 h-5 accent-primary rounded-2xl" id="inputCheckbox" type="checkbox" :checked="booleanValue"  >
        <label>
            {{content}}
        </label>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
export interface contentCheckbox {
  modelValue: boolean
  content: string
  size?: string
  color?: string
}
const props = defineProps<contentCheckbox>()
const emits = defineEmits(['update:modelValue'])

const changeValue = async () => {
    booleanValue.value = !booleanValue.value
}

const booleanValue = computed(
  {
    get() :  any {
      return props.modelValue
    }, 
    set(newValue : any): void {
      emits('update:modelValue', newValue)

    }
  }
)

</script>