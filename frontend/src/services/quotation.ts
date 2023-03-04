import type { token, quotationTermsSchema } from '@/schemas'
import { ApiCLient } from '@/services/index'
import { useAuthStore } from '@/stores/auth'

export const listQuotationTerms =  () => {
    const token = (useAuthStore().getUser.token as token).value
    return ApiCLient.get('quotation/terms', {
       headers: {
           'authorization': `bearer ${token}`
       }
    })
}

export const saveQuotationTerms = (body: quotationTermsSchema[]) => {
    const token = (useAuthStore().getUser.token as token).value
    return ApiCLient.post('quotation/terms', {terms: [...body]}, {
       headers: {
           'authorization': `bearer ${token}`
       }
    })
}
