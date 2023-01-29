import { computed, reactive } from "vue";

export const alertMessageApp = reactive({
    value: {
        title: '',
        description: '',
        type: '',
        show: false
    }
})