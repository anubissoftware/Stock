import { ApiCLient } from '@/services/index';
import type { clientEnterpriseSchema, projectSchema, token } from '@/schemas';
import { useAuthStore } from '@/stores/auth';


export const getClients =  (token: string, filter: any, signal: any) => {
    return ApiCLient.get('clients', {
       headers: {
           'authorization': `bearer ${token}`
       },
       params: {
        ...filter
       },
       signal
    })
}

export const getClientsTags =  () => {
    const auth = useAuthStore()
    const token = (auth.getUser.token as token).value
    return ApiCLient.get('clients/tags', {
       headers: {
           'authorization': `bearer ${token}`
       },
    })
} 

export const getClientsContacts =  (body: any) => {
    const auth = useAuthStore()
    const token = (auth.getUser.token as token).value
    return ApiCLient.get('clients/contacts', {
       headers: {
           'authorization': `bearer ${token}`
       },
       params: {
        ...body
       }
    })
}

export const addClients = (token: string, body: clientEnterpriseSchema) => {
    return ApiCLient.post('clients', {...body}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

export const clientProducts = (token: string, body: any, signal: any) => {
    return ApiCLient.get('clients/products/renting', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params: {
            ...body
        },
        signal
    })
}

export const importClients = (token: string, body: any) => {
    return ApiCLient.post('clients/import', {...body}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}
export const editClient = (token: string, body: clientEnterpriseSchema) => {
    return ApiCLient.post('/clients/update', {...body}, {
        headers: {
            'authorization': `bearer ${token}`
        }
    })
}

export const removeClient = (token: string, body: {id: number}) => {
    return ApiCLient.post('/clients/delete', {...body}, {
        headers:
        {
            'authorization': `bearer ${token}`
        }
    })
}

export const listAllProjects = (token: string, body: any, signal: any) => {
    return ApiCLient.get('/clients/projects', {
        headers: {
            'authorization': `bearer ${token}`
        },
        params: {...body},
        signal
    })
}

export const saveProject = (token: string, body: projectSchema) => {
    return ApiCLient.post('/clients/projects', {...body}, {
        headers: {
            'authorization': `header ${token}`
        }
    })
} 

export const removeProject = (token: string, body: {id: number, client_id: number}) => {
    return ApiCLient.post('/clients/projects/delete', {...body}, {
        headers: {
            'authorization': `header ${token}`
        }
    })
}
