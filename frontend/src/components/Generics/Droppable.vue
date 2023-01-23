<template>
    <div class="relative flex flex-col overflow-hidden justify-center items-center border h-full w-full cursor-pointer select-none"
        style="z-index: 1;" @click="fireUpload">
        <img :src="props.modelValue" class="h-full w-auto duration-200" v-if="haveImage">
        <div :style="haveImage ? 'background-color: rgba(00, 00, 00, 0.3);' : ''"
            class="hover:scale-125 duration-200 absolute top-0 flex flex-col justify-center items-center h-full w-full">
            <span>
                <Icon class=" text-6xl" icon="publish" />
            </span>
            <span class="font-bold text-2xl italic">
                Upload
            </span>
        </div>
        <input type="file" class="hidden" ref="imageFile" @change="validateDoc"
            accept="image/png, image/jpeg, image/svg, image/jpg" />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref, defineProps, defineEmits, onMounted } from 'vue';
import Icon from './Icon.vue';
export interface droppableProps {
    modelValue: any
}
const emits = defineEmits(['update:modelValue', 'updatedImage'])
const props = defineProps<droppableProps>()
const imageFile: Ref<HTMLInputElement | null> = ref(null)
const src: Ref<any> = ref('')
const haveImage = computed(() => {
    return props.modelValue ? true : false
})
const fireUpload = () => {
    imageFile.value?.click()
}
const validateDoc = () => {
    const file = imageFile.value?.files?.length ? imageFile.value?.files[0] : ''
    if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            src.value = reader.result
            if (!props.modelValue.includes('/logos/')) {
                emits('update:modelValue', reader.result)
            }
            emits('updatedImage', reader.result)
        }
        reader.onerror = () => {
            src.value = ''
        }
    }
}

</script>

<style scoped>

</style>
