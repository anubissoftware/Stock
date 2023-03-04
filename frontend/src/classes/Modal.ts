import type { UnwrapNestedRefs } from "vue";
import { reactive } from "vue";

interface modal {
    modal: {
        show(modalInfo: bodyModal): Promise<any>,
        showModal: boolean
    }
}
interface modalProduct {
    modal: {
        show(modalInfo: productModal): Promise<any>
    }
}

export interface bodyModal  {
    title: string,
    description?: any,
    confirmationButton?: string,
    cancelButton?: string,
    input?: boolean,
    inputInfo?: input
    inputValue:string
}

export interface productModal  {
    title: string,
    description: string,
    image?: string,
    price: number,
    rating: string,
    discount?: number,
    confirmationButton?: string,
    cancelButton?: string,
}
  
export interface input {
label: string
color?: string,
placeHolder?: string,
size?: string,
type?: string
}

export interface promiseResponse {
success: boolean
value: any
}

export const modalComp: UnwrapNestedRefs<modal> = reactive({
    modal: {
        show: async () => {
            return 
        },
        showModal: false
    }
})

export const modalProductSync: UnwrapNestedRefs<modalProduct> = reactive({
    modal: {
        show: async () => {
            return
        }
    }
})

export interface modalResponse {
    success: boolean
    value: string
}