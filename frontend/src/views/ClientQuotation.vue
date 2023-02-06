<template>
    <div class="flex flex-col">

        <div class="flex w-full py-2">
        </div>
        <div class="flex flex-wrap w-full px-5">
            <div class="phone:w-full tablet:w-1/2 laptop:w-1/3 flex flex-col px-4">
                <div class="flex phone:flex-col tablet:flex-row w-full h-auto bg-white items-center justify-start px-5 py-2 border-b border-b-primary">
                    <img class="tablet:h-12 phone:h-16 cursor-pointer" :src="getImageUrl('ourStock.svg')" alt="Logo" />
                    <div class="px-5 text-xl text-primary font-bold">
                        Anubis Software
                    </div>
                </div>
                <div class="py-2 flex flex-wrap" v-if="quotation.stage == 0 && false">
                    <Tag class="phone:w-full tablet:w-1/2" title="Buen servicio" v-model="insignia.precios" />
                    <Tag class="phone:w-full tablet:w-1/2" title="Buena atención" v-model="insignia.atencion" />
                </div>
                <div class="flex justify-around w-full py-2">
                    <Button :class="quotation.stage == 1 ? 'bg-third text-white' : '' " :disabled="quotation.stage > 2" exactColor color="third" icon="close" :content="quotation.stage == 1 ? 'Cotización Rechazada' : 'Rechazar' " @click="rejectingQuotation" />
                    <Button :class="quotation.stage > 2 ? 'bg-secondary text-white' : '' " :disabled="quotation.stage == 1" exactColor color="secondary" icon="done" :content="quotation.stage > 2 ? 'Cotización Aprobada' : 'Aprobar' " @click="approvingQuotation" />
                </div> 
                <div class="flex flex-col w-full">
                    <span class="w-full text-left py-3">Documentos registrados y disponibles para visualizar: </span>
                    <Button :class="docActive == 1 ? 'bg-secondary text-white' : '' " exactColor color="secondary" icon="request_quote" content="Cotización" />
                </div>
            </div>
            <div class="phone:w-full tablet:w-1/2 laptop:w-2/3 flex py-3">
                <iframe ref="docViewer" class="w-full min-h-[90vh]" src=""></iframe>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { ref, onMounted, type Ref } from 'vue';
import { Button } from '@/components/Generics/generics';
import Tag from '@/components/Generics/Tag.vue';
import { useRouter, type Router } from 'vue-router';
import { modalComp, type modalResponse } from '@/classes/Modal';
import {clientRejectQuotation, clientApproveQuotation, getQuotationForClient} from '@/services/accounting'
import { io } from 'socket.io-client';
import socket from '@/composables/socket';
import { backendURL, quotationURL } from '@/config';
import type { documentType } from '@/schemas'

document.title = 'Cotizador - Anubis Software S.A.S.'

const insignia = ref({
    precios: false,
    atencion: false
})

const quotation = ref({
    stage: 0
})

const router: Router = useRouter()
const quotationId: Ref<string | undefined> = ref()
const enterpriseId: Ref<string | undefined> = ref()

const getImageUrl = (name: string) => {
    return new URL(`../assets/local/${name}`, import.meta.url).href
}

const docViewer: Ref<HTMLIFrameElement | undefined> = ref()
const docActive: Ref<number> = ref(1)

const handleDocuments = (type: documentType, id: number):void => {
    
} 

const rejectingQuotation = (): void => {
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
    if(docViewer.value) {
        console.log(quotationId.value)
        docViewer.value.src = quotationURL + quotationId.value
    }
    
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
