<template>
  <div class="h-full w-full flex flex-col justify-center items-center">
    <div class="relative w-full inputRequired" ref="component">
      <input name="input" :placeholder="props.placeholder" class="w-full text-base outline-none border-2 border-solid
            border-gray-500 px-3 text-gray-500 transition-all duration-100 ease-out rounded-md
            " :class="[
              `focus:border-${props.color}-800`,
              props.size == 'xl' ? 'py-6' :
                props.size == 'lg' ? 'py-4' :
                  props.size == 'md' ? 'py-2' :
                    props.size == 'sm' ? 'py-1' : 'py-4',
              props.notificationColor ? `border-${props.notificationColor}-700` : 'border-gray-500'
            
            ]" v-model="stringValue" @focus="() => {
                openList = props.readonly ? false : true
                stringValue
              }" type="search" autocomplete="off" :required="props.required" @keyup.up="listNavigation('up')"
        @keyup.down="listNavigation('down')" @keyup.enter="setModelValue()" />
      <label for="input" class="absolute text-base font-bold left-0 top-[50%] -translate-y-1/2 bg-transparent 
            py-0 px-1 my-0 mx-2
            text-gray-600 ease-out transition-all duration-200
             origin-top-left pointer-events-none" :style="{ '--bgColor': props.notificationColor }"
        :class="props.notificationColor ? `text-${props.notificationColor}-700` : 'text-gray-600'">
        {{ props.label }}
      </label>
      <ul v-if="itemsList.length && openList"
        class="absolute w-full border border-black rounded-b-lg bg-white text-start max-h-32 overflow-y-scroll"
        style="z-index: 999999;">
        <li v-for="(item, index) in itemsList" :key="index"
          class="p-1 border-t border-black hover:bg-gray-200 select-none cursor-pointer"
          :class="index == currPosition ? 'bg-gray-300' : ''" @click="clickedModelValue(item)">
          {{ item[props.value ?? 'nombre'] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, type Ref } from 'vue';
import { onClickOutside } from '@vueuse/core'
export interface contentAlert {
  color: string
  placeholder: string | undefined
  label: string
  modelValue: any
  size?: string
  items: any
  notificationColor?: string | undefined,
  value?: string
  required?: boolean
  readonly?: boolean
}
const emits = defineEmits(['update:modelValue', 'changed'])
const props = defineProps<contentAlert>()
const openList = ref(false)
const currPosition: Ref<null | number> = ref(null)

const component = ref(null)
onClickOutside(component, () => {
  openList.value = false
})

const stringValue = computed(
  {
    get(): any {
      if (typeof finalValue.value == 'string') {
        return finalValue.value
      } else {
        return finalValue.value[props.value ?? 'nombre']
      }
    },
    set(newValue: any): void {
      currPosition.value = null
      finalValue.value = newValue
    }
  }
)

const finalValue = computed(
  {
    get(): any {
      return props.modelValue
    },
    set(newValue: any): void {
      currPosition.value = null
      emits('update:modelValue', newValue)
    }
  }
)
const listNavigation = (key: string): void => {
  if (key == 'up') {
    currPositionModif(-1)
  } else if (key == 'down') {
    currPositionModif(1)
  }
}

const setModelValue = () => {
  if (typeof currPosition.value == 'number') {
    emits('update:modelValue', itemsList.value[currPosition.value])
    emits('changed', itemsList.value[currPosition.value])
    currPosition.value = 0
    openList.value = false
  }
}

const clickedModelValue = (item: any) => {
  emits('update:modelValue', item)
  emits('changed', item)
  currPosition.value = 0
  openList.value = false
}

const currPositionModif = (count: number): void => {
  if (currPosition.value == null) {
    if (count == -1) {
      currPosition.value = itemsList.value.length - 1
    } else {
      currPosition.value = 0
    }
  } else {
    if (currPosition.value == (itemsList.value.length - 1) && count == 1) {
      currPosition.value = 0
    } else if (currPosition.value == 0 && count == -1) {
      currPosition.value = itemsList.value.length - 1
    } else {
      currPosition.value += count
    }
  }
}

const itemsList = computed(
  {
    get(): [any] {
      let matches = 0
      return props.items.filter((item: any) => {
        if (item[props.value ?? 'nombre'].toLowerCase().includes(stringValue.value.toLowerCase())
          && matches < 10
        ) {
          matches++
          return item
        }
      })
    },
    set(newValue: [any]): void {
      //
    }
  }
)


</script>
<style scoped>
input:focus+label {
  color: var(--bgColor);
  top: 0;
  transform: translateY(-73%) scale(0.9) !important;
}

input:not(:placeholder-shown)+label {
  top: 0;
  transform: translateY(-73%) scale(0.9) !important;
}

input:not(:focus)::placeholder {
  opacity: 0;
}

.inputRequired:has(input:required) label:after {
  content: ' *';
  color: black;
}
</style>