<template>
  <div
    class="fixed top-0 left-0 right-0 bottom-0 bg-[#0000004d] flex justify-center items-center animate__backOutDown max-h-[100vh] z-10">
    <div
      class="bg-white  max-h-[98vh] flex items-center flex-col phone:py-3 tablet:py-3 phone:w-[500px] laptop:w-[900px] rounded-2xl phone:m-4">
      <div class="overflow-auto phone:px-5 tablet:px-5 max-h-[100%] w-full">
        <header
          class="flex items-center text-left justify-between relative border-b py-3 tablet:text-3xl phone:text-xl w-full"
          id="modalTitle">
          <slot name="header">
            <!-- HEADER -->
          </slot>
          <Icon class="cursor-pointer h-fit hover:bg-primary hover:text-white p-2 rounded-full" @click="close"
            icon="clear" />
        </header>

        <section class="w-full flex flex-col items-start justify-center py-8 " id="modalDescription">
          <slot name="body">
            <!-- BODY -->
          </slot>
        </section>

        <footer class="w-full flex flex-row py-5 border-t">
          <slot name="actions">
            <!-- ACTIONS -->
          </slot>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import { Icon } from '@/components/Generics/generics'

export interface ModalProps {
  width?: number,
  heigh?: number,
}

const emit = defineEmits<{ (e: 'close'): void }>()
const props = defineProps<ModalProps>();

const close = () => {
  emit('close')
}
</script>


<style scoped>
/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #8f54a0 transparent;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 5px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: #8f54a0;
  border-radius: 11px;
  border: 0px solid transparent;
}
</style>