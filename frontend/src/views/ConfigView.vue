<template>
    <div>
        <Header2>
            <template v-slot:mainContainer>
                <div class=" p-10 flex flex-col items-start min-h-[70vh]">
                    <div
                        class="pb-4 flex tablet:flex-row justify-between items-center w-full phone:flex-col phone:items-start">
                        <h1 class="flex flex-row justify-center laptop:text-4xl py-2 phone:text-2xl">
                            <span class="text-left">
                                {{ string.title[language] }}
                            </span>
                        </h1>
                    </div>
                    <div class="flex flex-row w-full flex-wrap ">
                        <div
                            class="flex flex-col tablet:w-1/3 phone:w-full phone:mb-10 items-start py-2 tablet:border-r-2 phone:border-r-0 border-primary">
                            <div class="flex flex-row gap-3 phone:justify-center tablet:justify-start items-center w-full py-4">
                                <Icon icon="home_work" class=" text-5xl" />
                                <span class="italic font-semibold">
                                    {{ user.nickname.charAt(0).toUpperCase() + user.nickname.slice(1) }}
                                </span>
                            </div>
                            <Select class="w-full phone:flex tablet:hidden" color="black" label="Menu" v-model="menuActive"
                            :items="menusFilter" size="md" type="text" value="name" required />
                            <div v-for="(menu, index) in menusFilter" :key="index"
                                class="items-center pl-10 rounded font-bold duration-200 hover:bg-primary hover:scale-105 hover:text-white w-full text-left py-1 my-1 cursor-pointer phone:hidden tablet:flex"
                                :class="menuActive.key == menu.key ? 'bg-primary text-white' : ''"
                                @click="setMenu(menu)">
                                {{ menu.name  }}
                            </div>
                        </div>
                        <!-- Menú 0 -->
                        <div class="tablet:w-2/3 phone:w-full flex flex-col tablet:p-8 phone:p-2 gap-5" v-if="menuActive.key == 0">
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
                        <div class="tablet:w-2/3 phone:w-full flex flex-col tablet:p-8 phone:p-2 gap-5" v-if="menuActive.key == 1">
                            <div class="flex flex-col flex-wrap items-start justify-center text-start">
                                <div class="flex flex-row py-4 w-full justify-center items-center">
                                    <div class="w-1/3 font-extrabold">
                                        {{ string.language[language] }}:
                                    </div>
                                    <div class="w-2/3">
                                        <MultiSwitch :options="languageOptions" @change-language="setLanguage($event)" />
                                    </div>
                                </div>
                                <!-- GoogleSync -->
                                <div class="flex flex-row py-4 w-full justify-center items-center">
                                    <div class="w-1/3 font-extrabold">
                                        {{ string.sync[language] }}:
                                    </div>
                                    <div class="flex w-2/3">
                                        <GoogleSync v-if="!user.email || user.email_verified != '1'" @login="syncGoogle" />
                                        <span v-else class="flex items-center text-green-800">Sincronizacion habilitada
                                            &nbsp;
                                            <Icon icon="check" class="text-2xl" />
                                        </span>
                                    </div>
                                </div>
                                <div v-if="user.isAdmin == '1'" class="flex laptop:flex-row phone:flex-col py-4 w-full justify-center items-start gap-4">
                                    <div class="flex flex-wrap justify-between items-center laptop:w-1/3 phone:w-full font-extrabold">
                                        {{ string.color[language] }}:
                                        <Button v-if="userColors.length < 3 " class="w-fit" exactColor color="primary" size="sm" content="Add color" icon="add" @click="addColor" />
                                        
                                    </div>
                                    <div class="flex laptop:flex-col phone:flex-row flex-wrap laptop:w-1/3 phone:w-full gap-2">
                                        <template v-for="(color, index) in userColors" :key="index">
                                            <div class="rounded-xl border flex flex-row px-1 bg-primary text-white">
                                                <ColorPicker v-model="color.value" />
                                                <Icon icon="delete" class="text-white self-center cursor-pointer" @click="userColors.splice(index, 1)"/>
                                            </div>
                                        </template>
                                        
                                    </div>
                                    <Button class="phone:w-fit laptop:w-1/3" exactColor color="primary" icon="save" content='Save colors' @click="saveColors" />
                                </div>
                            </div>
                        </div>
                        <!-- Menú 2 -->
                        <div class="tablet:w-2/3 phone:w-full flex flex-col tablet:p-8 phone:p-2 gap-5" v-if="menuActive.key == 2">
                            <div class="flex flex-row flex-wrap items-center">
                                <div class="w-full ">
                                    <CategoriesConfig />
                                </div>
                            </div>
                        </div>
                        <!-- Menú 3 -->
                        <div class="tablet:w-2/3 phone:w-full flex flex-col tablet:p-8 phone:p-2 gap-5" v-if="menuActive.key == 3">
                            <div class="flex flex-row flex-wrap items-center">
                                <div class="w-full ">
                                    <span>
                                        Roles
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!-- Menú 4 -->
                        <div class="tablet:w-2/3 phone:w-full flex flex-col tablet:p-8 phone:p-2 gap-5" v-if="menuActive.key == 4">
                            <div class="flex flex-row flex-wrap items-center">
                                <transition v-if="changePass" name="sliding">
                                    <div class="flex flex-col w-full tablet:gap-8 phone:gap-4">

                                        <Input 
                                            class="w-full"
                                            placeholder="Last password"
                                            label="Last Password"
                                            v-model="changePassForm.lastPass"
                                            size="md"
                                            type="password"
                                            prependIcon="lock"
                                        />
                                        <Input 
                                            class="w-full"
                                            placeholder="New password"
                                            label="New Password"
                                            v-model="changePassForm.newPass"
                                            size="md"
                                            type="password"
                                            prependIcon="lock"
                                        />
                                        <Input 
                                            class="w-full"
                                            placeholder="Confirm new password"
                                            label="Confirm new Password"
                                            v-model="changePassForm.confirmNewPass"
                                            size="md"
                                            type="password"
                                            prependIcon="lock"
                                        />
                                    </div>
                                </transition>
                                <div class="flex flex-row py-4 w-full justify-center items-center">
                                    <Button v-if="!changePass" exactColor color="primary" icon="key" :content=string.changePass[language]
                                    @click="changePass = true" />
                                    <div v-if="changePass" class="flex flex-row w-full gap-4 justify-center">
                                        <Button exactColor color="secondary" icon="clear" content='Exit'
                                        @click="changePass = false" />
                                        <Button exactColor color="primary" icon="clear" content='Submit'
                                        @click="changePassword"
                                         />
                                    </div>
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
import { computed, ref, type Ref, watch, onMounted, onUnmounted, inject } from 'vue';
import QRCodeStyling from 'qr-code-styling'
import language from '@/services/language';
import CategoriesConfig from '@/components/CategoriesConfig.vue';
import GoogleSync from '@/components/GoogleSync.vue';
import Droppable from '@/components/Generics/Droppable.vue';
import { Button, Input, Select, ColorPicker, Icon } from '@/components/Generics/generics';
import { uploadEnterpriseImage } from '@/services/enterprise'
import { SyncWithGoogle, ChangePassword } from '@/services/login'
import { ChangeEnterpriseColors } from '@/services/enterprise'
import Header2 from '@/components/Header2.vue';
import socket from '@/composables/socket'
import md5 from 'md5'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings';
import type { token } from '@/schemas';
import { alertMessageApp} from '@/composables/alertFunction'

const auth = useAuthStore()
const settings = useSettingsStore()

const logo = ref('')
const changePass: Ref<boolean> = ref(false)
const changePassForm = ref({
    lastPass: '',
    newPass: '', 
    confirmNewPass: ''
})
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
const qrCode = ref(null)
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
    sync: {
        Spanish: 'Sincronizar con Google',
        English: 'Sync with Google'
    },
    color: {
        Spanish: 'Seleccionar colores de empresa',
        English: 'Select enterprise colors'
    },
    changePass: {
        Spanish: 'Cambiar contraseña',
        English: 'Change password'
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

//Computed

const user = computed(() => {
    return auth.getUser
})

const userColors: Ref<any> = ref([])

const mapUserColor = async () => {
    if (user.value.colors) {
        const colorEnterprise = JSON.parse(user.value.colors)
        if (colorEnterprise.length != 0 ) {
            colorEnterprise.forEach((color: any) => {
                userColors.value.push({value: color.value})
            });
        }
    } else {
        userColors.value.push({value:'#000000'})
    }
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
        options.push({
            name: {
                Spanish: 'Seguridad',
                English: 'Security'
            },
            key: 4
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

const menusFilter = computed(() => {
    let menuMapped: Array<any> = []
    menus.value.forEach((menu) => {
        if (menu.name == undefined) {
            menuMapped.push(menu)
        } else {
            menuMapped.push({
                key: menu.key,
                name: menu.name[language.value]
            })
        }
    })
    return menuMapped
})
const menuActive = ref(menusFilter.value[0])
//Functions

onMounted(() => {
    socket.socket?.on('logoUpdated', updateLogo)
    logo.value = user.value.enterprise_path + '?v' + counter.value
    mapUserColor()
})

onUnmounted(() => {
    socket.socket?.off('logoUpdated', updateLogo)
})

const changePassword = async () => {
    if (changePassForm.value.confirmNewPass != changePassForm.value.newPass) {
        return alertMessage('Atención',
        'Nuevas contraseña no coinciden',
        'warning');
    }
    let updatePass = await ChangePassword((user.value.token as token).value, {
        lastPass: md5(changePassForm.value.lastPass),
        newPass: md5(changePassForm.value.newPass),
        nickname: user.value.nickname
    })
    if (updatePass.status == 200) {
        alertMessage('Contraseña actualizada','','success');
        changePassForm.value = {
            lastPass: '',
            newPass: '',
            confirmNewPass: ''
        }
        changePass.value = false
    }
}
const uploadLogo = (b64: string) => {
    uploadEnterpriseImage((user.value.token as token).value, b64)
}
const alertMessage = (title: string, description: string, type: string) => {
    alertMessageApp.value = {
        title,
        description,
        type,
        show: true
    }
    setTimeout(() => {
        alertMessageApp.value.show = false
    }, 3000);
}




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

const setMenu = (index: any) => {
    menuActive.value = index
}
const setLanguage = (language: "Espanish" | "English") => {
    settings.setLanguage(language)
}

const syncGoogle = async (event: any) => {
    console.log(event)
    let resultSync = await SyncWithGoogle((user.value.token as token).value, {
        token: event.credential,
        id: user.value.id
    })
    if (resultSync.status == 200) {
        user.value.email = resultSync.data.email
        user.value.email_verified = '1'
        alertMessage('Correcto',
            'Email verificado correctamente',
            'success');
    }
}

const addColor = async () => {
    userColors.value.push({value:'#000000'})
}

const saveColors = async () => {
    let resultColors = await ChangeEnterpriseColors((user.value.token as token).value, {
        colors: JSON.stringify(userColors.value),
        enterprise_id: user.value.enterprise_id
    })
    if (resultColors.status == 200) {
        auth.setColors(userColors.value)
        user.value.colors = JSON.stringify(userColors.value)
        auth.setUser(user.value)
    }
}



</script>

<style>

</style>