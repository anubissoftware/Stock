import { ApiCLient } from '@/services/index';

export const formatSerial = (id: number) => {
    return id?.toString(36).toUpperCase()
}

export const saveQuotation = (token: string, body: any) => {
    return ApiCLient.post('/quotation', { ...body }, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

export const listQuotations = (token: string, filter: string, signal: any) => {
    return ApiCLient.get('/quotation', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params: { filter },
        signal
    })
}

export const quotationDetail = (body: any) => {
    return ApiCLient.get('/quotation/detail', {
        params: { id: body.id }
    })
}

export const removeQuotation = (token:string, body: {id: number}) => {
    return ApiCLient.post('/quotation/delete', {...body}, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}

export const resendQuotation = (token:string, body: {quotation_id: number}) => {
    return ApiCLient.post('/quotation/resend', {...body}, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}

export const rejectQuotation = (token: string, body: {id: number}) => {
    return ApiCLient.post('/quotation/reject', {...body}, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}

export const approveQuotation = (token: string, body: {id: number}) => {
    return ApiCLient.post('/quotation/approve', {...body}, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}
