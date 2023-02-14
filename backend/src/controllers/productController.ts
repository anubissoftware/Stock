import { productReturning, productReturnTransaction, productStock } from '@/schemas/productSchema';
import moment from 'moment';
import { recipeSchema, productToEmit, productSchema, productToSave, productToRemove, productToSell, recipeCrafting, productInMenu, productsToSell, decreaseStock, productBasicTransaction } from '@/schemas'
import { Request, Response } from "express";
import { OkPacket } from "mysql";
import { DataBase, initDatabase } from "../classes/db";

const saveCategories = (categories: Array<object>): string => {
    return JSON.stringify({ values: categories })
}

export const registerProduct = async (req: Request, res: Response): Promise<productToEmit | object> => {
    const pdto: productToSave = req.body
    const db: DataBase = await initDatabase(res);
    let idProduct: number;
    if (pdto.isRecipe && pdto.recipeDetail.length == 0) {
        res.status(210)
        res.json({ message: 'Not recipe detail error' })
        return {}
    }
    let error: boolean = false
    try {
        await db.connection.beginTransaction()
        const query: string = `INSERT INTO products (name, description, 
            unit, stock, cost, price, isRecipe, categories, enterprise, onBuying, wholesale, rent) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const values: Array<string> = [
            pdto.name, pdto.description, pdto.unit.toString(), pdto.stock.toString(),
            pdto.cost.toString(), pdto.price.toString(), pdto.isRecipe,
            saveCategories(pdto.categories), req.userData.enterprise_id.toString(),
            pdto.isRecipe ? '0' : (pdto.cost * pdto.stock).toString(),
            pdto.wholesale.toString(), pdto.rent.toString()
        ]
        const response: OkPacket = await db.insertQuery(query, values)
        if (response.affectedRows > 0 && response.insertId != 0) {
            idProduct = response.insertId
        } else {
            error = true
            throw new Error("Falló la creación del producto")
        }
        if (pdto.isRecipe) {
            console.log('recipe')
            await Promise.all(pdto.recipeDetail.map(async (ingred: recipeSchema) => {
                const inQuery: string = `INSERT INTO recipes (result, required, 
                    amount, extras) VALUES (?, ?, ?, ?)`
                ingred.result = response.insertId
                const inValues: Array<string> = [
                    ingred.result.toString(), ingred.required.toString(),
                    ingred.amount.toString(), ingred.extras.toString()
                ]
                const inResponse: OkPacket = await db.insertQuery(inQuery, inValues)
                if (inResponse.affectedRows > 0 && inResponse.insertId != 0) {
                } else {
                    error = true
                    throw new Error("Falló la creación de la receta")
                }
                if (pdto.updateIngre) {
                    const upQuery: string = `UPDATE products SET stock = stock - ?, toCraft = toCraft + ? WHERE id = ?`
                    console.log(ingred.unit == pdto.unit)
                    const upValues: Array<string> = [
                        ingred.unit == pdto.unit ? (ingred.amount * pdto.stock).toString() : ingred.amount.toString(),
                        ingred.unit == pdto.unit ? (ingred.amount * pdto.stock).toString() : ingred.amount.toString(),
                        ingred.required.toString()
                    ]
                    const upResponse: OkPacket = await db.updateQuery(upQuery, upValues)
                    if (upResponse.affectedRows > 0 && upResponse.changedRows != 0) {
                    } else {
                        error = true
                        throw new Error("Falló la actualización del Stock")
                    }
                } else {
                    // Guardar compra
                }
                return ingred
            }))
        } else {
            const payload: productToSell = {
                description: '',
                id: idProduct,
                amount: pdto.stock
            }
            const res = await bougthProcess(payload, req, db)
        }
        await db.connection.commit()
    } catch (error) {
        await db.connection.rollback()
        res.status(500)
        res.json({ message: "Algo no ha salido bien, revisa que haya cantidades suficientes para elaborar los productos" })
        console.log(moment().format('YYYYMMDD HH:mm:ss'), 'Transaction error', error)
        return {}
    }

    db.closeConnection()
    if (!error) {
        const saved: productToEmit = {
            id: idProduct,
            name: pdto.name,
            description: pdto.description,
            unit: pdto.unit,
            stock: pdto.stock,
            cost: pdto.cost,
            price: pdto.price,
            isRecipe: pdto.isRecipe,
            categories: pdto.categories,
            wholesale: pdto.wholesale,
            rent: pdto.rent
        }
        res.status(200)
        res.end()
        return saved
    } else {
        res.status(500)
        res.end()
        return {}
    }
}

export const updateProduct = async (req: Request, res: Response): Promise<object> => {
    const pdtBody = req.body
    //Remove properties
    delete pdtBody.showAction
    delete pdtBody.creation
    const keysBody = Object.keys(pdtBody)
    if (pdtBody && keysBody.length > 0 && pdtBody.id) {
        const db: DataBase = await initDatabase(res);
        const response: OkPacket = await db.updateQueryDynamic('products', pdtBody);
        if (response.affectedRows > 0) {
            res.status(200)
            res.end()
            return pdtBody
        } else {
            res.status(204)
            res.end()
            return null
        }
    }
    res.end()
    return null
}

export const removeProduct = async (req: Request, res: Response): Promise<boolean> => {
    const pdto: productToRemove = req.body;
    const db: DataBase = await initDatabase(res);
    const query: string = 'UPDATE products SET removed = 1 WHERE id = ?';
    const values: Array<string> = [pdto.id.toString()];
    const response: OkPacket = await db.insertQuery(query, values);
    db.closeConnection();
    if (response.affectedRows > 0) {
        res.status(200)
        res.end()
        return true
    } else {
        res.status(204)
        res.end()
        return false
    }
}

export const listAllProducts = async (req: Request, res: Response) => {
    const query: string = `SELECT * FROM products WHERE enterprise = ? and removed = 0`
    const values: Array<string> = [req.userData.enterprise_id.toString()]
    const db = await initDatabase(res)
    const pdtos: Array<productSchema> = await db.readQuery<productSchema>(query, values)
    db.closeConnection()
    res.json(pdtos)
    res.end()
}

export const listPublishedProducts = async (req: Request, res: Response, id: number): Promise<any> => {
    const query: string = "SELECT id, name, description, currency, price, enterprise FROM products WHERE enterprise = ? AND published = 1 and removed = 0"
    const values: Array<string> = [id.toString()]
    const db: DataBase = await initDatabase(res)
    const pdtos: Array<productInMenu> = await db.readQuery<productInMenu>(query, values)
    db.closeConnection()
    res.json(pdtos)
    res.end()
}

export const sellItems = async (req: Request, res: Response): Promise<boolean> => {
    const payload: productsToSell = req.body
    var wildcard: string = req.header('wholesale') == 'true' ? 'wholesale' : 'price'

    const db: DataBase = await initDatabase(res)
    let response: OkPacket;
    var details: Array<number> = []
    try {
        db.connection.beginTransaction()
        await Promise.all(payload.products.map(async (product: productToSell) => {
            const querySale: string = `INSERT INTO salesDetail (item, extras, amount, value) VALUES (?, ?, ?, 
                (SELECT ${wildcard} * ? FROM products WHERE id = ?))`
            const valuesSale: Array<string> = [
                product.id.toString(), product.description, product.amount.toString(), product.amount.toString(),
                product.id.toString()
            ]
            const res: OkPacket = await db.insertQuery(querySale, valuesSale)
            if (res.insertId) {
                details.push(res.insertId)
                const query: string = `UPDATE products SET stock = stock - ?, onSales = onSales + (${wildcard} * ?), sold = sold + ? WHERE id = ?`
                const values: Array<string> = [product.amount.toString(), product.amount.toString(), product.amount.toString(),
                product.id.toString()
                ]
                await db.updateQuery(query, values)

            } else {
                throw new Error('No inserted product')
            }
        }))
        const querySale: string = `INSERT INTO sales (description, value, client_name, registered_by, client_id, enterprise) 
        VALUES (?, (SELECT SUM(value) FROM salesDetail WHERE id IN (${details.join(', ')})),
        ?, ?, ?, ?
        )`
        const valuesSale: Array<string> = [
            payload.description, payload.clientName, req.userData.id.toString(), payload.clientId ?? undefined,
            req.userData.enterprise_id.toString()
        ]
        response = await db.insertQuery(querySale, valuesSale)
        const queryUpdate: string = `UPDATE salesDetail SET sales_id = ? WHERE id in (${details.join(', ')})`
        const valuesUpdate: Array<string> = [
            response.insertId.toString()
        ]
        await db.updateQuery(queryUpdate, valuesUpdate)
    } catch (error) {
        db.connection.rollback()
        console.log(error)
        res.status(500)
        res.json({ message: "Algo no ha salido bien, revisa que haya cantidades suficientes para vender." })
        return false
    }
    db.connection.commit()
    db.closeConnection()
    if (response.affectedRows > 0) {
        res.status(200)
        res.json({
            message: 'Content updated'
        })
        return true
    } else {
        res.status(204)
        res.end()
        return false
    }
}

export const buyItems = async (req: Request, res: Response): Promise<boolean> => {
    const payload: productToSell = req.body
    const query: string = `UPDATE products SET stock = stock + ?, onBuying = onBuying + (cost * ?) WHERE id = ?`
    const values: Array<string> = [
        payload.amount.toString(), payload.amount.toString(), payload.id.toString()
    ]
    const db: DataBase = await initDatabase(res)
    let response: OkPacket
    try {
        db.connection.beginTransaction()
        response = await db.updateQuery(query, values)
        const res = await bougthProcess(payload, req, db)
    } catch (err) {
        db.connection.rollback()
        res.status(500)
        res.json({
            message: 'No se pudo realizar la transacción'
        })
        return false
    }
    db.connection.commit()
    db.closeConnection()
    if (response.changedRows > 0) {
        res.status(200)
        res.json({
            message: 'Content updated'
        })
        return true
    } else {
        res.status(204)
        res.end()
        return false
    }
}

const bougthProcess = async (payload: productToSell, req: Request, db: DataBase) => {
    const queryHistory: string = `INSERT INTO boughts (description, value, registered_by, enterprise) VALUES 
            (?, ((SELECT cost FROM products WHERE id = ?) * ?), ?, ?)
        `
    const valuesHistory: Array<string> = [
        '', payload.id.toString(), payload.amount.toString(), req.userData.id.toString(), req.userData.enterprise_id.toString()
    ]
    let history: OkPacket = await db.insertQuery(queryHistory, valuesHistory)
    if (history.insertId) {
        const queryDetail: string = `INSERT INTO boughtsDetail (item, extras, amount, value, bought_id) VALUES 
                (?, ?, ?, ((SELECT cost FROM products WHERE id = ?) * ?), ?)
            `
        const valuesDetail: Array<string> = [
            payload.id.toString(), '', payload.amount.toString(), payload.id.toString(), payload.amount.toString(),
            history.insertId.toString()
        ]
        await db.insertQuery(queryDetail, valuesDetail)
    } else {
        throw new Error('No se puede guardar la transacción')
    }
}

export const craftItems = async (req: Request, res: Response): Promise<Array<decreaseStock>> => {
    const payload: productToSell = req.body
    const db: DataBase = await initDatabase(res)
    const recipeQuery: string = `SELECT required, amount, id FROM recipes WHERE result = ?`
    const recipeValues: Array<string> = [
        payload.id.toString()
    ]
    let deStock: Array<decreaseStock> = []
    const recipeResult: Array<recipeCrafting> = await db.readQuery<recipeCrafting>(recipeQuery, recipeValues)
    if (recipeResult.length == 0) {
        res.status(204)
        res.end()
        return []
    }
    try {
        await db.connection.beginTransaction()
        await Promise.all(recipeResult.map(async (recipe: recipeCrafting) => {
            const query: string = `UPDATE products SET stock = stock - ?, toCraft = toCraft + ? WHERE id = ?`
            deStock.push({ id: recipe.required, amount: (recipe.amount * payload.amount) })
            const values: Array<string> = [
                (recipe.amount * payload.amount).toString(),
                (recipe.amount * payload.amount).toString(),
                recipe.required.toString(),
            ]
            let result: OkPacket
            try {
                result = await db.updateQuery(query, values)
            } catch (error) {
                throw new Error("Falló la actualización del Stock")
            }
            if (result.affectedRows > 0 && result.changedRows != 0) {
            } else {
                throw new Error("Falló la actualización del Stock")
            }
        }))
        const query: string = `UPDATE products SET stock = stock + ? WHERE id = ?`
        const values: Array<string> = [
            payload.amount.toString(),
            payload.id.toString()
        ]
        const result: OkPacket = await db.updateQuery(query, values)
        if (result.affectedRows > 0 && result.changedRows != 0) {
        } else {
            throw new Error("Falló la actualización del Stock")
        }
        await db.connection.commit()
    } catch (error) {
        await db.connection.rollback()
        res.status(500)
        res.json({ message: "Algo no ha salido bien, revisa que haya cantidades suficientes para elaborar los productos." })
        console.log(moment().format('YYYYMMDD HH:mm:ss'), 'Transaction crafting error')
        return []
    }
    db.closeConnection()
    res.status(200)
    res.end()

    return deStock
}

export const expireItems = async (req: Request, res: Response): Promise<boolean> => {
    const payload: productToSell = req.body
    const query: string = `UPDATE products SET expired = expired + ?, stock = stock - ?, onLosses = (onLosses + (cost * ?)) WHERE id = ?`
    const values: Array<string> = [
        payload.amount.toString(),
        payload.amount.toString(),
        payload.amount.toString(),
        payload.id.toString()
    ]
    const db: DataBase = await initDatabase(res)
    let response: OkPacket;
    try {
        response = await db.updateQuery(query, values)
        const queryHistory: string = `INSERT INTO losses (description, value, registered_by, enterprise) VALUES 
            (?, ((SELECT cost FROM products WHERE id = ?) * ?), ?, ?)
        `
        const valuesHistory: Array<string> = [
            '', payload.id.toString(), payload.amount.toString(), req.userData.id.toString(), req.userData.enterprise_id.toString()
        ]
        let history: OkPacket = await db.insertQuery(queryHistory, valuesHistory)
        if (history.insertId) {
            const queryDetail: string = `INSERT INTO lossesDetail (item, extras, amount, value, losses_id) VALUES 
                (?, ?, ?, ((SELECT cost FROM products WHERE id = ?) * ?), ?)
            `
            const valuesDetail: Array<string> = [
                payload.id.toString(), '', payload.amount.toString(), payload.id.toString(), payload.amount.toString(),
                history.insertId.toString()
            ]
            await db.insertQuery(queryDetail, valuesDetail)
        }
    } catch (error) {
        res.status(500)
        res.json({ message: "Algo no ha salido bien, revisa que haya cantidades suficientes para elaborar los productos." })
        console.log(moment().format('YYYYMMDD HH:mm:ss'), 'Transaction expiring error', error)
        return false
    }
    db.closeConnection()
    if (response.changedRows > 0) {
        res.status(200)
        res.end()
        return true
    } else {
        res.status(204)
        res.end()
        return false
    }
}

export const dispatchItem = async (req: Request, res: Response) => {
    const query: productBasicTransaction = req.body
    let quote_total = 0
    let quote_id = 0
    let dispatching_id = 0
    let client_data = []
    const payload: productStock[] = query.products
    const queryQuotation: string = `INSERT INTO quotation (value, client_id, user, isRenting, one_day, stage, enterprise_id) 
    VALUES (0, ?, ?, 1, 1, 3, ?)`
    const queryPdto: string = `UPDATE products SET rented = rented + ?, stock = stock - ? WHERE id = ?`
    const queryDispatch: string = `
        INSERT INTO dispatching (out_store, received, created_by, quotation_id)
        VALUES (?, ?, ?, ?)
    `
    let queryDispatchDetail: string = ` 
        INSERT INTO dispatchingDetail (amount, dispatch_id, item_id, quotation_detail_id)
        VALUES (
    `
    const db: DataBase = await initDatabase(res)
    let response: OkPacket;
    try {
        db.connection.beginTransaction()
        let quote: OkPacket = await db.insertQuery(queryQuotation, [
            query.client_id.toString(), req.userData.id.toString(), req.userData.enterprise_id.toString()
        ])
        if (quote.insertId == 0) {
            throw new Error('Quotation not registered')
        }
        quote_id = quote.insertId

        let dispt: OkPacket = await db.insertQuery(queryDispatch, [
            moment().format('YYYY-MM-DDTHH:mm:ss'),
            moment().format('YYYY-MM-DDTHH:mm:ss'),
            req.userData.id.toString(),
            quote.insertId.toString()
        ])
        if (dispt.insertId != 0) {
            dispatching_id = dispt.insertId
            let total = 0
            for (const el of payload) {
                const dd: OkPacket = await db.updateQuery(queryPdto, [
                    el.amount.toString(),
                    el.amount.toString(),
                    el.id.toString()
                ])
                total += (el.amount * el.rent)
                const qd: OkPacket = await db.insertQuery(`INSERT INTO quotationDetail (
                    item_id, amount, value, quotation_id, dispatching
                ) VALUES (?, ?, ?, ?, ?)`, [
                    el.id.toString(), el.amount.toString(), el.rent.toString(), quote_id.toString(), el.amount.toString()
                ])
                if(qd.insertId == 0){
                    console.log('qd:', el)
                    throw new Error('Quotation detail not inserted')
                }
                if (dd.affectedRows == 0) {
                    throw new Error('Product not updated: ' + queryPdto)
                }
                const r = await db.upsert('clientProduct', {
                    amount: 'amount + ' + el.amount.toString()
                }, {
                    client_id: query.client_id.toString(),
                    product_id: el.id.toString()
                })

                if(!r) throw new Error('Table clientProduct not updated')
                client_data.push(r)
                const vals: Array<string> = [
                    el.amount.toString(),
                    dispt.insertId.toString(),
                    el.id.toString(),
                    qd.insertId.toString()
                ]
                queryDispatchDetail += vals.join(',') + '),'
            }
            quote_total = total
            queryDispatchDetail = queryDispatchDetail.slice(0, -1)

            const ddd: OkPacket = await db.insertQuery(queryDispatchDetail, [])
            if (ddd.affectedRows == 0) {
                throw new Error('Detail dispatch not inserted' + queryDispatchDetail.toString())
            }
        } else {
            throw new Error('Dispatch not inserted: ' + queryDispatch)
        }

    } catch (err) {
        console.error('err dispatching item -> ', err)
        db.connection.rollback()
        res.end()
        return false
    }
    await db.connection.commit()
    await db.insertQuery('UPDATE quotation SET `value` = ? WHERE id = ?', [
        quote_total.toString(), quote_id.toString()
    ])
    if(dispatching_id > 0){
        res.json({
            dispatching_id
        })
        // hay que añadir el actualizar la cotización, el dc y el clientData
    }else{
        res.end()
    }
    return true
}

export const returnItem = async (req: Request, res: Response) => {
    const query: productReturnTransaction = req.body
    let returning_id = 0
    let client_data = []
    const payload: productReturning[] = query.products
    const queryPdto: string = `UPDATE products SET rented = rented - ?, stock = stock + ? WHERE id = ?`
    const queryDispatch: string = 'INSERT INTO `returning` (return_date, created_by, quotation_id) VALUES (?, ?, ?)'
    let queryDispatchDetail: string = `
        INSERT INTO returningDetail (amount, return_id, item_id, quotation_detail_id)
        VALUES (
    `
    const db: DataBase = await initDatabase(res)
    let response: OkPacket;
    try {
        db.connection.beginTransaction()
        let dispt: OkPacket = await db.insertQuery(queryDispatch, [
            moment().format('YYYY-MM-DD HH:mm:ss'),
            req.userData.id.toString(),
            query.quotation_id.toString()
        ])
        if (dispt.insertId != 0) {
            returning_id = dispt.insertId
            for (const el of payload) {
                const dd: OkPacket = await db.updateQuery(queryPdto, [
                    el.amount.toString(),
                    el.amount.toString(),
                    el.id.toString()
                ])
                if (dd.affectedRows == 0) {
                    throw new Error('Product not updated: ' + queryPdto)
                }
                const updateQuotationDetail = await db.updateQuery("UPDATE quotationDetail SET `returning` = `returning` + ? WHERE item_id = ? AND quotation_id = ?", [
                    el.amount.toString(), el.id.toString(), query.quotation_id.toString()
                ])
                if(updateQuotationDetail.affectedRows == 0){
                    console.error(el)
                    throw new Error('Quotation detail not updated')
                }

                const r = await db.upsert('clientProduct', {
                    amount: 'amount - ' + el.amount.toString()
                }, {
                    client_id: query.client_id.toString(),
                    product_id: el.id.toString()
                })

                if(!r) throw new Error('Table clientProduct not updated')
                client_data.push(r)

                const vals: Array<string> = [
                    el.amount.toString(),
                    dispt.insertId.toString(),
                    el.id.toString(),
                    el.quotation_detail_id.toString()
                ]
                queryDispatchDetail += vals.join(',') + '),'
            }
            queryDispatchDetail = queryDispatchDetail.slice(0, -1)

            const ddd: OkPacket = await db.insertQuery(queryDispatchDetail, [])
            if (ddd.affectedRows == 0) {
                throw new Error('Detail returning not inserted' + queryDispatchDetail.toString())
            }

        } else {
            throw new Error('Returning not inserted: ' + queryDispatch)
        }

    } catch (err) {
        console.error('err returning item -> ', err)
        db.connection.rollback()
        res.end()
        return false
    }
    db.connection.commit()
    if(returning_id > 0){
        res.json({
            returning_id
        })
        // hay que añadir el actualizar la cotización, el dc y el clientData
    }else{
        res.end()
    }
    return true
}

type historicSells = {
    sells: number,
    boughts: number,
    losses: number,
    date: string
}

export const listHistoric = async (req: Request, res: Response) => {
    const db: DataBase = await initDatabase(res)
    const query: string = `SELECT historic.date, SUM(historic.sells) AS sells, SUM(historic.boughts) AS boughts, SUM(historic.losses) AS losses FROM 
    (SELECT SUM(VALUE) AS boughts, CAST(DATE AS DATE) AS DATE, 0 AS sells, 0 as losses FROM boughts
    WHERE CAST(DATE AS DATE) >= ? AND enterprise = ?
    GROUP BY CAST(DATE AS DATE)
    UNION
    SELECT 0 AS boughts, CAST(DATE AS DATE) AS DATE, SUM(VALUE) AS sells, 0 AS losses FROM sales 
    WHERE CAST(DATE AS DATE) >= ? AND enterprise = ?
    GROUP BY CAST(DATE AS DATE)
    UNION
    SELECT 0 AS boughts, CAST(DATE AS DATE) AS DATE, 0 AS sells, SUM(VALUE) AS losses FROM losses
    WHERE CAST(DATE AS DATE) >= ? AND enterprise = ?
    GROUP BY CAST(DATE AS DATE)
    ) historic
    GROUP BY DATE;


    `
    const values: Array<string> = [
        req.query.date.toString(), req.userData.enterprise_id.toString(),
        req.query.date.toString(), req.userData.enterprise_id.toString(),
        req.query.date.toString(), req.userData.enterprise_id.toString()
    ]
    const response: Array<historicSells> = await db.readQuery<historicSells>(query, values)
    if (response.length > 0) {
        res.json(response)
        res.end()
    } else {
        res.status(204)
        res.end()
    }
    return
}

