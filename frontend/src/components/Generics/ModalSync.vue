<template>
  <div v-if="showModal"
    class="forward-all fixed top-0 left-0 right-0 bottom-0 bg-[#00000087] flex justify-center items-center animate__backOutDown">
    <div class="bg-white overflow-x-auto flex items-center flex-col m-2 px-10 py-6 w-[500px] rounded-2xl">
      <header class="flex justify-center font-bold relative border-b py-1 text-2xl w-full" id="modalTitle">
        {{ modalInfo.title }}
      </header>

      <body class="phone:text-base  tablet:text-lg py-8">
        <div v-html="modalInfo.description">
        </div>
        <div v-if="modalInfo.input" class="pt-6">
          <Input class="w-full" v-model="modalInfo.inputValue" :color="modalInfo.inputInfo?.color ?? 'black'"
            :placeholder="modalInfo.inputInfo?.placeHolder ?? 'Answer here'"
            :label="modalInfo.inputInfo?.label ?? 'Answer'" :size="modalInfo.inputInfo?.size ?? 'md'"
            :type="modalInfo.inputInfo?.type ?? 'text'" />
        </div>
      </body>
      <footer class="w-full flex flex-row justify-center py-3 border-t">
        <Button exactColor color="third" size="sm" class="mr-2" icon="close" :content="modalInfo.cancelButton"
          @click="modal.dismiss" />
        <Button exactColor color="primary" size="sm" class="mr-2" icon="check" :content="modalInfo.confirmationButton"
          @click="modal.close" />
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Input } from '@/components/Generics/generics'
import { ref, type Ref, defineExpose } from 'vue';
import type { bodyModal, promiseResponse } from '@/classes/Modal';

const showModal: Ref<boolean> = ref(false)
const modal: Ref<any> = ref({})
const modalInfo: Ref<bodyModal> = ref({
  title: 'Confirm action',
  description: null,
  confirmationButton: 'OK',
  cancelButton: 'Cancel',
  inputValue: '',
  input: false,
  inputInfo: {
    label: 'Answer',
    color: 'black'
  }
})



const show = async (props: bodyModal) => {
  asignProps(props)
  showModal.value = true
  const promise = new Promise((resolve, reject) => {
    modal.value.close = () => {
      showModal.value = false
      let response: promiseResponse = {
        success: true,
        value: modalInfo.value.inputValue ?? ''
      }
      resolve(response)
      resetValues()
    }
    modal.value.dismiss = () => {
      showModal.value = false
      let response: promiseResponse = {
        success: false,
        value: ''
      }
      resolve(response)
      resetValues()
    }
  })

  return promise
}

const resetValues = async () => {
  modalInfo.value = {
    title: 'Confirm action',
    description: null,
    confirmationButton: 'OK',
    cancelButton: 'Cancel',
    inputValue: '',
    input: false,
    inputInfo: {
      label: 'Answer',
      color: 'black'
    }
  }
}

const asignProps = async (props: bodyModal) => {
  props.title ?
    modalInfo.value.title = props.title : null
  props.description ?
    modalInfo.value.description = props.description : null
  props.confirmationButton ?
    modalInfo.value.confirmationButton = props.confirmationButton : null
  props.cancelButton ?
    modalInfo.value.cancelButton = props.cancelButton : null

  //Assign input  
  modalInfo.value.input = props.input ?? false
  modalInfo.value.inputInfo = props.inputInfo
}


defineExpose({
  show, showModal
})

</script>

<style>
.forward-all {
  z-index: 9999;
}
</style>