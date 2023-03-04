<template>
    <div class="height-full flex justify-center items-center">
        <div class="relative w-full" ref="component">
            <div class="text-base outline-none border-2 border-solid border-gray-500 px-3 text-gray-500 transition-all
            ease-out rounded-md w-full"  
            :class="[
                `focus:border-${props.color}-800`,
                props.size == 'xl' ? 'py-6' : 
                props.size == 'lg' ? 'py-4' : 
                props.size == 'md' ? 'py-2' :
                props.size == 'sm' ? 'py-1' : 'py-4',
                props.notificationColor ? `border-${props.notificationColor}-700` : 'border-gray-500'
                
            ]" 
            @click="openList = !openList"
            >
             <div v-if="!props.chips" class="flex w-full">
                <div class="flex w-11/12">
                  {{ finalValue[`${props.value}`] ?? string.select[language as "English"] }}
                </div>
                <Icon 
                  icon="expand_more" 
                  class="w-1/12 cursor-pointer transition-all ease-out duration-300" 
                  :class="[openList ? 'rotate-180' : 'rotate-0']" 
                />
             </div>
             <div v-if="props.chips" class="flex w-full flex-wrap">
                <div v-if="finalValue.length == 0 || Object.keys(finalValue[0]).length == 0"
                class="flex w-11/12">
                  {{ string.select[language as "English"] }}
                </div>
                <!-- No reactive -->
                <div v-if="Object.keys(finalValue[0]).length != 0 && !props.reactive" class="flex flex-wrap gap-1 w-11/12">
                  <div v-for="(value, index) in finalValue" :key="index" 
                  class="cursor-pointer flex items-center px-1 py-1 border border-black rounded-xl text-black"
                  :style="value.color ? {'background-color': value.color, 'color': isDarkColor(value.color) ? 'white': 'black'} : ''"
                  >
                    {{value[`${props.value}`]}}
                    <Icon 
                      @click.stop="deleteItem(value)"
                      icon="cancel" 
                      class="cursor-pointer ml-1 text-black text-base hover:text-red-500" 
                    />
                  </div>
                </div>
                <!-- Reactive -->
                <div v-if="reactiveFinalValue.length != 0 && props.reactive" class="flex flex-wrap w-11/12 gap-1">
                  <div v-for="(value, index) in reactiveFinalValue" :key="index" 
                  class="cursor-pointer flex items-center px-1 py-1 border border-black rounded-xl text-black"
                  :style="value.color ? {'background-color': value.color, 'color': isDarkColor(value.color) ? 'white': 'black'} : ''"
                  >
                    {{value[`${props.value}`]}}
                    <Icon 
                      @click.stop="deleteItem(value)"
                      icon="cancel" 
                      class="cursor-pointer ml-1 text-black text-base hover:text-red-500" 
                    />
                  </div>
                </div>
                <Icon 
                  icon="expand_more" 
                  class="cursor-pointer transition-all ease-out duration-300 w-1/12" 
                  :class="[openList ? 'rotate-180' : 'rotate-0']" 
                />
             </div>
            </div>
            <label class="absolute text-base font-bold left-0 top-[50%] -translate-y-1/2 bg-transparent 
            py-0 px-1 my-0 mx-2
            text-gray-600 ease-out transition-all duration-200
             origin-top-left pointer-events-none"
            :style="{'--bgColor': props.notificationColor}"
            :class="props.notificationColor ? `text-${props.notificationColor}-700` : 'text-gray-600'"
            > 
                {{ props.label}} {{props.required ? '*' : null}}
            </label>
            <ul v-if="itemsList.length && openList" class="z-10 absolute w-full border border-black rounded-b-lg bg-white max-h-32 overflow-auto">
                <li v-for="(item, index) in itemsList" :key="index"
                class="flex justify-start px-1 py-1 border-t border-black hover:bg-gray-200 select-none cursor-pointer "
                @click="selectItem(item)"
                >
                    <Icon 
                    class=" text-black"
                    :class="[ 
                      props.chips ? (item.selected ? 'fill' : null) :
                      (item == finalValue ? 'fill' : null)
                    ]"
                    :icon="props.chips ? 
                    (item.selected ? 'check_circle' : 'radio_button_unchecked') : 
                    (item == finalValue ? 'check_circle' : 'radio_button_unchecked')" 
                    />
                    &nbsp;
                    <span>
                        {{ props.value ? item[`${props.value}`] : item.name }}
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRefs, ref, type Ref, computed} from 'vue';
import Icon from '@/components/Generics/Icon.vue'
import { onClickOutside } from '@vueuse/core'
import lightDark from '@check-light-or-dark/color'
import language from '@/services/language';
import type { categorySchema } from '@/schemas';

export interface contentSelect {
  color?: string
  label: string
  modelValue: any[] | any | object
  size?: string
  type?: string 
  items: any
  notificationColor?: string | undefined
  chips?: boolean
  value?: string
  required?: boolean
  reactive?: boolean
}
const string = {
  select : {
    Spanish : 'Seleccionar opción',
    English : 'Select option'
  }
}
const isDarkColor = (color: string) => {
    return lightDark(color) == 'dark'
}

const emits = defineEmits(['update:modelValue'])
const props = defineProps<contentSelect>()
const openList = ref(false)
const component = ref(null)
onClickOutside(component, (event) => {
    openList.value = false
})

const itemListChips: Ref<any[]> = ref([])

const itemsList = computed(
  {
    get() : any [] {
      if(props.chips) {
        let itemList: any[] = props.items
          console.log('hereing')
          itemListChips.value = itemList.map((item: any) => {
            return {
              ...item,
              selected: props.modelValue.find((model: any) => model.id == item.id) ? true : false
            }
          })
        return itemListChips.value
      } else {
        itemListChips.value = props.items
        return props.items
      }
    }, 
    set(newValue :any []): void {
        console.log(newValue)
        itemListChips.value = newValue
    }
  }
)
const reactiveFinalValue = computed(() => {
  return props.items.filter((item: any) => {
    const isSelected = props.modelValue.filter((mod: any) => {
      return item.id == mod.id
    })
    return isSelected.length != 0
  })
})

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

//Functions
const selectItem = (item: object | any) => {
  if (props.chips) {
    //Reset lista de selección a seleccion vacia 
    itemListChips.value = itemsList.value.map((itemV: any) => {
      let selected = props.modelValue.find((model: any) => model.id == itemV.id) ? true : false 
      if(item.id == itemV.id && selected) {
        console.log('item', item)
        item.selected = false
        deleteItem(item)
      }

      return {
        ...itemV,
        selected
      }
    })

    //Validacion de asignacion o push dependiendo del elemento que llegue como array[]
    if(Object.keys(finalValue.value[0]).length === 0) {
      finalValue.value[0] = item
    } else {
      //Validar si hay un element igual al que selecciono en el array de v-model
      let result = finalValue.value.filter((value: any) => {
        if(JSON.stringify(value) == JSON.stringify(item)) { return value }
      })
      if (result.length == 0) {
        finalValue.value.push(item)
      } else {
        let result = finalValue.value.filter((value: any) => {
          if(JSON.stringify(value) != JSON.stringify(item)) { return value }
        })
        result.length == 0 ? 
          finalValue.value = [{}] : 
          finalValue.value = result
      }
    }
  } else {
    finalValue.value = item
    openList.value = false
  }
}

const deleteItem = async (item: any) => {
  console.log('jere', item)
  let result = finalValue.value.filter((value: any) => {
    if(value.id != item.id) { return value }
  })
  item.selected = false
  result.length == 0 ? 
    finalValue.value = [{}] : 
    finalValue.value = result
}

</script>
<style scoped>
label {
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
.fill {
  font-variation-settings:
  'FILL' 1,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}
input:required label:after {
  content: '*';
  color: black;
}
</style>