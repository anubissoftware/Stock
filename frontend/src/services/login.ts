import { ApiCLient } from '@/services/index'
import type { customerValidate } from '@/schemas' 

interface login {
    nickname: string,
    password: string
}

const LoginApi =  (params: login) => {
     return ApiCLient.post('user/login', params)
}

const ValidateEmail =  (params: any) => {
    return ApiCLient.post('login/validEmail', params)
}

const ValidateCellphone =  (params: any) => {
    return ApiCLient.post('login/validCellphone', params)
}

const RegisterNewUser =  (params: any) => {
    return ApiCLient.post('login/registerUser', params)
}

const ActivateCustomer =  (params: customerValidate) => {
    return ApiCLient.post('login/activateCustomer', params)
}

export {
    LoginApi,
    ValidateEmail,
    ValidateCellphone, 
    RegisterNewUser,
    ActivateCustomer
}