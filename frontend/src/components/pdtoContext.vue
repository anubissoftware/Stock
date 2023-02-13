
<template>
    <div class="right-click-menu flex flex-col rounded-xl select-none" ref="contextMenu"
        :style="{ top: place.x, left: place.y }">
        <div @click="buyItem()" v-if="editPer">
            Comprar
        </div>
        <div @click="sellItem()" v-if="product?.price != 0 && editPer && auth.getUser.selling">
            Vender
        </div>
        <div @click="wholeSale()" v-if="product?.wholesale != 0 && editPer && auth.getUser.selling">
            Al por Mayor
        </div>
        <div @click="dispatchItem()" v-if="(product?.rent != 0 && product?.rent != null) && editPer && auth.getUser.renting">
            Remisión
        </div>
        <div @click="returnItem()" v-if="(product?.rent != 0 && product?.rent != null) && editPer && auth.getUser.renting">
            Devolución
        </div>
        <div v-if="product?.isRecipe == '1' && editPer" @click="crafting()">
            Preparar
        </div>
        <div @click="deprecating()" v-if="editPer">
            Vencidos
        </div>
        <div @click="remove()" v-if="editPer && writePer">
            Eliminar producto
        </div>
        <div v-if="(product?.price != 0 || product?.rent) && editPer" @click="emit('edit', product), emit('close')">
            Editar producto
        </div>
        <div v-if="(product?.price != 0 || product?.rent) && editPer && auth.getUser.cart" @click="addToCart()">
            Añadir al carrito
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, type Ref, computed, defineEmits, defineProps } from 'vue';
import { modalComp, type promiseResponse } from '@/classes/Modal';
import { deprecateProduct, sellProduct, buyProduct, wholesaleProduct, deleteItemService, craftProduct, dispatchProduct, returnProduct } from '@/services/product';
import { useShoppingCart } from '@/composables/ShoppingCart';
import { writePer, editPer } from '@/composables/permissions';
import { useAuthStore } from '@/stores/auth'
import AddItem from '@/components/NewItem.vue'
import type { token } from '@/schemas';
import Modal from './Generics/Modal.vue';

export interface contextProps {
    top: number,
    left: number,
    product: any
}

const emit = defineEmits(['close', 'edit', 'dispatch', 'return', 'closeWithData'])
const props = defineProps<contextProps>()
const auth = useAuthStore()

const shopping = useShoppingCart()
const token = computed((): string => {
    return (useAuthStore().getUser.token as token).value
})
const place = computed(() => {
    let largestHeight;
    let largestWidth;
    let t = props.top;
    let l = props.left;
    if (contextMenu.value) {
        let widthScreen = 0
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // true for mobile device
            widthScreen = screen.width
        } else {
            // false for not mobile device
            widthScreen = window.innerWidth
        }
        largestHeight = window.innerHeight - contextMenu.value.offsetHeight - 25;
        largestWidth = widthScreen - contextMenu.value.offsetWidth - 25;
        t = props.top;
        l = props.left;
        if (props.top > largestHeight) {
            t = largestHeight;
        }
        if (props.left > largestWidth) {
            l = largestWidth;
        }
        t = t + window.scrollY;
    }
    return {
        y: l + "px",
        x: t + "px"
    };
});
const contextMenu: Ref<any> = ref();
const sellItem = () => {
    modalComp.modal.show({
        title: 'Selling',
        description: '',
        input: true,
        inputValue: '',
        inputInfo: {
            label: 'amount'
        }
    }).then(async (res: promiseResponse) => {
        if (res.success) {
            let { status } = await sellProduct(token.value, [{ id: props.product.id, amount: parseInt(res.value), description: '' }])
        }
    })
};

const dispatchItem = () => {
    emit('dispatch')
    emit('closeWithData')
};

const returnItem = () => {
    emit('return')
    emit('closeWithData')
}

const buyItem = () => {
    modalComp.modal.show({
        title: 'Buying',
        description: '',
        input: true,
        inputValue: '',
        inputInfo: {
            label: 'amount'
        }
    }).then(async (res: promiseResponse) => {
        if (res.success) {
            let { status } = await buyProduct(token.value, props.product.id, parseInt(res.value))
        }
    })
}
const deprecating = () => {
    modalComp.modal.show({
        title: 'Deprecation',
        description: '',
        input: true,
        inputValue: '',
        inputInfo: {
            label: 'amount'
        }
    }).then(async (res: promiseResponse) => {
        if (res.success) {
            let { status } = await deprecateProduct(token.value, props.product.id, parseInt(res.value))
        }
    })
}
const crafting = () => {
    modalComp.modal.show({
        title: 'Crafting',
        description: '',
        input: true,
        inputValue: '',
        inputInfo: {
            label: 'amount'
        }
    }).then(async (res: promiseResponse) => {
        if (res.success) {
            let { status } = await craftProduct(token.value, props.product.id, parseInt(res.value))
        }
    })
}
const wholeSale = () => {
    modalComp.modal.show({
        title: 'Wholesale',
        description: '',
        input: true,
        inputValue: '',
        inputInfo: {
            label: 'amount'
        }
    }).then(async (res: promiseResponse) => {
        if (res.success) {
            let { status } = await wholesaleProduct(token.value, props.product.id, parseInt(res.value))
        }
    })
}
const remove = () => {
    modalComp.modal.show({
        title: 'Remove product',
        description: 'Do you want to remove this product?',
        input: false,
        inputValue: '',
        inputInfo: {
            label: 'amount'
        }
    }).then(async (res: promiseResponse) => {
        if (res.success) {
            let { status } = await deleteItemService(token.value, props.product.id)
        }
    })
}
const addToCart = () => {
    if (props.product.stock == 0) {
        emit('close')
        return
    }
    shopping.addProduct({
        id: props.product.id,
        name: props.product.name,
        amount: 1,
        value: props.product.price,
        renting: props.product.rent
    })
    emit('close')
}
</script>

<style scoped>
.right-click-menu {
    background: #FAFAFA;
    border: 1px solid #BDBDBD;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    width: 200px;
    z-index: 998;
}

.right-click-menu>div {
    margin: 3px 0px;
    transition: 0.3s;
    padding: 5px 2px;
}

.right-click-menu>div:hover {
    background-color: rgb(156, 163, 175);
    transition: 0.3s;
    font-weight: 600;
}
</style>