
import { useSettingsStore } from '@/stores/settings';
import { computed } from 'vue';

export default computed((): "Spanish" | "English"  => {
    return useSettingsStore().getLanguage ?? 'English'
})