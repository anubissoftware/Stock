<template>
    <div class="relative flex flex-col overflow-hidden justify-center items-center border h-full w-full cursor-pointer select-none"
        style="z-index: 1;" @click="fireUpload">
        <img :src="props.modelValue.info" class="h-full w-auto duration-200" v-if="isImage">
        <div v-if="isDocument" class="flex flex-col justify-center">
            <Icon icon="article" class="text-6xl" />
            <div>
                {{ props.modelValue.name }}
            </div>
        </div>
        <div class="hover:scale-125 bg-black bg-opacity-20 duration-200 absolute top-0 flex flex-col justify-center items-center h-full w-full"
            :class="haveDocument ? 'opacity-0 bg-opacity-70 hover:opacity-100 text-white' : ''">
            <span>
                <Icon class=" text-6xl" icon="publish" />
            </span>
            <span class="font-bold text-2xl italic">
                Upload
            </span>
        </div>
        <input type="file" class="hidden" ref="inputFile" @change="validateDoc" />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref, defineProps, defineEmits, onMounted } from 'vue';
import {includesAny} from '@/composables/utils'
import Icon from './Icon.vue';
export interface droppableProps {
    modelValue: {
        name: string,
        info: any
    }
}
const emits = defineEmits(['update:modelValue', 'updatedImage'])
const props = defineProps<droppableProps>()
const inputFile: Ref<HTMLInputElement | null> = ref(null)
const src: Ref<any> = ref('')
const haveDocument = computed(() => {
    return isImage.value || isDocument.value
    // return props.modelValue ? true : false
})
const isImage = computed(() => {
    return includesAny(props.modelValue.name, ['png', 'jpeg', 'jpg', 'gif', 'svg'])
})
const isDocument = computed(() => {
    return includesAny(props.modelValue.name, ['pdf', 'ts', 'vue', 'doc', 'js', 'xls'])
})
const fireUpload = () => {
    inputFile.value?.click()
}
const validateDoc = () => {
    const file: File | '' = inputFile.value?.files?.length ? inputFile.value?.files[0] : ''
    if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            emits('update:modelValue', { name: file.name, info: reader.result })
            emits('updatedImage')
        }
        reader.onerror = () => {
            src.value = ''
        }
    }
}

</script>

<style scoped>

</style>
