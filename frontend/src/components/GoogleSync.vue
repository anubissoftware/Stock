<template>
    <button id="googleButton" />
</template>
<script setup lang="ts">
import { onMounted, defineEmits, defineProps, ref, type Ref} from 'vue';
export interface contentGoogle {
    prompt?: boolean
}
const props = defineProps<contentGoogle>()
const emits = defineEmits(['login'])
onMounted(async () => {
    const googleClientId = '821546163620-umb951me6kvskm7idoje2tvvaasbmlpl.apps.googleusercontent.com'
    const app: any = window
    app.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: loginGoogle, 
        cancel_on_tap_outside: true,
        login_uri:'http://localhost:8080'
        });
    app.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        { theme: "outline", size: "medium" }  // customization attributes
    );
    if (props.prompt) {
        app.google.accounts.id.prompt();
    }
})

const loginGoogle = (token: any) => {
    window.focus()
    emits('login', token)
}
</script>