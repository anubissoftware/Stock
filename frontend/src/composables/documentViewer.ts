import { reactive } from "vue";


export const documentViewerAttributes = reactive({
    show: false,
    title: '',
    src: ''
})

export const setDocumentViewerAttributes = (title: string, src: string) => {
    documentViewerAttributes.src = src
    documentViewerAttributes.title = title
    documentViewerAttributes.show = true
}