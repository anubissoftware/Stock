import type { token } from '@/schemas';
import { ApiCLient } from '@/services/index';
import { useAuthStore } from '@/stores/auth';

export const formatSerial = (id: number): string => {
    return id?.toString(16).toUpperCase() ?? ''
}

export const convertSerial = (id: string): number => {
    return !Number.isNaN(parseInt(id, 16)) && !parseInt(id, 16) ? parseInt(id, 16) : 0
}

export const listInvoices = (params: any, signal: any) => {
    const user = useAuthStore()
    const token = (user.getUser.token as token).value
    return ApiCLient.get('/invoicing', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params: {...params},
        signal
    })
}

export const saveQuotation = (token: string, body: any) => {
    return ApiCLient.post('/quotation', { ...body }, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

export const listQuotations = (token: string, filter: any, signal: any) => {
    return ApiCLient.get('/quotation', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params: { ...filter },
        signal
    })
}

export const listAllQuotation = (id: string) => {
    return ApiCLient.get('/quotation/all', {
        params: { id },
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
export const clientRejectQuotation = (body: {id: string, enterpriseId: string}) => {
    return ApiCLient.post('/quotation/client/reject', {...body})
}

export const clientApproveQuotation = (body: {id: string, enterpriseId: string}) => {
    return ApiCLient.post('/quotation/client/approve', {...body})
}

export const getQuotationForClient = (body: {id: string}) => {
    return ApiCLient.get('/quotation/document', {
        params: {...body}
    })
}

export const getDispatch = (token: string, filter: any, signal: any) => {
    return ApiCLient.get('/dispatch', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params: { ...filter },
        signal
    })
}

export const getDispatchDetail = (token: string, body: {id: number}) => {
    return ApiCLient.get('/dispatch/detail', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params: { id: body.id }
    })
}

export const createDispatch = (token: string, body:any) => {
    return ApiCLient.post('/dispatch', { ...body }, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}

export const updateDispatch = (token: string, body:any) => {
    return ApiCLient.post('/dispatch/update', { ...body }, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}

export const getReturn = (token: string, filter: any, signal: any) => {
    return ApiCLient.get('/return', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params: { ...filter },
        signal
    })
}

export const getReturnDetail = (token: string, body: {id: number}) => {
    return ApiCLient.get('/return/detail', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params: { id: body.id }
    })
}

export const createReturn = (token: string, body:any) => {
    return ApiCLient.post('/return', { ...body }, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}

export const updateReturn = (token: string, body:any) => {
    return ApiCLient.post('/return/update', { ...body }, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}

