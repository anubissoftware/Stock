import type { token } from "@/schemas"
import { useAuthStore } from "@/stores/auth"
import { ApiCLient } from "."


export const getUsers =  (filter: any, signal?: any) => {
    const auth = useAuthStore().getUser.token as token
    return ApiCLient.get('user', {
       headers: {
           'authorization': `bearer ${auth.value}`
       },
       params: {
        ...filter
       },
       signal
    })
}