<template>
    <div class="flex flex-wrap w-full select-none">
        <ul class="w-full">
            <li class="py-2" @dragover.prevent="itemOver = 's0'" @dragleave.prevent="itemOver = ''"
            @dragenter.prevent dropzone :class="[itemOver == 's0' ? 'bg-black bg-opacity-30' : '']" 
            @drop="dropItemPrepend($event)"
            >

            </li>
            <template v-for="(item, index) in props.list" :key="index">
                <li class="border w-full py-1 px-3 text-base" dropzone @dragover.prevent="itemOver = index.toString()"
                    @dragleave.prevent="itemOver = ''" @dragenter.prevent @drop="dropItemReplace($event, index)"
                    :class="[itemOver == index.toString() ? 'bg-black bg-opacity-30' : '']">
                    <div :draggable="true" @dragstart="dragStart($event, index)" @dragend="itemOver = ''">
                        {{ item[props.sort] }}
                    </div>
                </li>
                <li class="py-2" @dragover.prevent="itemOver = 'v'+index" @dragleave.prevent="itemOver = ''"
                    @dragenter.prevent dropzone :class="[itemOver == 'v'+index ? 'bg-black bg-opacity-30' : '']"
                    @drop="dropItemNext($event, index)">
                </li>
            </template>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';


export interface SortableProps {
    list: any[],
    sort: string
}
const props = defineProps<SortableProps>()
const itemOver: Ref<string> = ref('')

const dragStart = (ev: DragEvent, index: number) => {
    ev.dataTransfer?.setData('last', index.toString())
}

const dropItemReplace = (ev: DragEvent, index: number) => {
    const last: number = parseInt(ev.dataTransfer?.getData('last') ?? '0')
    const aux = props.list[last]
    props.list[last] = props.list[index]
    props.list[index] = aux
}

const dropItemNext = (ev: DragEvent, index: number) => {
    const last: number = parseInt(ev.dataTransfer?.getData('last') ?? '0')
    const aux = props.list[last]
    props.list.splice(last, 1)
    props.list.splice(index + 1, 0, aux)
}

const dropItemPrepend = (ev: DragEvent) => {
    const last: number = parseInt(ev.dataTransfer?.getData('last') ?? '0')
    const aux = props.list[last]
    props.list.splice(last, 1)
    props.list.unshift(aux)
}


</script>