
<template>
    <div class="right-click-menu flex flex-col select-none" ref="contextMenu" :style="{ top: place.x, left: place.y }">
        <slot name="options" >
        </slot>
    </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { ref, type Ref, computed } from 'vue';

export interface contextProps {
    top: number,
    left: number,
    width?: number,
}

const emit = defineEmits(['close'])
const contextMenu: Ref<any> = ref();
onClickOutside(contextMenu, () => {
    emit('close')
})


const props = defineProps<contextProps>()
const place = computed(() => {
    let largestHeight;
    let largestWidth;
    let t = props.top;
    let l = props.left;
    if (contextMenu.value) {
        let widthScreen = 0
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // true for mobile device
            widthScreen = screen.width
        } else {
            // false for not mobile device
            widthScreen = window.innerWidth
        }
        largestHeight = window.innerHeight - contextMenu.value.offsetHeight - 25;
        if(props.width){
            largestWidth = props.width - contextMenu.value.offsetWidth;
        }else{
            largestWidth = widthScreen - contextMenu.value.offsetWidth - 25;
        }
        t = props.top;
        l = props.left;
        if (props.top > largestHeight) {
            t = largestHeight;
        }
        if (props.left > largestWidth) {
            l = largestWidth;
        }
        t = t + window.scrollY;
    }
    return {
        y: l + "px",
        x: t + "px"
    };
});

</script>

<style>
.right-click-menu {
    background: #FAFAFA;
    border: 1px solid #BDBDBD;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    width: 200px;
    z-index: 998;
}

.right-click-menu>div {
    margin: 3px 0px;
    transition: 0.3s;
}

.right-click-menu>div:hover {
    background-color: rgb(156, 163, 175);
    transition: 0.3s;
    font-weight: 600;
}
</style>