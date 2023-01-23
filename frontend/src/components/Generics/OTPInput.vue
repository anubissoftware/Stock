<template>
    <div class="flex gap-3" ref="otpCont">
        <input
        class=" h-12 w-12 p-4 inline-block border border-black rounded-lg outline-primary text-xl" 
        :type="props.type ?? 'text'"
        :min="0"
        :pattern="'^([0-9])$'"
        v-for="(digit, index) in digitsValue"
        :key="index"
        :autofocus="index === 0"
        v-model="digitsValue[index]"
        :maxlength="1"
        @keydown="handleKeyDown($event, index)"
        @paste="handleKeyPaste($event, index)"
        > 
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref, type Ref, computed} from 'vue';
export interface contentOTInput {
  modelValue: string
  digits: number
  type?: string
}
const props = defineProps<contentOTInput>()
const emits = defineEmits(['update:modelValue'])
const digitsValue: Ref<Array<any>> = ref([])
const otpCont: any = ref('')

onMounted( () => {
    for (let i =0; i < props.digits; i++) {
        digitsValue.value.push('')
    }
})

const handleKeyDown = async (event: any, index: number) => {
    if (event.key === "Backspace") {
        //Borrar el valor
        digitsValue.value[index] = null;
        //Pasar a pos anterior
        if (index != 0) {
            (otpCont.value.children)[index-1].focus();
        } 
        return;
    }

    if ((new RegExp('^([0-9])$')).test(event.key)) {
        digitsValue.value[index] = event.key;
        //Pasar a prox valor
        if (index != props.digits - 1) {
            (otpCont.value.children)[index+1].focus();
        }
    }
    //Validar si todos estan llenos
    if (await isDigitsFull()) {
        emits('update:modelValue', digitsValue.value.join(''))
    }
}

const handleKeyPaste =  (event: any, index: number) => {
    if (!(/^\d+$/.test(event.clipboardData.getData('Text')))) {
        return false
    }

    let pasteValue = Array.from(event.clipboardData.getData('Text'))
    if (pasteValue.length <= props.digits) {
        for (let i = 0; i < pasteValue.length; i++) {
            digitsValue.value[i] = pasteValue[i];
            (otpCont.value.children)[i].focus();
        }
    }
    
    return false
}

const isDigitsFull = async () => {
    for (const number of digitsValue.value) {
        if (number == null || number == undefined) {
            return false;
        }
    }
    return true;
}
</script>