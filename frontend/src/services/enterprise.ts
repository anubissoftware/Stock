import { ApiCLient } from '@/services/index';


export const uploadEnterpriseImage =  (token: string, b64: string) => {
    return ApiCLient.post('logo', {b64}, {
       headers: {
           'authorization': `bearer ${token}`
       }
    })
}

export const ChangeEnterpriseColors = (token: string, body:any) => {
    return ApiCLient.post('enterpriseColor', { ...body }, {
        headers: {
            'authorization': `bearer ${token}`
        },
    })
}
