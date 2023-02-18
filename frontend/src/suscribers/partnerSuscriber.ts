import socket from "@/composables/socket";
import type { partnerSchema } from "@/schemas";
import type { Ref } from "vue";

export const subscribe = (partners: Ref<partnerSchema[]>) => {
    socket.socket?.on('partnerCreate', (body: any) => {
        const newPartner = { ...body.partner }
        newPartner.id = body.id
        console.log(newPartner)
        partners.value.unshift(newPartner)
    })
    socket.socket?.on('partnerUpdate', (body: partnerSchema | any) => {
        console.log(body)
        if (body.remove === '1') {
            partners.value.splice(partners.value.findIndex(partner => partner.id == body.id), 1)
        }
    })
}

export const unsubscribe = () => {
    socket.socket?.removeListener("partnerCreate")
    socket.socket?.removeListener("partnerUpdate")
}
