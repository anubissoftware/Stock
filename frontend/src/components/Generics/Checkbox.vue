<template>
    <div class="flex gap-3 py-2 items-center" @click="changeValue()">
        <input @click="(event) => {clickedValue(event)}" class="w-5 h-5 accent-primary rounded-2xl" id="inputCheckbox" type="checkbox" v-model="booleanValue"  >
        <label>
            {{content}}
        </label>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, nextTick } from 'vue';
export interface contentCheckbox {
  modelValue: boolean
  content: string
  size?: string
  color?: string
  readonly?: boolean
}
const props = defineProps<contentCheckbox>()
const emits = defineEmits(['update:modelValue'])

const changeValue = async () => {
    if(props.readonly) return
    booleanValue.value = !booleanValue.value
}

const clickedValue = ($e: any) => {
  if(props.readonly) $e.preventDefault();
}
 
const booleanValue = computed(
  {
    get() :  any {
      return props.modelValue
    }, 
    set(newValue : any): void {
      if(props.readonly) return 
      emits('update:modelValue', newValue)

    }
  }
)

</script>