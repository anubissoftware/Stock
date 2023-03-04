import socket from "@/composables/socket";
import type { quotationTermsOnQuote, quotationTermsSchema } from "@/schemas";
import type { Ref } from "vue";

export const subscribe = (terms: Ref<quotationTermsSchema[] | quotationTermsOnQuote[]>, addChecked: boolean) => {
    socket.socket?.on('quotationTerms', (body: quotationTermsSchema[] | quotationTermsOnQuote[]) => {
        if(Object.keys(body).length == 1){
            // DELETE
        }else{
            let updated: number[] = []
            terms.value = terms.value.map(term => {
                const found = body.find((bod: quotationTermsSchema) => bod.id == term.id)
                if(found){
                    term = {...term,...found,}
                    updated.push(parseInt(found.id.toString()))
                }
                return term
            })
            if(!updated) {
                terms.value
            }
            for(const bod of body){
                if(!updated.includes(parseInt(bod.id.toString()))){
                    if(addChecked){
                        (bod as quotationTermsOnQuote).checked = false
                    }
                    terms.value.push(bod)
                }
            }
        }

        terms.value.sort((a, b) => a.place - b.place)
    })
}

export const unsubscribe = () => {
    socket.socket?.removeListener("quotationTerms")
}
