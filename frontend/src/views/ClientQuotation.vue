<template>
    <div class="flex flex-col">
        <div class="flex phone:flex-col tablet:flex-row w-full h-auto bg-white items-center justify-start px-5 py-2 border-b border-b-primary">
            <img class="tablet:h-12 phone:h-16 cursor-pointer" :src="getImageUrl('ourStock.svg')" alt="Logo" />
            <div class="px-5 text-xl text-primary font-bold">
                Anubis Software
            </div>
        </div>
        <div class="flex w-full px-5 py-5">
            <span class="text-justify">
                Hola, "Nombre del cliente", la empresa "Nombre de la empresa" le ha envíado una cotización.
                Esta cotización puede ser <strong>aprobada</strong> o <strong>rechazada</strong>
                con los botones de acción que encontrará abajo. En esta página también podrá hacer 
                seguimiento a los demás documentos que emita la empresa, como <strong>remisiones</strong>,
                <strong>devoluciones</strong> y <strong>facturas</strong>.
                
                <span v-if="false">Adicionalmente, puede escribir comentarios o dejar
                    una insignia.</span>
            </span>
        </div>
        <div class="flex flex-wrap w-full px-5">
            <div class="phone:w-full tablet:w-1/2 laptop:w-1/3 flex flex-col ">
                <div class="py-2 flex flex-wrap" v-if="quotation.stage == 0 && false">
                    <Tag class="phone:w-full tablet:w-1/2" title="Buen servicio" v-model="insignia.precios" />
                    <Tag class="phone:w-full tablet:w-1/2" title="Buena atención" v-model="insignia.atencion" />
                </div>
                <div class="flex justify-around w-full py-2">
                    <Button :class="quotation.stage == 1 ? 'bg-third text-white' : '' " :disabled="quotation.stage == 2" exactColor color="third" icon="close" :content="quotation.stage == 1 ? 'Rechazada' : 'Rechazar' " @click="rejectingQuotation" />
                    <Button :class="quotation.stage == 2 ? 'bg-secondary text-white' : '' " :disabled="quotation.stage == 1" exactColor color="secondary" icon="done" :content="quotation.stage == 2 ? 'Aprobada' : 'Aprobar' " @click="approvingQuotation" />
                </div>
            </div>
            <div class="phone:w-full tablet:w-1/2 laptop:w-2/3 flex py-3">
                Aquí iría un PDF de cotización, si tan solo tuviera uno
            </div>
        </div>
        <iframe ref="docViewer"></iframe>
    </div>
</template>


<script lang="ts" setup>
import { ref, onMounted, type Ref } from 'vue';
import { Button } from '@/components/Generics/generics';
import Tag from '@/components/Generics/Tag.vue';
import { useRouter } from 'vue-router';
import { modalComp, type modalResponse } from '@/classes/Modal';
import {clientRejectQuotation, clientApproveQuotation, getQuotationForClient} from '@/services/accounting'
import { io } from 'socket.io-client';
import socket from '@/composables/socket';
import { backendURL } from '@/config';

document.title = 'Cotizador - Anubis Software S.A.S.'

const insignia = ref({
    precios: false,
    atencion: false
})

const quotation = ref({
    stage: 0
})

const router = useRouter()
const quotationId: Ref<string | undefined> = ref()
const enterpriseId: Ref<string | undefined> = ref()

const getImageUrl = (name: string) => {
    return new URL(`../assets/local/${name}`, import.meta.url).href
}

const docViewer: Ref<HTMLIFrameElement | undefined> = ref()

const rejectingQuotation = () => {
    if(quotation.value.stage > 0) return
    modalComp.modal.show({
        title: 'Rechazar cotización',
        description: '¿Deseas marcar esta cotización como <strong>rechazada</strong>?',
        inputValue: ''
    }).then((r: modalResponse) => {
        if (r.success) {
            clientRejectQuotation({ id: quotationId.value ?? '', enterpriseId: enterpriseId.value ?? '' })
            quotation.value.stage = 1
        }
    })
}

const approvingQuotation = () => {
    if(quotation.value.stage > 0) return
    modalComp.modal.show({
        title: 'Aprobar cotización',
        description: '¿Deseas marcar esta cotización como <strong>aprobada</strong>?',
        inputValue: ''
    }).then((r: modalResponse) => {
        if (r.success) {
            clientApproveQuotation({ id: quotationId.value ?? '', enterpriseId: enterpriseId.value ?? '' })
            quotation.value.stage = 2
        }
    })
}

onMounted(async () => {
    quotationId.value = atob(router.currentRoute.value.query.v?.toString() ?? '')
    const ent = await getQuotationForClient({id: quotationId.value})
    enterpriseId.value = ent.data.enterprise.id
    quotation.value = ent.data.quotation

    socket.socket = io(backendURL)

    socket.socket.emit('joinQuotation', {hash: router.currentRoute.value.query.v?.toString() ?? ''})
    socket.socket.on('quotationStage', ({stage}) => {
        quotation.value.stage = stage
    })
})

</script>
