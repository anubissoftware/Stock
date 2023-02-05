<template>
    <div class="flex flex-row gap-3 w-fit items-center phone:text-sm tablet:text-lg tablet:px-3 phone:px-1 py-1 select-none cursor-pointer"
    @click="color.click">
        <span class="w-24">{{ finalValue }}</span>
        <div class="inputColorContainer">
            <input ref="color" v-model="finalValue" type="color">
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref} from 'vue';
export interface contentColorPicker {
  modelValue: string
}
const props = defineProps<contentColorPicker>()
const emits = defineEmits(['update:modelValue'])
const color = ref()

const finalValue = computed(
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
<style scoped>
input[type='color'] {
    width:100%;
    height:100%;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #000000ff;
    transform: scale(2.5);
}
.inputColorContainer {
    width:24px;
    height:24px;
    overflow: hidden;
    border-radius:100%;
}
</style>