<template>
    <div class="height-full flex flex-col justify-center items-start">
        <div class="relative w-full inputRequired" :class="props.typeColor ? ' w-4/5': 'w-full'">
            <!-- Prepend Icon config  -->
            <Icon v-if="props.prependIcon" class="select-none absolute top-[10px] left-[10px]" :icon="props.prependIcon"></Icon>
            <!-- Icon only to password view -->
            <Icon v-if="props.type == 'password'" 
            class="cursor-pointer absolute top-[10px] right-[10px]" 
            @pointerenter="viewPassword = true"
            @pointerleave="viewPassword = false"
            icon="visibility" />
            <input name="input" :placeholder="props.placeholder" class="text-base outline-none border-2 border-solid
            border-gray-500 px-3 text-gray-500 transition-all duration-100 ease-out rounded-md
            w-full
            " 
            :readonly="props.readonly ?? false"
            :class="[
                `focus:border-${props.color}-800`,
                props.size == 'xl' ? 'py-6' : 
                props.size == 'lg' ? 'py-4' : 
                props.size == 'md' ? 'py-2' :
                props.size == 'sm' ? 'py-1' : 'py-2',
                props.notificationColor ? `border-${props.notificationColor}-700` : 'border-gray-500',
                props.prependIcon ? 'pl-10' : null
            ]" 
            v-model="stringValue"
            :type="viewPassword == false ? props.type : 'text'"
            autocomplete="off"
            :required="props.required"
            />
            <label v-if="props.label" for="input" class="absolute text-base font-bold top-[50%] -translate-y-1/2 bg-transparent  
            py-0 px-1 my-0 mx-2
            text-gray-600 ease-out transition-all duration-200
             origin-top-left pointer-events-none"
            :style="{'--bgColor': props.notificationColor}"
            :class="[
              props.notificationColor ? `text-${props.notificationColor}-700` : 'text-gray-600',
              props.prependIcon ? 'left-7' : 'left-0'
            ]"
            > 
                {{ props.label}}
            </label>
        </div>
        <div v-if="props.typeColor" class="w-1/5">
          <input type="color" class=" h-12" v-model="stringValue">
        </div>
        <span v-if="props.hint" class="laptop:text-sm tablet:text-xs py-1"
        :class="`text-${props.hintColor ?? 'black'}`">
          {{props.hint}}
        </span>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRefs, type Ref, ref, onBeforeMount, computed} from 'vue';
import { Icon } from '@/components/Generics/generics'
export interface contentInput {
  color?: string
  placeholder?: string | undefined
  label?: string
  modelValue: string | number
  size?: string
  type?: string 
  notificationColor?: string | undefined
  required?: boolean
  prependIcon?: string
  appendIcon?: string
  hint?: string
  hintColor?: string
  typeColor?: boolean
  readonly?: boolean
}
const emits = defineEmits(['update:modelValue'])
const props = defineProps<contentInput>()
const viewPassword: Ref<boolean> = ref(false)

const stringValue = computed(
{
  get() : string | number {
    return props.modelValue
  }, 
  set(newValue :string | number): void {
    emits('update:modelValue', newValue)

  }
}
)

</script>
<style scoped>
input:focus+label {
color: var(--bgColor);
top: 0;
transform: translateY(-80%) scale(0.9) !important;
}

input:not(:placeholder-shown)+label {
top: 0;
transform: translateY(-80%) scale(0.9) !important;
}

input:not(:focus)::placeholder {
opacity: 0;
}
.inputRequired:has(input:required) label:after {
content: ' *';
color: black;
}
</style>