<template>
    <div v-if="showModal"  class="forward-all fixed top-0 left-0 right-0 bottom-0 bg-[#00000087] flex justify-center items-center animate__backOutDown">
      <div 
        ref="cardProduct"
        class="bg-white overflow-x-auto flex items-center flex-col m-2 px-10 py-6 w-[500px] rounded-2xl"
      >
        <header
          class="flex justify-center font-bold relative border-b py-1 text-2xl w-full"
          id="modalTitle"
        >
          {{ modalInfo.title}} 
        </header>
        <body class="w-full py-8 overflow-auto 
        tablet:max-h-[600px] phone:max-h-[500px]
        tablet:text-lg phone:text-base">
            <figure class="flex justify-center p-4 border rounded-xl">
                <img :src="cardImage" alt="">
            </figure>
            <div class="flex flex-col w-full text-left py-4">
                <div class=" font-bold text-2xl ">
                    {{ '$' +  modalInfo.price}}
                </div>
                <div>
                    {{ '⭐️ ' + modalInfo.rating}}
                </div>
                <div class=" text-sm text-gray-400">
                    {{ modalInfo.description}}
                </div>
            </div>

            <!-- Form section -->
            <SelectionList v-model="select.selection" :multiple="select.multiple" :content="select.options" :title="select.title"  />
            <SelectionList v-model="select.selection" :multiple="select.multiple" :content="select.options" :title="select.title"  />
            <SelectionList v-model="select.selection" :multiple="select.multiple" :content="select.options" :title="select.title"  />
            <InputForm v-model="details.value" :title="details.title" />
        </body>
        <footer class="w-full flex flex-row justify-center py-3 border-t">
            <Button exactColor color="third" size="sm" class="mr-2" icon="close" :content="modalInfo.cancelButton" @click="modal.dismiss" />
            <Button exactColor color="primary" size="sm" class="mr-2" icon="check" :content="modalInfo.confirmationButton" @click="modal.close" />
        </footer>
      </div>
    </div>
</template>

<script setup lang="ts">
import { Button, SelectionList, Input } from '@/components/Generics/generics'
import { InputForm } from '@/components/Store/componentsStore'
import { ref, type Ref, defineExpose, computed} from 'vue';
import type { productModal, promiseResponse } from '@/classes/Modal';
import { onClickOutside } from '@vueuse/core';

const details= ref({
    title: {
        name: 'Details',
        hint: 'Some instructions here',
    },
    value: ''
})
const select= ref({
    title: {
        name: 'Salsa',
        hint: 'Salsa para su hamburguesa',
    },
    multiple: true,
    selection: [],
    options: [
        {
            id: 1,
            name:'Option 1',
            selected: true
        },
        {
            id: 2,
            name:'Option 2',
            selected: false
        },
        {
            id: 3,
            name:'Option 3',
            selected: false
        },
        {
            id: 4,
            name:'Option 4',
            selected: false
        },
    ]
})

const showModal: Ref<boolean> = ref(false)
const modal: Ref<any> = ref({})
const modalInfo: Ref<productModal> = ref ({
  title: 'Confirm action',
  description: '',
  price: 1000,
  rating: '5',
  confirmationButton: 'OK',
  cancelButton: 'Cancel',
})

const cardProduct = ref(null)
onClickOutside(cardProduct, (ev) => {
    modal.value.dismiss()
})

const cardImage = computed(() => {
  return ''
})


const show = async (props: productModal) => {
  asignProps(props)
  showModal.value = true
  const promise =  new Promise ((resolve, reject) => {
    modal.value.close = () => {
      showModal.value = false
      let response : promiseResponse = {
        success: true,
        value: select
      }
      resolve(response)
      resetValues()
    }
    modal.value.dismiss = () => {
      showModal.value = false
      let response : promiseResponse = {
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
    description: '',
    price: 1000,
    rating: '5',
    confirmationButton: 'OK',
    cancelButton: 'Cancel'
  }
}

const asignProps = async (props: productModal) => {
    props.title ? 
        modalInfo.value.title = props.title : null
    props.description ? 
        modalInfo.value.description = props.description : null
    props.price ? 
        modalInfo.value.price = props.price : null
    props.rating ? 
        modalInfo.value.rating = props.rating : null
    props.confirmationButton ? 
        modalInfo.value.confirmationButton = props.confirmationButton : null
    props.cancelButton ? 
        modalInfo.value.cancelButton = props.cancelButton : null
}


defineExpose( {
  show
})

</script>

<style>

.forward-all{
  z-index: 9999;
}
</style>