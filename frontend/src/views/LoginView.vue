<template>
    <div class="h-screen w-screen items-center justify-center m-0 flex 
    laptop:flex-row phone:flex-col laptop:bg-none 
    phone:bg-gradient-to-b from-secondary via-third to-primary">
        <div class="w-1/3 phone:shadow-2xl laptop:shadow-none max-w-4xl min-w-fit h-auto rounded-xl p-16 bg-white m-4 ">
            <div class="flex w-full justify-center">
                <img class="w-2/3 max-w-md" :src="''" alt="">
            </div>
            <div v-if="!codeValidation" class="flex flex-row justify-center gap-3 tablet:py-8 phone:py-4 ">
                <span 
                @click="changeMode(typeLogin.in)"
                class="text-xl font-bold mb-10 py-1 px-3  cursor-pointer montserrat"
                :class="[
                    mode == 'sign in' ? 
                    'text-primary border-b-primary border-b-4 ' : 
                    'text-gray-600 hover:bg-gray-50'
                ]">
                    Sign in
                </span>
                <span 
                @click="changeMode(typeLogin.out)"
                class="hidden text-xl font-bold mb-10 py-1 px-3  cursor-pointer"
                :class="[
                    mode == 'register' ? 
                    'text-primary border-b-primary border-b-4 ' : 
                    'text-gray-600 hover:bg-gray-50'
                ]">
                    Register
                </span>
            </div>
            <div v-if="mode == 'sign in'" >
                <!-- Usuario -->
                <div class="flex flex-col items-start pb-4 gap-5">
                    <Input
                        class="w-full"
                        :color="notificationColor"
                        placeholder="User"
                        label="Username"
                        v-model="user.nickname"
                        size="md"
                        type="text"
                        :notificationColor="notificationColor"
                        prependIcon="account_circle"
                        @keyup.enter="() => { 
                        user.password != '' || user.nickname  != '' ? login() : null}"
                    />
                    <Input 
                        class="w-full"
                        :color="notificationColor"
                        placeholder="Your password"
                        label="Password"
                        v-model="user.password"
                        size="md"
                        type="password"
                        prependIcon="lock"
                        :notificationColor="notificationColor"
                    />
                    <CheckBox v-model="remindMe" content="Remind me"></CheckBox>
                </div>
                <!-- Actions buttons -->
                <div class="flex flex-col items-center">
                    <Button class="w-full justify-center" color="primary" icon="login" content="Sign In" exactColor @click="login()" />
                </div>
            </div>
            <!-- Register form -->
            <div v-else>
                <template v-if="!codeValidation">
                    <!-- Form -->
                    <div class="flex flex-col items-start pb-2 gap-4">
                        <Input
                            class="w-full"
                            :color="notificationColor"
                            placeholder="Full Name"
                            label="Full Name"
                            v-model="newUser.fullName"
                            size="md"
                            type="text"
                            :notificationColor="notificationColor"
                            prependIcon="account_circle"
                        />
                        <Input
                            class="w-full"
                            @focusout="validateEmail()"
                            :color="notificationColor"
                            placeholder="Email"
                            label="Email"
                            v-model="newUser.email"
                            size="md"
                            type="text"
                            prependIcon="alternate_email"
                            :hint="hintEmailField"
                            hintColor="primary"
                            :notificationColor="notificationColor"
                        />
                        <Input
                            class="w-full"
                            @focusout="validateCellphone()"
                            :color="notificationColor"
                            placeholder="Cellphone"
                            label="Cellphone"
                            v-model="newUser.cellphone"
                            size="md"
                            type="number"
                            prependIcon="call"
                            :hint="hintCellphoneField"
                            hintColor="primary"
                            :notificationColor="notificationColor"
                        />
                        <Input 
                            class="w-full"
                            :color="notificationColor"
                            placeholder="Your password"
                            label="Password"
                            v-model="newUser.password"
                            size="md"
                            type="password"
                            prependIcon="lock"
                            :notificationColor="notificationColor"
                        />
                        <Input 
                            class="w-full"
                            :color="notificationColor"
                            placeholder="Confirm password"
                            label="Confirm Password"
                            v-model="newUser.confirmPassword"
                            size="md"
                            type="password"
                            prependIcon="lock"
                            :notificationColor="notificationColor"
                        />
                    </div>
                    <div v-if="passwordNotMatch && newUser.password != newUser.confirmPassword" class="py-2 text-red-700">
                        Passwords do not match
                    </div>
                    <div v-if="showMessageRegister" class="py-2 text-red-700">
                        Missing fields to fill
                    </div>
                    <div class="flex flex-col items-center">
                        <Button class="w-full justify-center" 
                        :disabled="hintEmailField != '' || hintCellphoneField != ''" 
                        color="primary" 
                        icon="add_circle" 
                        content="Register" 
                        exactColor 
                        @click="register()" />
                    </div>
                </template>
                <template v-else>
                    <div class="py-4 inline-block text-lg">
                        Enter the verification code we just sent you on your email address
                    </div>
                    <div class="flex py-8 justify-center">
                        <!-- <OTPInput v-model="codeValue" type="number" :digits="6" /> -->
                        <Input 
                            class="w-1/4"
                            :color="notificationColor"
                            placeholder=""
                            label="Code"
                            v-model="codeValue"
                            size="md"
                            type="number"
                            prependIcon="lock"
                            :notificationColor="notificationColor"
                        />
                    </div>
                    <!-- Actions buttons -->
                    <div class="flex flex-col items-center gap-3">
                        <button class="p-2 border rounded-lg shadow hover:bg-gray-50">Resend code?</button>
                        <Button class="w-full justify-center" color="primary" icon="verified" content="Verified code" exactColor @click="verifyCode()" />
                    </div>
                </template>
            </div>
            <!-- Or -->
            <template v-if="!codeValidation">
                <div class="flex flex-row justify-between py-8">
                    <span class=" px-3 w-full">Or sign in with</span>
                </div>
                <!-- Other Logins -->
                <div class="flex phone:flex-col justify-center items-center tablet:flex-row gap-3">
                    <button id="googleButton" />
                </div>
            </template>
        </div>
        <div class="laptop:w-2/3 phone:hidden laptop:flex justify-center items-center h-full bg-gradient-to-b from-secondary via-third to-primary" >
            <div class="text-5xl text-white">Welcome Back</div>
        </div>
        <Alert v-show="showMessage" 
            @close="showMessage = false"
            :title="alertMessageContent.title"  
            :description="alertMessageContent.description"
            :type="alertMessageContent.type"
        />
        <GoogleSync prompt  @login="loginGoogle" />
    </div>
  </template>
  
<script setup lang="ts">
import { onMounted, ref, type Ref, inject } from 'vue';
import GoogleSync from '@/components/GoogleSync.vue'
import { useRouter, type Router } from 'vue-router'
import md5 from 'md5'
import {LoginApi, ValidateEmail, ValidateCellphone, RegisterNewUser, ActivateCustomer, LoginWithGoogle} from '@/services/login'
import {Alert, Input, Button, CheckBox} from '@/components/Generics/generics'
import type { userSchema } from '@/schemas';
import { useAuthStore } from '@/stores/auth';
import { alertMessageApp } from '@/composables/alertFunction';

    enum typeLogin {
        in = 'sign in',
        out = 'register'
    }
    const auth = useAuthStore()
    const router: Router = useRouter()
    //Register vars
    const newUser = ref({
        fullName: '',
        email: '',
        cellphone: '',
        password: '',
        confirmPassword: '',
    })
    const passwordNotMatch: Ref<boolean> = ref(false)
    const showMessageRegister: Ref<boolean> = ref(false)
    const codeValidation: Ref<boolean> = ref(false)
    const codeValue: Ref<string> = ref('')
    const hintEmailField: Ref<string> = ref('')
    const hintCellphoneField: Ref<string> = ref('')
    
    const mode: Ref<typeLogin> = ref(typeLogin.in);

    // Login vars
    const user = ref({
        nickname: '',
        password: ''
    })        
    const notificationColor = ref('black')
    const showMessage = ref(false)
    const remindMe: Ref<boolean> = ref(false);
    const alertMessageContent:any = ref({title: '',
            description: '',
            type: ''
        })
    onMounted(async () => {
        let remindUser = JSON.parse(localStorage.getItem('remindUser') || '{}')
        if (Object.keys(remindUser).length !== 0) {
            user.value = remindUser
            remindMe.value = true
        }
    })

    const loginGoogle = async (event: any) => {
        window.focus()
        console.log('Google token',event)
        const response = await LoginWithGoogle({
            token: event.credential
        })
        if (response.status == 200) {
            const user = response.data.user
            user.token = {
                value: response.data.token,
                expirate: response.data.user.exp
            }
            auth.setUser(response.data.user)
            auth.setModules(response.data.menus)
            auth.setColors(JSON.parse(response.data.user.colors))
            router.push({
                path:'dashboard'
            })
        } else {
            alertMessage('Atencíon','Cuento no creada', 'warning')
        }
    }

    /**
     * Validar disponibilidad del email
     */
    const validateEmail = async () => {
        if (new RegExp('^[^@]+@[^@]+\\.[a-zA-Z]{2,}$').test(newUser.value.email)) {
            const response = await ValidateEmail({
                email: newUser.value.email
            })
            if (response.status != 200) {
                hintEmailField.value = 'Email no disponible'
            } else {
                hintEmailField.value = ''
            }
        } else {
            hintEmailField.value = 'El email debe tener el estandar alguien@example.com'
        }
    }

    /**
     * Validar disponibilidad del celular
     */
    const validateCellphone = async () => {
        // eslint-disable-next-line no-useless-escape
        if (new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$').test(newUser.value.cellphone)) {
            const response = await ValidateCellphone({
                cellphone: newUser.value.cellphone
            })
            if (response.status != 200) {
                hintCellphoneField.value = 'Cellphone no disponible'
            } else {
                hintCellphoneField.value = ''
            }
        } else {
            hintCellphoneField.value = 'Cellphone debe tener el estandar numerico de 1234567890'
        }
    }

    /**
     * Change mode of sign 
     * @param type type login to use
     */
    const changeMode = async (type: typeLogin) => {
        mode.value = type
    }

    /**
     * Call alert message
     * @param title 
     * @param description 
     * @param type 
     */
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

    /**
     * Login Process
     */
    const login = async () => {
        if (remindMe.value) {
            localStorage.setItem('remindUser',  JSON.stringify(user.value))
        } else {
            localStorage.removeItem('remindUser')
        }
        await LoginApi({
            nickname: user.value.nickname,
            password: md5(user.value.password)
        })
        .then(response => {

            if (response.status == 200) {
                const user = response.data.user
                user.token = {
                    value: response.data.token,
                    expirate: response.data.user.exp
                }
                auth.setUser(response.data.user)
                auth.setModules(response.data.menus)
                auth.setColors(JSON.parse(response.data.user.colors))
                router.push({
                    path:'dashboard'
                })

            } else {
                alertMessage('Atencíon','Credenciales incorrectas', 'error')
                notificationColor.value = 'red' 
            }

        })
        .catch(error => {
            error
        })
    }

    /**
     * Register process
     */
    const register = async () => {
        showMessageRegister.value = false
        passwordNotMatch.value = false


        if (newUser.value.confirmPassword == '' ||  newUser.value.password == '' ||
        newUser.value.fullName == '' || newUser.value.email == '' || newUser.value.cellphone == ''  ) {
            showMessageRegister.value = true
            return 
        }
        if (newUser.value.password != newUser.value.confirmPassword) {
            passwordNotMatch.value = true
            return
        }
        const response = await RegisterNewUser({
            name: newUser.value.fullName,
            email: newUser.value.email,
            cellphone: newUser.value.cellphone,
            password: md5(newUser.value.password)
        })
        if (response.status == 200) {
            codeValidation.value = true
        } else {
            alertMessage('Atencíon','Error al crear el usuario, intente nuevamente', 'error')
        }
    }

    const verifyCode = async () => {
        console.log(codeValue.value)

        await ActivateCustomer({
            email: newUser.value.email,
            cellphone: newUser.value.cellphone,
            code: codeValue.value
        })
        .then(response => {
            console.log(response)
        })
    }

  </script>
  
  <style scoped>
  </style>