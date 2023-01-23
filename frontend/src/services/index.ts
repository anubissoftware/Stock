import { useAuthStore } from '@/stores/auth';
import axios, {AxiosError, type AxiosInstance, type AxiosResponse} from 'axios';
import { modalComp } from '@/classes/Modal';
import { backendURL } from '@/config';
import router from '@/router/index';

const host = window.location.hostname == 'stock.gdlplabs.com' ? 'http://stockapi.gdlplabs.com/' : backendURL

const ApiCLient: AxiosInstance = axios.create({
    baseURL:`${host}`,
})
ApiCLient.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
    
    return response
}, (error: AxiosError): AxiosError => {
    if(error.response?.status == 401){
        useAuthStore().logOut()
        router.push('/login')

    }
    if(error.response?.status == 500){
        const res: {message: string} = error.response?.data as {message: string}
        modalComp.modal.show({
            title: 'Error',
            description: res.message,
            input: false,
            inputValue: '',
        })
    }
    return error
})



 export {ApiCLient}