<template>
    <div class="fixed top-0 left-0 right-0 bottom-0 bg-[#00000087] flex justify-center items-center animate__backOutDown">
      <div 
          class="bg-white overflow-x-auto flex items-center flex-col px-10 py-6 w-[500px] rounded-2xl"
      >
        <header
          class="flex justify-between relative border-b py-1 text-2xl w-full"
          id="modalTitle"
        >
          <slot name="header">
            <!-- HEADER -->
          </slot>
          <Icon class="hover:cursor-pointer" :icon="'close'" @click="close()"></Icon>
        </header>
        <footer class="w-full flex flex-row py-5 border-t">
          <slot name="actions">
            <!-- ACTIONS -->
          </slot>
        </footer>
      </div>
    </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';
import { defineEmits} from 'vue';

const emit = defineEmits<{(e: 'close'): void}>()

const close = () => {
    emit('close')
}

</script>