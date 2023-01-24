<template>
    <div ref="tag">
        <div class="flex rounded-md py-2 italic font-bold whitespace-nowrap overflow-x-hidden cursor-pointer select-none"
            :style="{ 'background-color': props.category.color, 'color': color }" @dblclick="isOpt = !isOpt">
            <div v-if="!isOpt" class="flex w-full justify-center items-center">{{ props.category.name }}</div>
            <div v-else class="flex w-full justify-center items-center gap-7 overflow-hidden">
                <Icon class="hover:scale-125 duration-150" icon="delete_forever" @click="deleteCat()" />
                <Icon class="hover:scale-125 duration-150" icon="draw" @click="toEdit()" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { defineProps, ref, computed, defineEmits } from 'vue'
import lightDark from '@check-light-or-dark/color'
import { Icon } from './Generics/generics';
import { modalComp, type promiseResponse } from '@/classes/Modal';
import language from '@/services/language';
import { deleteCategory } from '@/services/product'
import type { categoryQuery, token } from '@/schemas';
import { useAuthStore } from '@/stores/auth';

export interface categoryTagProps {
    category: {
        color: string
        name: string
        id: number
    }
}
const isDarkColor = (color: string) => {
    return lightDark(color) == 'dark'
}
const user = useAuthStore()
const tag = ref(null)
const props = defineProps<categoryTagProps>()
const emit = defineEmits<{ (e: 'edit', cat: categoryQuery): void }>()
const isOpt = ref(false)
const color = computed(() => {
    return isDarkColor(props.category.color) ? 'white' : 'black'
})
onClickOutside(tag, () => {
    if (isOpt.value) {
        isOpt.value = false
    }
})
const toEdit = () => {
    emit('edit', props.category)
}
const deleteCat = () => {
    modalComp.modal.show({
        title: strings.delTitle[language.value],
        description: strings.delDesc[language.value],
        input: false,
        inputValue: '',
        inputInfo: {
            label: 'amount'
        }
    }).then(async (res: promiseResponse) => {
        if (res.success) {
            const token = user.getUser.token as token
            let { status } = await deleteCategory(token.value, props.category.id)
        }
    })
}

const strings = {
    delTitle: {
        Spanish: 'Eliminar categoria',
        English: 'Delete category'
    },
    delDesc: {
        Spanish: '¿Seguro de que quiere eliminar esta categoría?',
        English: 'Do you want to delete this category?'
    },
    delOk: {
        Spanish: 'Eliminar categoría',
        English: 'Delete category'
    },
    delCan: {
        Spanish: 'Cancelar',
        English: 'Cancel'
    }
}

</script>

<style scoped>

</style>
