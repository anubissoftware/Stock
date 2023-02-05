import { useAuthStore } from '@/stores/auth';
import axios, {AxiosError, type AxiosInstance, type AxiosResponse, type AxiosRequestConfig} from 'axios';
import { modalComp } from '@/classes/Modal';
import { backendURL } from '@/config';
import router from '@/router/index';
import { loaderApp } from '@/composables/loaderFunction'

const host = window.location.hostname == 'stock.gdlplabs.com' ? 'http://stockapi.gdlplabs.com/' : backendURL

const ApiCLient: AxiosInstance = axios.create({
    baseURL:`${host}`,
})
const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    loaderApp.value.show = true
    return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error(`[request error] [${JSON.stringify(error)}]`);
    if(error.response?.status == 401){
        useAuthStore().logOut()
        router.push('/login')

    }
    if(error.response?.status == 500){
        const res: {message: string} = error.response?.data as {message: string}
        modalComp.modal.show({
            title: 'Atención',
            description: res.message ?? 'Algo salio mal',
            input: false,
            inputValue: '',
        })
    }
    return Promise.reject(error)
}
ApiCLient.interceptors.request.use(onRequest, onRequestError)

ApiCLient.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
    loaderApp.value.show = false
    return response
}, onRequestError)



 export {ApiCLient}