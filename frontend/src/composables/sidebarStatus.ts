import { computed, reactive } from "vue";
import { useWindowSize } from "@vueuse/core";

export const sidebarStatus = reactive({
    open: false,
    helper: false,
    createQuotation: false,
    createDispatch: false
})

export const setSidebar = (status: boolean) => {
    console.log('set sidebar')
    sidebarStatus.open = status
    if(status && sidebarStatus.helper){
        sidebarStatus.helper = false
    }
}

export const setHelper = (status: boolean) => {
    console.log('set helper')
    sidebarStatus.helper = status
    if(status && sidebarStatus.open){
        sidebarStatus.open = false
    }
}

export const isTablet = computed(() => {
    const { width, height } = useWindowSize()
    return width.value < 1024
})
