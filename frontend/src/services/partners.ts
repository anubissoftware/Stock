import { ApiCLient } from '@/services/index';

export const getPartners = (token: string, filter: any, signal: any) => {
    return ApiCLient.get('/partners', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params: { ...filter },
        signal
    })
}

export const createPartners = (token: string, body:any) => {
    return ApiCLient.post('/partners', { ...body }, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}

export const updatePartners = (token: string, body:any) => {
    return ApiCLient.post('/partners/update', { ...body }, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}