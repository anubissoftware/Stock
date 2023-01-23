<template>
    <div class="flex w-full flex-col  gap-3 p-8">
        <!-- Tabs  -->
        <div class="flex w-full overflow-auto shadow-xl rounded-2xl">
            <div class="flex flex-row justify-center items-center w-auto border">
                <div 
                v-for="(menu, index) in props.menus" :key="index"
                @click="changeMenu(menu)"
                class=" w-60 flex justify-center p-3 select-none cursor-pointer
                hover:bg-gray-50 hover:scale-110 transition-all ease-in-out"
                >
                    {{menu.name}}
                </div>
            </div>
        </div>

        <!-- Content menu -->
        <div class="flex flex-col gap-3 w-full rounded-2xl">
            <template v-for="(contentMenu,index) in props.contentsMenus" :key="index">
                <template v-if="selection.name == contentMenu.name">
                    <ItemList :items="contentMenu.items" />
                </template>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, type Ref, ref } from 'vue';
import { ItemList } from '@/components/Store/componentsStore'
export interface contentHaderStore {
  content?: string
  menus: Array<any>
  contentsMenus: Array<any>
}

const props = defineProps<contentHaderStore>()
const selection = computed(()=> {
    let menuSelected = props.menus.filter((menu) => {
        if (menu.selected) {
            return menu
        }
    })
    console.log(props.menus)
    return menuSelected[0]
})

const changeMenu = async (menuToChange: any) => {
    props.menus.map((menu) => {
        if (menu.id == menuToChange.id) {
            menu.selected = true
        } else {
            menu.selected = false
        }
    })
}

enum optionView {
    basics,
    notification,
    storeView
}

const selectionView: Ref<optionView> = ref(optionView.basics)
</script>