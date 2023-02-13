<template>
  <router-view />
  <ModalSync ref="modal" />
  <ModalProduct ref="modalProduct" />
  <Loader :show="LoaderContent.show" />

  <Alert v-show="alertMessageContent.show" @close="alertMessageContent.show = false" :title="alertMessageContent.title"
    :description="alertMessageContent.description" :type="alertMessageContent.type" />
</template>
<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted, ref, watch, } from 'vue';
import { ModalSync } from '@/components/Generics/generics'
import { ModalProduct } from '@/components/Store/componentsStore'
import { modalComp, modalProductSync } from '@/classes/Modal'
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client'
import Alert from './components/Generics/Alert.vue';
import Loader from './components/Generics/Loader.vue';
import type { notificationSchema, modulesSchema, token, productToSell } from '@/schemas'
import { backendURL } from '@/config'
import socket from '@/composables/socket'
import { alertMessageApp } from '@/composables/alertFunction'
import { loaderApp } from '@/composables/loaderFunction'
import { useAuthStore } from './stores/auth'
import { useProductStore } from './stores/products';
import type { rentProductType } from '@/stores/products'
import { alertMessageContent } from './composables/alert';

const showMessage = ref(false)
const LoaderContent = ref({
  show: false
})

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const pdto = useProductStore()
//Define async Modal
const modal = ref()
//Define product Modal
const modalProduct = ref()
onBeforeMount(async () => {
  //Validate session
  let user = JSON.parse(localStorage.getItem('user') || '{}')
  let modules: Array<modulesSchema> = JSON.parse(localStorage.getItem('modules') || '{}')
  let colors: Array<any> = JSON.parse(localStorage.getItem('colors') || '[]')
  Object.keys(user).length !== 0 ? auth.setUser(user) : null
  modules.length > 0 ? auth.setModules(modules) : null
  auth.setColors(colors)
})

const user = computed(() => {
  return auth.getUser
})

interface realTimeNotification extends notificationSchema {
  ok: boolean
}

const notificationAlert = (notification: realTimeNotification) => {
  alertMessageContent.value = {
    title: notification.title ?? '',
    description: notification.description ?? '',
    type: notification.ok ? 'success' : 'error',
    show: true
  }
  setTimeout(() => {
    alertMessageContent.value.show = false
  }, 1500);
}

const doTheThing = () => {
  if (pdto.listProducts?.length == 0) {
    pdto.getProducts({ userToken: (auth.getUser.token as token).value, filter: '' })
  }
  if (pdto.listHistoric?.length == 0) {
    pdto.getHistoric({ token: (auth.getUser.token as token).value, filtros: '' })
  }

  if (!socket.socket) {
    socket.socket = io(backendURL)

    socket.socket.emit('joinEnterprise', {
      id: auth.getUser.id,
      enterprise_id: auth.getUser.enterprise_id
    })

    socket.socket.on('colorsUpdated', (body: string) => {
      auth.setColors(JSON.parse(body))
    })

    socket.socket.on('notification', (body: any) => {
      auth.pushNotification(body)
      console.log('push')
      notificationAlert(body)
    })
    socket.socket.on('userConnected', (tos: any) => {
      if (tos.nickname == user.value.nickname) {
        pdto.unsetProducts()
        auth.logOut()
        router.push({
          path: '/login'
        })
      }
    })
    socket.socket.on('productRemoved', (id: number) => {
      pdto.removeProduct(id)
    })
    socket.socket.on('productCreated', (pdtoEv: any) => {
      const cat = JSON.stringify({values: pdtoEv.categories})
      pdtoEv.categories = cat
      pdtoEv.currency = 'COP'
      pdtoEv.isRecipe = pdtoEv.isRecipe ? 1 : 0
      console.log('pdtoCreated', pdtoEv)
      pdto.addProduct(pdtoEv)
    })
    socket.socket.on('productUpdated', (updated: any) => {
      console.log('updated', updated)
      pdto.updateProduct(updated)
    })
    socket.socket.on('productSold', (body: { products: [{ id: number, amount: number }], wholesale: boolean }) => {
      console.log('sold')
      pdto.soldProduct(body)
    })
    socket.socket.on('productRented', (body: rentProductType) => {
      console.log('renting', body)
      pdto.rentProduct(body)
    })
    socket.socket.on('productBought', (body: any) => {
      pdto.boughtProducts(body)
    })
    socket.socket.on('productExpired', (body: any) => {
      pdto.expiredProduct(body)
    })
    socket.socket.on('productDispatched', (body: productToSell[]) => {
      const conversion = {
        products: body.map(pdto => {
          return {
            item_id: pdto.id,
            amnt: pdto.amount
          }
        })
      }
      pdto.rentProduct(conversion)
    })
    socket.socket.on('productReturned', (body: productToSell[]) => {
      const conversion = {
        products: body.map(pdto => {
          return {
            item_id: pdto.id,
            amnt: pdto.amount
          }
        })
      }
      console.log('returned', conversion)
      pdto.returnProduct(conversion)
    })
    socket.socket.on('productCrafted', (body: any) => {
      pdto.craftedProduct(body)
    })
    socket.socket.on('notification', (body: realTimeNotification) => {
      
    })
    socket.socket.on('categoryCreated', (body: any) => {
      pdto.addCategories(body)
    })
    socket.socket.on('categoryUpdated', (body: any) => {
      pdto.editCategory(body)
    })
    socket.socket.on('categoryDelete', (body: any) => {
      pdto.deleteCategory(body.id)
    })
  }
  if (pdto.listCategories.length == 0) {
    pdto.loadCategories({ token: (auth.getUser.token as token).value, filtros: '' })
  }
}

watch(
  () => route.name,
  () => {
    const path = route.path
    let isIn = false
    const routes = ['/dashboard']
    routes.forEach((route) => {
      if (path.includes(route)) {
        isIn = true
      }
    })
    if (isIn) {
      doTheThing()
      // console.log(path)
      // alertMessage('Correcto', 'Sesión iniciada', 'success')
    }
  },
  { deep: true }
)

onMounted(async () => {
  modalComp.modal = modal.value
  modalProductSync.modal = modalProduct.value
  alertMessageApp.value = alertMessageContent
  loaderApp.value = LoaderContent.value

})

const alertMessage = (title: string, description: string, type: string) => {
  alertMessageContent.value = {
    title,
    description,
    type
  }
  showMessage.value = true
  setTimeout(() => {
    showMessage.value = false
  }, 2500);
}

onUnmounted(() => {
  socket.socket?.disconnect()
})

</script>

<style>
#app {
  font-family: Montserrat;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}


/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #3D256A transparent;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: #3D256A;
  border-radius: 11px;
  border: 0px solid transparent;
}
</style>
