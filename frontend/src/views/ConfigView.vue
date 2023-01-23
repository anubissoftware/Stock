<template>
    <div>
        <Header2>
            <template v-slot:mainContainer>
                <div class=" min-h-[90vh] flex flex-col px-4">
                    <div class="flex flex-row flex-wrap">
                        <span class="tablet:w-1/3 phone:w-0"></span>
                        <span
                            class=" text-3xl font-semibold py-6 tablet:w-2/3 phone:w-full tablet:text-left phone:text-center">
                            {{ string.title[language] }}
                        </span>
                    </div>
                    <div class="flex flex-row flex-wrap">
                        <div
                            class="flex flex-col tablet:w-1/3 phone:w-full phone:mb-10 phone:border-b-2 items-start py-2 ">
                            <div class="flex flex-col items-center w-full py-4">
                                <div>
                                    <Icon icon="storefront" class=" text-5xl" />
                                </div>
                                <span class="italic font-semibold">
                                    {{ user.nickname }}
                                </span>
                            </div>
                            <div v-for="(item, index) in menus" :key="index"
                                class="flex items-center pl-10 rounded font-bold duration-200 hover:bg-primary hover:text-white w-full text-left py-1 my-1 cursor-pointer"
                                :class="menuActive == item.key ? 'bg-primary text-white' : ''"
                                @click="setMenu(item.key)">
                                {{ item.name[language] }}
                            </div>
                        </div>
                        <!-- Menú 0 -->
                        <div class="tablet:w-2/3 phone:w-full flex flex-col gap-5" v-if="menuActive == 0">
                            <div class="flex flex-row flex-wrap items-center">
                                <div class="tablet:w-1/2 phone:w-full flex flex-col">
                                    <div class="w-full font-extrabold">
                                        {{ string.qr[language] }}:
                                    </div>
                                    <div class="w-full flex flex-row justify-center">
                                        <div ref="qrCode" @dblclick="download()"></div>
                                    </div>
                                </div>
                                <div class="tablet:w-1/2 phone:w-full flex flex-col">
                                    <div class="w-full font-extrabold">
                                        {{ string.logo[language] }}:
                                    </div>
                                    <div class="w-full flex flex-row justify-center items-center h-[150px] phone:mt-1">
                                        <Droppable v-model="logo" @updatedImage="uploadLogo" />
                                    </div>
                                </div>

                            </div>
                            <div class="flex flex-row flex-wrap items-center">

                            </div>
                        </div>
                        <!-- Menú 1 -->
                        <div class="tablet:w-2/3 phone:w-full flex flex-col gap-5" v-if="menuActive == 1">
                            <div class="flex flex-row flex-wrap items-center">
                                <div class="w-1/3 font-extrabold">
                                    {{ string.language[language] }}:
                                </div>
                                <div class="w-2/3">
                                    <MultiSwitch :options="languageOptions" @change-language="setLanguage($event)" />
                                </div>
                            </div>
                        </div>
                        <!-- Menú 2 -->
                        <div class="tablet:w-2/3 phone:w-full flex flex-col gap-5" v-if="menuActive == 2">
                            <div class="flex flex-row flex-wrap items-center">
                                <div class="w-full ">
                                    <CategoriesConfig />
                                </div>
                            </div>
                        </div>
                        <!-- Menú 3 -->
                        <div class="tablet:w-2/3 phone:w-full flex flex-col gap-5" v-if="menuActive == 3">
                            <div class="flex flex-row flex-wrap items-center">
                                <div class="w-full ">
                                    <span>
                                        Roles
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Header2>
    </div>
</template>

<script lang="ts" setup>
import MultiSwitch, { type switchValues } from '@/components/Generics/MultiSwitch.vue';
import Icon from '@/components/Generics/Icon.vue';
import { computed, ref, type Ref, watch, onMounted, onUnmounted, inject } from 'vue';
import QRCodeStyling from 'qr-code-styling'
import language from '@/services/language';
import CategoriesConfig from '@/components/CategoriesConfig.vue';
import Droppable from '@/components/Generics/Droppable.vue';
import { uploadEnterpriseImage } from '@/services/enterprise'
import Header2 from '@/components/Header2.vue';
import socket from '@/composables/socket'
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/products';
import { useSettingsStore } from '@/stores/settings';
import type { token } from '@/schemas';

const auth = useAuthStore()
const settings = useSettingsStore()

const user = computed(() => {
    return auth.getUser
})
const logo = ref('')
const counter = ref(Math.floor(Math.random() * 1000))
const updateLogo = () => {
    const temp = '' + logo.value
    logo.value = ''
    counter.value++
    setTimeout(() => {
        if (temp.includes('/logos/')) {
            logo.value = temp + '?v' + counter.value
        } else {
            logo.value = temp
        }
    }, 10);
}

onMounted(() => {
    socket.socket?.on('logoUpdated', updateLogo)
    logo.value = user.value.enterprise_path + '?v' + counter.value
})

onUnmounted(() => {
    socket.socket?.off('logoUpdated', updateLogo)
})

const uploadLogo = (b64: string) => {
    uploadEnterpriseImage((user.value.token as token).value, b64)
}

/**
 * [*LANGUAGE*]
*/
const menus = computed(() => {
    let options = [
        {
            name: {
                Spanish: 'Generales',
                English: 'Generals'
            },
            key: 1
        }
    ]
    if (user.value.enterprise_id > 0) {
        options.unshift({
            name: {
                Spanish: 'Tienda',
                English: 'Store'
            },
            key: 0
        })
        options.push({
            name: {
                Spanish: 'Categorías',
                English: 'Categories'
            },
            key: 2
        })
    }
    // eslint-disable-next-line
    if (user.value.isAdmin && false) {
        options.push({
            name: {
                Spanish: 'Roles',
                English: 'Roles'
            },
            key: 3
        })
    }
    return options
})

const menuActive = ref(menus.value[0].key)

const languageOptions: Ref<Array<switchValues>> = ref([
    {
        key: 'Spanish',
        id: 1,
        name: {
            Spanish: 'Español',
            English: 'Spanish'
        }
    },
    {
        key: 'English',
        id: 2,
        name: {
            Spanish: 'Inglés',
            English: 'English'
        }
    },
    // {
    //     key: 'Italiano',
    //     id: 3,
    //     name: {
    //         Spanish: 'Italiano',
    //         English: 'Italian'
    //     }
    // }
])
const qrCode = ref(null)
const qrCodeImage = new QRCodeStyling({
    width: 150,
    height: 150,
    type: "svg",
    data: window.location.protocol + '//' + window.location.host + '/' + user.value.shortcut,
    image: '',
    dotsOptions: {
        color: "#A64AEE",
        type: "rounded"
    },
    backgroundOptions: {
        color: "white",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 1
    }
});
const download = () => {
    qrCodeImage.download({ name: user.value.name + 'Qr', extension: 'png' })
}
watch(
    [qrCode, user],
    () => {
        if (qrCode.value != null) {
            qrCodeImage.append(qrCode.value)
        }
    }
)

const setMenu = (index: number) => {
    menuActive.value = index
}
const setLanguage = (language: "Espanish" | "English") => {
    settings.setLanguage(language)
}
/**
 * Dejar siempre al final [*LANGUAGE*]
*/
const string = {
    title: {
        Spanish: 'Configuración',
        English: 'Configuration'
    },
    language: {
        Spanish: 'Idioma',
        English: 'Language'
    },
    qr: {
        Spanish: 'Mi código Qr',
        English: 'My Qr'
    },
    logo: {
        Spanish: 'Mi logo',
        English: 'My logo'
    },
    categories: {
        Spanish: 'Categorías',
        English: 'Categories'
    }
}


</script>

<style>

</style>