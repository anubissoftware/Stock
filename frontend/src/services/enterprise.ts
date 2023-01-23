import { ApiCLient } from '@/services/index';


export const uploadEnterpriseImage =  (token: string, b64: string) => {
    return ApiCLient.post('logo', {b64}, {
       headers: {
           'authorization': `bearer ${token}`
       }
    })
}