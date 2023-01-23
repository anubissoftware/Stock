<template>
    <div class="flex items-center" >
        <span
        class=" inline-block relative cursor-pointer w-8 h-[18px] rounded-full 
        focus:outline-0"
        :class="[ 
            props.size == 'lg' ? 'w-12 h-[30px]' :
            props.size == 'md' ? 'w-10 h-[24px]' :
            props.size == 'sm' ? 'w-8 h-[18px]' : 'w-8 h-[18px]'

        ]"
        role="checkbox"
        :aria-checked="booleanValue.toString()"
        tabindex="0"
        @click="toggle"
        @keydown.space.prevent="toggle"
        >
            <span
                class="inline-block rounded-full h-full w-full shadow transition-all ease-in-out duration-300"
                :class="[ booleanValue ? `bg-${color ?? 'green'}${exactColor ? '': '-600' }` : 'bg-gray-500']"
            />
            <span
                class="absolute left-[2px] bottom-[2px] bg-white rounded-full shadow transition-all ease-in-out duration-400"
                :class="[ 
                    props.size == 'lg' ? 'h-[26px] w-[26px]' :
                    props.size == 'md' ? 'h-[20px] w-[20px]' :
                    props.size == 'sm' ? 'h-[14px] w-[14px]' : 'h-[14px] w-[14px]'

                ]"
                :style="indicatorStyles" 
            />
        </span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits} from 'vue';
export interface contentIcon {
  modelValue: boolean
  size?: string
  color?: string
  exactColor?: boolean
}
const props = defineProps<contentIcon>()
const emits = defineEmits(['update:modelValue'])

const indicatorStyles = computed(
  {
    get() : any {
        let size = props.size == 'lg' ? '18px':
                props.size == 'md' ? '16px':
                props.size == 'sm' ? '14px': '14px'
        return {
            transform: props.modelValue ? `translateX(${size})` : 'translateX(0)'
        }      
    }, 
    set(newValue : any): void {
        //newValue
    }
  }
)

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

//Functions
const toggle = () => {
    booleanValue.value = !booleanValue.value
}
</script>