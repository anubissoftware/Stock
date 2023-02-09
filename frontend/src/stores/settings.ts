import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {

    const config = ref({
        language: 'Spanish'
    })

    const getLanguage = computed((): "Spanish" | "English" => {
        return config.value.language as "Spanish" | "English"
    })

    const setLanguage = (lang: string) => {
        config.value.language = lang
    }

    return { getLanguage, setLanguage }
})
