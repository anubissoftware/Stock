import { createNewDispatch, createNewReturn, dispatchDetail, dispatchUpdate, editQuotation, getAllQuotation, listDispatch, listInvoices, listReturn, quotationDetail, returnDetail, returnUpdate, sendQuotationEmail, updateQuotationStage } from './../controllers/accountingController';
import { addClient, clientProductReading, deleteClient, deleteProject, editClient, getProjects, importClients, readClients, saveProject } from './../controllers/clientController';
import { loginCustomer, setTokenCustomer } from '../controllers/customerController';
import { activateCustomer, menusInRol } from './../controllers/loginController';
import { saveEnterpriseLogo } from './../controllers/mediaController';
import { validateEmail, validateCellphone, registerUser } from '../controllers/loginController';
import { sellItems, buyItems, craftItems, expireItems, listPublishedProducts, listHistoric,listAllProducts, registerProduct, removeProduct, updateProduct, dispatchItem, returnItem, returnItemAux } from '../controllers/productController';
import { getUnits } from '../controllers/unitController';
import { categoryQuery, productToEmit, decreaseStock, modulesSchema, clientEnterpriseSchema, projectSchema, quotationSchema,  userData, UserLogin, userLogOut, dispatchScheme, returnScheme } from '@/schemas';
import { deleteCategory, getCategories, saveCategory, updateCategory } from '../controllers/categoryController';
import { Express, NextFunction, Request, Response } from "express"
import { Server } from "socket.io"

import { DataBase, initDatabase } from "../classes/db";
import { login, setToken, syncUserWithGoogle, unSetToken, validateToken, googleLogin, changePassword } from "../controllers/userController"
import moment from 'moment'
import { OkPacket } from "mysql";
import { changeBrandColors, validateEnterprise } from '../controllers/enterpriseController';
import { createNewQuotation, deleteQuotation, listQuotations, generateQuotationDocument } from '../controllers/accountingController';

declare global {
    namespace Express {
        interface Request {
            userData: userData
        }
    }
}



const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorization: string = req.headers.authorization;
    if (!authorization) {
        if((req.hostname == 'anubisapps.com' || req.hostname == 'localhost') && req.body.enterprise_id ) {
            next()
            return
        } else {
            console.log('no auth', req.hostname)
            res.status(401)
            res.end()
            return
        }
    }
    const token: string = authorization.split(' ')[1]
    const db: DataBase = await initDatabase(res)
    const validT: boolean | string = await validateToken(token, db)
    db.closeConnection()
    if (validT) {
        req.userData = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
        req.userData.socketId = validT.toString()
        next()
    } else {
        console.log('no valid')
        res.status(401)
        res.end()
    }
}


export default (app: Express, io: Server): void => {
    /**
     * Api to login an user, it validates the user credentials and updates the user token.
     * @return UserData
     */
    app.post('/user/login', async (req: Request, res: Response) => {
        const userLogin: UserLogin = req.body as UserLogin
        const db: DataBase = await initDatabase(res)
        const response: Array<userData> = await login(userLogin, db)
        if (response.length == 0) {
            //Case customer Login
            const response2: Array<any> = await loginCustomer(userLogin, db)
            if (response2.length == 0 ) {
                db.closeConnection()
                res.status(204)
                res.end()
                return
            } else if (response2[0].activated == 0){
                db.closeConnection()
                res.status(400).json({
                    message: 'Usuario no activado',
                    code: 105
                });
                res.end()
                return
            } else {
                const customerData = response2[0]
                customerData.exp = moment().unix() + 60 * 60;
                customerData.token = ''
                const token: string = Buffer.from(JSON.stringify(customerData), 'utf-8').toString('base64')
                const customerId: string = customerData.id.toString();
                const settoken: OkPacket = await setTokenCustomer(customerId, token, db);
                db.closeConnection()
                if (settoken.changedRows > 0) {
                    res.json({
                        token: token,
                        user: customerData
                    })
                    res.end()
                    io.to('e' + customerData.email).emit('userConnected', { id: customerData.id, nickname: customerData.email })
                } else {
                    res.status(500)
                    res.end()
                }
                return
            }
        }
        const userResponse: userData = response[0];
        userResponse.exp = moment().unix() + 60 * 60;
        const token: string = Buffer.from(JSON.stringify(userResponse), 'utf-8').toString('base64')
        const userId: string = response[0].id.toString();
        const settoken: OkPacket = await setToken(userId, token, db);
        const menus: Array<modulesSchema> = await menusInRol(req, userResponse.rol, userResponse, db)
        db.closeConnection()
        if (settoken.changedRows > 0) {
            res.json({
                token: token,
                user: userResponse,
                menus: menus
            })
            res.end()
            io.to('e' + userResponse.enterprise_id).emit('userConnected', { id: userResponse.id, nickname: userResponse.nickname })
        } else {
            res.status(500)
            res.end()
        }
    })

    app.post('/user/loginGoogle', async (req: Request, res: Response) => {
        const data: Array<string> = await googleLogin(req, res, io)
    })
    app.post('/user/syncWithGoogle', async (req: Request, res: Response) => {
        const data: Array<string> = await syncUserWithGoogle(req, res)
    })

    app.post('/user/changePassword', async (req: Request, res: Response) => {
        const data: Array<string> = await changePassword(req, res)
    })

    app.post('/user/logout/', middleware, async (req: Request, res: Response) => {
        const user: userLogOut = req.body
        const db: DataBase = await initDatabase(res)
        const unsetToken: OkPacket = await unSetToken(req.userData.id.toString(), db)
        db.closeConnection()
        if (unsetToken.affectedRows > 0) {
            res.status(200);
        } else {
            res.status(204);
        }
        res.end()
    })

    app.post('/enterprise/:shortcut', async (req: Request, res: Response) => {
        const response: Array<{ id: number }> = await validateEnterprise(req, res);
        if (response.length == 0) {
            res.status(404)
            res.end()
            return
        }
        await listPublishedProducts(req, res, response[0].id)
    })
    app.post('/enterpriseColor', middleware, async (req: Request, res: Response) => {
        const data: Array<string> = await changeBrandColors(req, res)

        if(data){
            io.to('e' +  req.userData.enterprise_id).emit('colorsUpdated', data)
        }
    })

    /**
     * Categories
     */
    app.post('/categories/', middleware, async (req: Request, res: Response) => {
        const categoryCreated: categoryQuery | object = await saveCategory(req, res)
        if (categoryCreated) {
            io.to('e' + req.userData.enterprise_id).emit('categoryCreated', categoryCreated)
        }
    })

    app.post('/categories/update', middleware, async (req: Request, res: Response) => {
        const response: categoryQuery | object = await updateCategory(req, res)
        if (response) {
            io.to('e' + req.userData.enterprise_id).emit('categoryUpdated', req.body)
        }
    })

    app.post('/categories/delete', middleware, async (req: Request, res: Response) => {
        const response: number = await deleteCategory(req, res)
        if(response){
            io.to('e' + req.userData.enterprise_id).emit('categoryDelete', {id: response})
        }
    })

    app.get('/categories/', middleware, async (req: Request, res: Response) => {
        await getCategories(req, res)
    })

    /**
     * Unit
     */
    app.get('/units/', middleware, async (req: Request, res: Response) => {
        getUnits(req, res)
    })

    /**
     * Api to register products, it has to emit an event to update the frontend
     */
    app.post('/product/', middleware, async (req: Request, res: Response) => {
        const registered: productToEmit | object = await registerProduct(req, res);
        if (registered) {
            io.to('e' + req.userData.enterprise_id).emit('productCreated', registered)
        }
    })

    /**
     * Api to edit the product values, it has to emit an event to update the frontend, using the id
     */
    app.post('/product/update', middleware, async (req: Request, res: Response) => {
        const updated = await updateProduct(req, res);
        if (updated) {
            io.to('e' + req.userData.enterprise_id).emit('productUpdated', updated)
        }
    })

    app.post('/product/remove', middleware, async (req: Request, res: Response) => {
        const removed: boolean = await removeProduct(req, res);

        if (removed) {
            io.to('e' + req.userData.enterprise_id).emit('productRemoved', req.body.id)
        }
    })

    app.post('/product/sell', middleware, async (req: Request, res: Response) => {
        const updated: boolean = await sellItems(req, res)

        if (updated) {
            io.to('e' + req.userData.enterprise_id).emit('productSold', { products: req.body.products, wholesale: req.header('wholesale') ? true : false })
        }
    })

    app.post('/product/buy', middleware, async (req: Request, res: Response) => {
        const updated: boolean = await buyItems(req, res)

        if (updated) {
            io.to('e' + req.userData.enterprise_id).emit('productBought', req.body)
        }
    })

    app.post('/product/craft', middleware, async (req: Request, res: Response) => {
        const updated: Array<decreaseStock> = await craftItems(req, res)

        if (updated) {
            io.to('e' + req.userData.enterprise_id).emit('productCrafted', {dec: updated, inc: req.body})
        }
    })

    app.post('/product/expire', middleware, async (req: Request, res: Response) => {
        const updated: boolean = await expireItems(req, res)

        if (updated) {
            io.to('e' + req.userData.enterprise_id).emit('productExpired', req.body)
        }
    })

    app.post('/product/dispatch', middleware, async (req: Request, res: Response) => {
        const updated: boolean = await dispatchItem(req, res)

        if(updated){
            io.to('e' + req.userData.enterprise_id).emit('productDispatched', req.body.products)
        }
    })

    app.post('/product/return', middleware, async (req: Request, res: Response) => {
        const updated: boolean = await returnItem(req, res)

        if(updated){
            io.to('e' + req.userData.enterprise_id).emit('productReturned', req.body.products)
        }
    })

    app.post('/product/return/aux', middleware, async (req: Request, res: Response) => {
        const updated: boolean = await returnItemAux(req, res)

        if(updated){
            io.to('e' + req.userData.enterprise_id).emit('productReturned', req.body.products)
        }
    })

    /**
     * Api to get all the products availables in the company
     */
    app.get('/product', middleware, listAllProducts)

    app.get('/historic/sells', middleware, listHistoric)

    app.post('/notification', async (req: Request, res: Response) => {
        const db: DataBase = await initDatabase(res)
        const query: string = `SELECT socketId FROM users WHERE id = ${req.body.to}`
        const response: Array<{socketId: string}> = await db.readQuery(query, [])
        console.log(response[0].socketId)
        io.to(response[0].socketId).emit('notification', req.body)
        res.end()
    })

    app.post('/logo', middleware, async (req: Request, res: Response) => {
        const response: boolean = await saveEnterpriseLogo(req, res)
        io.to('e' + req.userData.enterprise_id).emit('logoUpdated')
    })

    /**
     * LOGIN APIS
     */
     app.post('/login/validEmail', async (req: Request, res: Response) => {
        const response: Array<{ id: number }> =  await validateEmail(req, res);
    })
    app.post('/login/validCellphone', async (req: Request, res: Response) => {
        const response: Array<{ id: number }> =  await validateCellphone(req, res);
    })
    app.post('/login/registerUser', async (req: Request, res: Response) => {
        await registerUser(req, res)
    })
    app.post('/login/activateCustomer', async (req: Request, res: Response) => {
        await activateCustomer(req, res)
    })

    app.get('/clients/', middleware, readClients)

    app.post('/clients/', middleware, async (req: Request, res: Response) => {
        const data: clientEnterpriseSchema = await addClient(req, res)

        if(data?.id){
            io.to('e' + req.userData.enterprise_id).emit('clientCreated', data)
        }
    })
    
    app.post('/clients/delete', middleware,async (req: Request, res: Response) => {
        const data: {id: number} = await deleteClient(req, res)
        
        if(data?.id){
            io.to('e' + req.userData.enterprise_id).emit('clientDeleted', data)
        }
    })

    app.post('/clients/update', middleware, async (req: Request, res: Response) => {
        const data: clientEnterpriseSchema = await editClient(req, res)

        if(data?.id){
            io.to('e' + req.userData.enterprise_id).emit('clientCreated', data)
        }
    })

    app.get('/clients/projects', middleware, getProjects)

    app.post('/clients/import', middleware, async (req: Request, res: Response) => {
        const data: any = await importClients(req, res)
        for(const user of data) {
            io.to('e' + user.enterprise_id).emit('userConnected', {nickname: user.nickname })
        }
    })

    app.post('/clients/projects', middleware, async (req: Request, res: Response) => {
        const data: projectSchema = await saveProject(req, res)

        if(data?.id){
            io.to('e' + req.userData.enterprise_id) .emit('projectsChange-' + data.client_id, data)
        }
    })

    app.post('/clients/projects/delete', middleware, async (req: Request, res: Response) => {
        const data: {id: number, client_id: number} = await deleteProject(req, res)

        if(data?.id){
            io.to('e' + req.userData.enterprise_id).emit('projectsChange-' + data.client_id, data)
        }
    })

    app.get('/clients/products/renting', middleware, clientProductReading)

    app.post('/quotation/', middleware, async (req: Request, res: Response) => {
        let data: quotationSchema | any;
        if(req.body.id){
            data = await editQuotation(req, res)
        }else{
            data = await createNewQuotation(req, res)
            
        }
        //create ws
        if(data?.id){
            io.to('e' + req.userData.enterprise_id).emit('quotationChange', data)
        }
    })

    app.post('/quotation/delete', middleware, async (req: Request, res: Response) => {
        const data: {id: number} = await deleteQuotation(req, res)

        if(data.id){
            io.to('e'+ req.userData.enterprise_id).emit('quotationChange', data)
        }
    })

    app.post('/quotation/reject', middleware, async (req: Request, res: Response) => {
        const payload: quotationSchema = req.body
        const stage: number = 1
        const reject = await updateQuotationStage(payload.id, stage, res, req)

        if(reject){
            io.to('e'+ req.userData.enterprise_id).emit('quotationChange', {stage, id: payload.id})
            io.to(Buffer.from(payload.id.toString()).toString('base64')).emit('quotationStage', {stage})
        }
    })

    app.post('/quotation/approve', middleware, async (req: Request, res: Response) => {
        const payload: quotationSchema = req.body
        const stage: number = 2
        const approved = await updateQuotationStage(payload.id, stage, res, req)

        if(approved){
            io.to('e'+ req.userData.enterprise_id).emit('quotationChange', {stage, id: payload.id})
            io.to(Buffer.from(payload.id.toString()).toString('base64')).emit('quotationStage', {stage})
        }
    })

    app.post('/quotation/client/reject', async (req: Request, res: Response) => {
        const payload: any = req.body
        const stage: number = 1
        const reject = await updateQuotationStage(payload.id, stage, res, req)

        if(reject){
            res.json({
                ok: true
            })
            io.to('e'+ payload.enterpriseId).emit('quotationChange', {stage, id: payload.id})
            io.to(Buffer.from(payload.id.toString()).toString('base64')).emit('quotationStage', {stage})
        }
    })

    app.post('/quotation/client/approve', async (req: Request, res: Response) => {
        const payload: any = req.body
        const stage: number = 2
        const approved = await updateQuotationStage(payload.id, stage, res, req)

        if(approved){
            res.json({
                ok: true
            })
            io.to('e'+ payload.enterpriseId).emit('quotationChange', {stage, id: payload.id})
            io.to(Buffer.from(payload.id.toString()).toString('base64')).emit('quotationStage', {stage})
        }
    })

    app.get('/quotation/', middleware, listQuotations)

    app.get('/quotation/detail', quotationDetail)

    app.get('/quotation/all', getAllQuotation)

    app.post('/quotation/resend', middleware, async (req: Request, res: Response) => {
        sendQuotationEmail(req.body.quotation_id, req, res, io)
    })

    app.get('/email', (req: Request, res: Response) => {
        sendQuotationEmail(57, req, res)
    })


    app.get('/quotation/document', generateQuotationDocument)

    //Dispatch
    app.post('/dispatch/', middleware, async (req: Request, res: Response) => {
        const data: dispatchScheme = await createNewDispatch(req, res, io)
        //create ws
        if(data?.id){
            io.to('e' + req.userData.enterprise_id).emit('dispatchCreate', data)
        }
    })

    app.get('/dispatch/', middleware, listDispatch)
    app.get('/dispatch/detail', middleware, dispatchDetail)
    app.post('/dispatch/update', middleware, async (req: Request, res: Response) => {
        const data: Array<string> = await dispatchUpdate(req, res, io)
        //create ws
        if(data){
            io.to('e' + req.userData.enterprise_id).emit('dispatchUpdate', data)
        }
    })

    //Return
    app.post('/return/', middleware, async (req: Request, res: Response) => {
        const data: returnScheme = await createNewReturn(req, res, io)
        //create ws
        if(data?.id){
            io.to('e' + req.userData.enterprise_id).emit('returnCreate', data)
        }
    })
    app.get('/return/', middleware, listReturn)
    app.get('/return/detail', middleware, returnDetail)
    app.post('/return/update', middleware, async (req: Request, res: Response) => {
        const data: Array<string> = await returnUpdate(req, res)
        //create ws
        if(data){
            io.to('e' + req.userData.enterprise_id).emit('returnUpdate', data)
        }
    })

    app.get('/invoicing/', middleware, listInvoices)
}