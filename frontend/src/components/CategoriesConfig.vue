<template>
  <div class="flex flex-col pb-5">
    <span class=" font-bold text-xl self-start pl-10">{{ strings.list[language] }}</span>
    <div class=" flex flex-wrap">
      <CategoryTag @edit="assignTag"
        class=" screen:w-1/6 desktop:w-1/5 laptop:w-1/4 tablet:w-1/2 phone:w-full px-1 pt-2"
        v-for="(category, index) in categories" :key="index" :category="category" />
      <div class=" screen:w-1/6 desktop:w-1/5 laptop:w-1/4 tablet:w-1/2 phone:w-full px-1 pt-2"
      @click="editing = true">
        <div
          class="flex justify-center bg-secondary rounded-md py-2 italic font-bold whitespace-nowrap overflow-x-hidden cursor-pointer select-none"
          :style="{'color': 'white' }">
          <Icon icon="add"/>
          <span class="">
            Add category
          </span>
        </div>
      </div>
    </div>
    <span class=" font-bold text-xl pb-5 self-start pl-10 pt-8" v-if="editing && editable.id > 0">
      {{ strings.editing[language] }}
    </span>
    <span class=" font-bold text-xl pb-5 self-start pl-10 pt-8" v-if="editing && editable.id === 0">
      {{ strings.creating[language] }}
    </span>
    <div class="flex flex-col py-2 tablet:px-5 gap-5" v-if="editing">
      <Input label="name" v-model="editable.name" :required="true" />
      <Input label="color" v-model="editable.color" :required="true" :typeColor="true" />
      <div class="flex flex-row flex-wrap phone:w-full tablet:w-auto gap-3 self-end">
        <Button @click="cancel()" class="phone:w-full tablet:w-auto" exactColor icon="close"
          :content="strings.cancel[language]" color="third" />
        <Button @click="save()" class="phone:w-full tablet:w-auto" exactColor icon="save"
          :content="strings.save[language]" color="primary" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import language from '@/services/language';
import { createCategory, updateCategory } from '@/services/product';
import { computed, ref, type Ref } from 'vue';
import CategoryTag from './categoryTag.vue';
import { Input, Button, Icon } from './Generics/generics';
import type { categoryQuery, token, categorySchema } from '@/schemas';
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/products'

const userStore = useAuthStore()
const pdtoStore = useProductStore()

const categories = computed(() => {
  return pdtoStore.listCategories
})
const user = computed(() => {
  return userStore.getUser
})

const editing: Ref<boolean> = ref(false)
const editable: Ref<categoryQuery> = ref({
  name: '',
  id: 0,
  color: ''
})

const assignTag = (cat: categoryQuery) => {
  const copy: categoryQuery = JSON.parse(JSON.stringify(cat))
  editing.value = true
  editable.value.name = copy.name
  editable.value.id = copy.id
  editable.value.color = copy.color

}

const save = async () => {
  const token = userStore.getUser.token as token
  if (editable.value.color.length !== 7) return
  if (editable.value.id === 0) {
    await createCategory(token.value, editable.value as categorySchema)
  } else {
    await updateCategory(token.value, editable.value as categorySchema)
  }
  cancel()
}

const cancel = () => {
  editing.value = false
  editable.value = {
    name: '',
    id: 0,
    color: ''
  }
}

const strings = {
  list: {
    Spanish: 'Lista de categorías:',
    English: 'Category list:'
  },
  editing: {
    Spanish: 'Editando categoría ...',
    English: 'Editing category ...'
  },
  creating: {
    Spanish: 'Creando categoría ...',
    English: 'Creating category ...'
  },
  save: {
    Spanish: 'Guardar categoría',
    English: 'Save category'
  },
  cancel: {
    Spanish: 'Cancelar',
    English: 'Cancel'
  }
}

</script>

<style scoped>

</style>