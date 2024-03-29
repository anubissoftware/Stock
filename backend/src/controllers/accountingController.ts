import { Request, Response } from "express";
import { OkPacket } from "mysql";
import { productsInCartType, quotationSchema, dispatchDetailSchema, dispatchScheme, returnScheme, returnDetailSchema, quotationDetailSchema } from "@/schemas";
import { DataBase, initDatabase } from "../classes/db";
import { sendEmail } from "./emailController";
import { join } from 'path'
import * as dotenv from 'dotenv'
import { env } from 'process'
import { Server } from "socket.io";
import moment from "moment";
import { invoicingSchema } from "@/schemas/InvoicingSchema";
dotenv.config({ path: join(__dirname, '../../', '.env') })


export const updateQuotationStage = async (id: number, stage: number, res: Response, req: Request): Promise<boolean> => {
    const query: string = `
        UPDATE quotation SET stage = ?, updated_by = ? WHERE id = ?
    `
    const values: Array<string> = [
        stage.toString(), req.userData?.id.toString() ?? null, id.toString()
    ]
    const db: DataBase = await initDatabase(res)
    const rps: OkPacket = await db.updateQuery(query, values)
    db.closeConnection()
    return rps.affectedRows > 0
}

export const quotationDetail = async (req: Request, res: Response) => {
    const payload = req.query
    if (!payload.all) {
        const query: string = `SELECT qd.*, p.name, p.weight FROM quotationDetail as qd
        INNER JOIN products AS p ON p.id = qd.item_id
        WHERE quotation_id = ?`
        const values: Array<string> = [
            payload.id.toString()
        ]
        const db: DataBase = await initDatabase(res)
        const rps: any = await db.readQuery(query, values)
        db.closeConnection()
        res.json(rps)
    } else {
        let listing: string = ``
        let query: string = `
        SELECT  * FROM
        (SELECT SUM(dd.amount) AS amount, dd.partner_id, p.name, p.id, d.created_at, 'd' AS tipo FROM dispatchingDetail AS dd
        INNER JOIN quotationDetail AS qd ON dd.quotation_detail_id = qd.id
        INNER JOIN quotation AS q ON q.id = qd.quotation_id
        INNER JOIN products AS p ON p.id = qd.item_id
        INNER JOIN dispatching AS d ON d.id = dd.dispatch_id
        WHERE q.id = ?
        GROUP BY p.id, dd.partner_id
        
        UNION
        
        SELECT SUM(dd.amount) AS amount, dd.partner_id, p.name, p.id, r.created_at, 'r' AS tipo FROM returningDetail AS dd
        INNER JOIN quotationDetail AS qd ON dd.quotation_detail_id = qd.id
        INNER JOIN quotation AS q ON q.id = qd.quotation_id
        INNER JOIN products AS p ON p.id = qd.item_id
        `
        query += 'INNER JOIN `returning` AS r ON r.id = dd.return_id'
        query += `WHERE q.id = ?
        GROUP BY p.id, dd.partner_id) 
        balance`

    }
}

export const getAllQuotation = async (req: Request, res: Response) => {
    const payload = req.query.id as string
    const id = Buffer.from(payload, 'base64').toString('ascii')
    const query: string = "SELECT q.`serial`, q.id, q.`description`, q.`value`, q.min_validity, q.max_validity, q.isRenting, q.one_day, q.stage, qd.id as detail_id, qd.item_id, qd.amount, qd.`value` as detail_value, qd.`from`, qd.`to`, qd.days,qd.`dispatching`, c.`name`, c.nit, pr.`name` as product_name, q.enterprise_id FROM quotation AS q LEFT JOIN quotationDetail AS qd ON qd.quotation_id = q.id INNER JOIN products AS pr ON pr.id = qd.item_id INNER JOIN clients AS c ON c.id = q.client_id LEFT JOIN projects AS p ON p.id = q.project_id WHERE q.id = ? "
    const values: Array<string> = [
        id
    ]
    const eQuery: string = `SELECT * FROM enterprise WHERE id = ?`
    const db: DataBase = await initDatabase(res)
    const result: any = await db.readQuery(query, values)
    const eValues: Array<string> = [
        result[0].enterprise_id ?? '0'
    ]
    const ent = await db.readQuery(eQuery, eValues)
    db.closeConnection()
    res.json({ quotation: result, enterprise: ent[0] })
    return
}

export const updateQuotation = async (req: Request, res: Response): Promise<quotationSchema | null> => {
    const payload: quotationSchema = req.body
    const query: string = "UPDATE quotation SET `value` = ?, project_id = ?, min_validity = ?, max_validity = ?, isRenting = ?, one_day = ?, `from` = ?, `to` = ? WHERE enterprise_id = ? AND id = ?"
    const values: Array<string> = [
        payload.value.toString(), payload.project_id.toString(), payload.min_validity,
        payload.max_validity, payload.isRenting ? '1' : '0', payload.one_day ? '1' : '0',
        payload.from, payload.to, req.userData.enterprise_id.toString(),
        payload.id.toString()
    ]
    return null
}

export const editQuotation = async (req: Request, res: Response): Promise<quotationSchema | null> => {
    const values: quotationSchema = req.body
    const query: string = "UPDATE quotation SET `value` = ?, weight = ?, conditions = ?, transport = ?, min_validity = ?, max_validity = ?, `from` = ?, `to` = ?, email = ?, updated_by = ?, discount = ?, taxing = ? WHERE enterprise_id = ? AND id = ?"
    const qvalues: Array<string> = [
        values.value.toString(), values.weight.toString(), values.conditions, values.transport?.toString(), values.min_validity, values.max_validity, values.from, values.to,
        values.email, req.userData.id.toString(), values.discount.toString(), values.taxing.toString(),
        req.userData.enterprise_id.toString(), values.id.toString()
    ]
    const db: DataBase = await initDatabase(res)
    let rsp: OkPacket
    try {
        db.connection.beginTransaction()
        rsp = await db.updateQuery(query, qvalues)
        if (rsp.affectedRows == 0) {
            console.error(rsp)
            throw new Error('No updated quotation: ' + values.id)
        }
        const pdtos: Array<productsInCartType> = req.body.products
        for (const pdto of pdtos) {
            if (pdto.detail_id) {
                const pdtoQuery: string = "UPDATE quotationDetail SET amount = ?, `value` = ?, `from` = ?, `to` = ?, days = ? WHERE id = ?"
                const pdtoValues: Array<string> = [
                    pdto.amount.toString(), values.isRenting ? pdto.renting.toString() : pdto.value.toString(), pdto.start_rent ? moment(pdto.start_rent).format('YYYY-MM-DD') : null,
                    pdto.end_rent ? moment(pdto.end_rent).format('YYYY-MM-DD') : null, pdto.days?.toString(), pdto.detail_id.toString()
                ]
                const rspto: OkPacket = await db.updateQuery(pdtoQuery, pdtoValues)
                if (rspto.affectedRows == 0) {
                    throw new Error('No updated detail quotation: ' + pdto.detail_id)
                }
            } else {
                const pdtoQuery: string = "INSERT INTO quotationDetail (item_id, amount, `value`, quotation_id, `from`, `to`, `days`) VALUES (?, ?, ?, ?, ?, ?, ?)"
                const pdtoValues: Array<string> = [
                    pdto.id.toString(), pdto.amount.toString(), values.isRenting ? pdto.renting.toString() : pdto.value.toString(),
                    values.id.toString(), pdto.start_rent ?? null, pdto.end_rent ?? null, pdto.days?.toString()
                ]
                const rspto: OkPacket = await db.insertQuery(pdtoQuery, pdtoValues)
                if (rspto.affectedRows == 0) {
                    throw new Error('No inserted detail quotation: ' + pdto)
                }
            }
        }
    } catch (err) {
        console.error(err)
        res.end()
        db.connection.rollback()
        return
    }
    db.connection.commit()
    db.closeConnection()

    if (rsp.affectedRows) {
        values.id = rsp.insertId
        res.json({
            ok: true
        })
        return values
    } else {
        res.status(204)
        res.end()
        return null
    }
    return
}


export const createNewQuotation = async (req: Request, res: Response): Promise<quotationSchema | null> => {
    const values: quotationSchema = req.body
    const getSerial: string = `SELECT q.serial + 1 as serial FROM quotation AS q WHERE q.enterprise_id = ? AND q.serial IS NOT NULL ORDER BY q.serial DESC LIMIT 1`
    const getSerialV: Array<string> = [
        req.userData.enterprise_id.toString()
    ]
    const queryQuotation: string = "INSERT INTO quotation (`value`, conditions, weight, transport, client_id, contact_id, project_id, min_validity, max_validity, isRenting, one_day, `from`, `to`, user, enterprise_id, `serial`, email, taxing, discount)       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "

    const db: DataBase = await initDatabase(res)
    db.connection.beginTransaction()
    const serial: Array<{ serial: number }> = await db.readQuery<{ serial: number }>(getSerial, getSerialV)
    const nextSerial: string = serial.length > 0 ? serial[0]?.serial?.toString() : '1'
    const valuesQuotation: Array<string> = [
        values.value.toString(), values.conditions, values.weight.toString(), values.transport?.toString(),
        values.client_id.toString(), values.contact_id.toString(), values.project_id?.toString(),
        values.min_validity, values.max_validity, values.isRenting ? '1' : '0',
        values.one_day && values.isRenting ? '1' : '0', values.from, values.to, req.userData.id.toString(),
        req.userData.enterprise_id.toString(), nextSerial, values.email, values.taxing.toString(),
        values.discount.toString()
    ]
    const resp: OkPacket = await db.insertQuery(queryQuotation, valuesQuotation)

    try {
        const pdtos: Array<productsInCartType> = req.body.products
        let query: string = "INSERT INTO quotationDetail (item_id, amount, `value`, quotation_id, `from`, `to`, `days`) VALUES "
        let value: Array<string> = []
        pdtos.forEach((pdto, index) => {
            query += "(?, ?, ?, ?, ?, ?, ?)"
            query += (pdtos.length - 1) == index ? ' ' : ', '
            value = [...value,
            pdto.id.toString(), pdto.amount.toString(), (values.isRenting ? (pdto.renting.toString()) : (pdto.value.toString())),
            resp.insertId.toString(), pdto.start_rent ?? null, pdto.end_rent ?? null, pdto.days.toString()
            ]
        })
        db.insertQuery(query, value)
    } catch (err) {
        console.error(err)
        db.connection.rollback()
        res.end()
        return null
    }
    db.connection.commit()
    db.closeConnection()

    if (resp.insertId) {
        values.id = resp.insertId
        values.serial = parseInt(nextSerial)
        values.stage = 0
        res.json({
            ok: true
        })
        return values
    } else {
        res.status(204)
        res.end()
        return null
    }
}

export const sendQuotationEmail = async (quotation_id: number, req: Request, res: Response, io?: Server) => {
    const db: DataBase = await initDatabase(res)
    const quotationInfo: Array<quotationSchema> = await db.readQuery<quotationSchema>(
        `SELECT q.serial, q.email, q.value, c.name as client_name, c.email, cc.email as contact_email, e.name as ent_name FROM quotation as q
        INNER JOIN clients as c ON c.id = q.client_id
        INNER JOIN enterprise as e ON e.id = c.enterprise
        LEFT JOIN clientsContact as cc ON cc.id = q.contact_id
        WHERE q.id = ?
        `, [
        quotation_id.toString()
    ]
    )
    db.closeConnection()
    if (quotationInfo.length > 0) {
        const message = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    </head>    
    <body style="display: flex; flex-direction: column;">
        
    <style>
        body {
            font-family: 'Montserrat', sans-serif;
        }
    
        .button {
            margin: 10px 0px;
            border-radius: 10px;
            text-decoration: none;
            color: black;
            border: 1px solid #F69A36;
            background: #F69A36;
            text: white;
            padding: 13px 7px;
            font-weight: bold;
            transition: 250ms;
            width: fit-content;
        }
    
        .button:hover {
            background-color: #F69A36;
            color: white;
        }
    </style>
    <h1>
            Tiene una cotización en espera de revisión:
        </h1>
        <p
            style="font-size: 20px;"
        >
            La empresa ${quotationInfo[0].ent_name} le ha enviado la cotización 
            <span style="font-style: italic;">
                ${quotationInfo[0].serial.toString(36).toUpperCase()}
            </span>
            para su revisión. El siguiente enlace lo llevará a la visualización
        </p>
        <a href="${env.FRONTEND_HOST}quotations?v=${Buffer.from(quotation_id.toString()).toString('base64')}" class="button">
            Visualizar cotización
        </a>
    
    </body>
    
    </html>
    `
        const subject = `Cotización ${quotationInfo[0].serial.toString(36).toUpperCase()}`
        const to = []
        if (quotationInfo[0].email) {
            to.push(quotationInfo[0].email)
        }
        if (quotationInfo[0].contact_email) {
            to.push(quotationInfo[0].contact_email)
        }
        sendEmail(
            [...to],
            subject,
            message
        ).then((r) => {
            io.to(req.userData.socketId).emit('notification', {
                description: `La cotización <strong>${quotationInfo[0].serial.toString(36).toUpperCase()}</strong> ha sido enviada con éxito.`,
                ok: true
            })
        })
    } else {
        io.to(req.userData.socketId).emit('notification', {
            description: `No se ha podido enviar la cotización.`,
            ok: false
        })
    }
    res.send(quotationInfo)
    return

}

export const deleteQuotation = async (req: Request, res: Response) => {
    const payload: quotationSchema = req.body
    const query: string = `UPDATE quotation SET deleted = 1 WHERE id = ?`
    const values: Array<string> = [
        payload.id.toString()
    ]
    const db: DataBase = await initDatabase(res)
    const resp: OkPacket = await db.updateQuery(query, values)
    db.closeConnection()
    if (resp.affectedRows > 0) {
        res.json({
            ok: true
        })
        return { id: payload.id }
    } else {
        res.end()
        return null
    }
}

export const listQuotations = async (req: Request, res: Response) => {
    const query = `SELECT q.*, c.name as client_name FROM quotation AS q
    INNER JOIN clients AS c ON q.client_id = c.id
    WHERE deleted = 0 and enterprise_id = ?
    ORDER BY q.creation DESC
    `
    const values = [
        req.userData.enterprise_id.toString()
    ]
    const db: DataBase = await initDatabase(res, req)
    const resp: Array<quotationSchema> = await db.readQuery<quotationSchema>(query, values)
    db.closeConnection()
    if (resp.length > 0) {
        res.json(resp)
    } else {
        res.end()
    }
    return
}

export const generateQuotationDocument = async (req: Request, res: Response) => {
    const payload: string = req.query.id.toString()

    const query: string = `SELECT e.*, q.serial, q.enterprise_id FROM quotation AS q INNER JOIN enterprise AS e ON e.id = q.enterprise_id WHERE q.id = ? `
    const values: Array<string> = [
        payload
    ]
    const db: DataBase = await initDatabase(res)

    const qQuery: string = `SELECT * FROM quotation AS q WHERE q.id = ?`

    const ent: Array<any> = await db.readQuery(query, values)
    const qValues: Array<string> = [
        payload
    ]
    const qot: any[] = await db.readQuery(qQuery, qValues)


    const dQuery: string = `SELECT * FROM dispatching as d
        WHERE d.quotation_id = ?
    `
    const dValues: string[] = [qot[0].id.toString()]
    const dispatchs = await db.readQuery(dQuery, dValues)

    db.closeConnection()
    res.json({
        enterprise: ent[0],
        quotation: qot[0],
        dispatchs
    })
}


//Dispatch 

export const createNewDispatch = async (req: Request, res: Response, io: Server): Promise<dispatchScheme | null> => {
    const values: dispatchScheme = req.body
    const queryDispatch: string = `INSERT INTO dispatching (out_store, received, quotation_id, 
        created_by, contact_received, user_sent, name_sent, plate) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?) `
    const db: DataBase = await initDatabase(res)
    // db.connection.beginTransaction()
    const valuesDispatch: Array<string> = [
        values.out_store, values.received,
        values.quotation_id.toString(), values.created_by.toString(),
        values.contact_received.toString(), values.user_sent.toString(), values.name_sent,
        values.plate
    ]
    const resp: OkPacket = await db.insertQuery(queryDispatch, valuesDispatch)
    const updatePdtos = []
    const updatePartners = []
    const updateClients = []
    console.log('resp', resp.insertId)
    try {
        const pdtos: Array<dispatchDetailSchema> = req.body.products
        let query: string = "INSERT INTO dispatchingDetail (quotation_detail_id, dispatch_id, amount, partner_id ) VALUES "
        let value: Array<string> = []
        for (const pdto of pdtos) {
            if (pdto.amount > 0) {
                query += "(?, ?, ?, ?),"
                value = [...value,
                pdto.quotation_detail_id.toString(),
                resp.insertId.toString(),
                pdto.amount.toString(),
                    null
                ]
            }
            let totalProducts = 0
            totalProducts += pdto.amount

            if (values.out_store) {
                updatePdtos.push({
                    qdi: pdto.quotation_detail_id,
                    amnt: pdto.amount
                })
            }

            if (pdto?.partners?.length > 0) {
                for (const pto of pdto.partners) {
                    query += "(?, ?, ?, ?),"
                    totalProducts += pto.amount
                    value = [...value,
                    pdto.quotation_detail_id.toString(),
                    resp.insertId.toString(),
                    pto.amount.toString(),
                    pto.partner_id.toString()
                    ]
                    if (pto.partner_id) {
                        const pp = await db.upsert('partnerProduct', {
                            amount: 'amount + ' + pto.amount.toString()
                        }, {
                            partner_id: pto.partner_id.toString(),
                            product_id: pdto.item_id.toString()
                        })

                        if (!pp) {
                            console.error('pdto', pto)
                            throw new Error('No updated partner product')
                        }

                        updatePartners.push({
                            amount: pto.amount,
                            partner_id: pto.partner_id,
                            product_id: pdto.item_id
                        })
                    }
                }
            }

            const r = await db.upsert('clientProduct', {
                amount: 'amount + ' + totalProducts.toString()
            }, {
                client_id: values.client_id.toString(),
                product_id: pdto.item_id.toString()
            })
            if (!r) {
                updateClients.push({
                    amount: totalProducts,
                    client_id: values.client_id,
                    product_id: pdto.item_id
                })
                throw new Error('No updated client product')
            }


            //Update quotationDetail
            const queryQuotationDetail: string = `UPDATE quotationDetail SET dispatching = dispatching + ? WHERE id = ?`
            const valuesU: Array<string> = [
                totalProducts.toString(), pdto.quotation_detail_id.toString()
            ]
            const qdInserted: OkPacket = await db.updateQuery(queryQuotationDetail, valuesU)

        }
        query = query.slice(0, -1)
        db.insertQuery(query, value)
        let queryQuotation: string;
        let stage;
        if (req.body.isCompleted) {
            queryQuotation = `UPDATE quotation SET stage = 4 WHERE id = ?`
            stage = 4
        } else {
            queryQuotation = `UPDATE quotation SET stage = 3 WHERE id = ?`
            stage = 5
        }
        const valuesQuotation: Array<string> = [
            values.quotation_id.toString()
        ]
        db.updateQuery(queryQuotation, valuesQuotation)
        io.to(req.userData.socketId).emit('quotationChange', {
            stage,
            id: values.quotation_id
        })

    } catch (err) {
        console.error(err)
        db.connection.rollback()
        res.end()
        return null
    }
    db.connection.commit()
    if (updatePdtos.length > 0) {
        updateStockDispatched(res, updatePdtos, values.quotation_id.toString(), io)
    }
    db.closeConnection()

    if (resp.insertId) {
        values.id = resp.insertId
        res.json({
            ok: true
        })
        return values
    } else {
        res.status(204)
        res.end()
        return null
    }
}

export const updateStockDispatched = async (res: Response, params: { qdi: number, amnt: number, item_id: number, value: number, id: number, amount: number }[], quotation_id: string, io: Server) => {
    const db: DataBase = await initDatabase(res)
    const qdis: Array<string> = params.map((det) => det.qdi.toString())
    const queryD: string = `
        SELECT item_id, quotation_id, amount, value, id FROM quotationDetail WHERE id in (${qdis.join(',')})
    `
    const valD: Array<string> = []
    const queryQ: string = `SELECT isRenting, enterprise_id, discount FROM quotation WHERE id = ?`
    const valQ: Array<string> = [quotation_id]
    const details: Array<quotationDetailSchema> = await db.readQuery<quotationDetailSchema>(queryD, valD)
    const quotation: Array<quotationSchema> = await db.readQuery<quotationSchema>(queryQ, valQ)
    if (quotation.length == 0) return

    params = params.map(pr => {
        const item = details.filter(dt => dt.id == pr.qdi)[0]
        pr.item_id = item.item_id
        pr.value = item.value
        return pr
    })

    if (quotation[0].isRenting) {
        for (const dtl of params) {
            const queryRenting = `UPDATE products SET stock = stock - ${dtl.amnt}, 
            rented = rented + ${dtl.amnt}
            WHERE id = ${dtl.item_id}`
            const resp: OkPacket = await db.updateQuery(queryRenting, [])
        }
        io.to('e' + quotation[0].enterprise_id).emit('productRented', { products: params })
    } else {
        for (const dtl of params) {
            const querySell = `UPDATE products SET stock = stock - ${dtl.amnt},
            onSales = onSales + (${dtl.amnt * dtl.value}), sold = sold + ${dtl.amnt}
            WHERE id = ${dtl.item_id}`
            const resp: OkPacket = await db.updateQuery(querySell, [])
            dtl.id = dtl.item_id
            dtl.amount = dtl.amnt
        }
        io.to('e' + quotation[0].enterprise_id).emit('productSold', { products: params, wholesale: false })
    }
}

export const listDispatch = async (req: Request, res: Response) => {
    const query = `SELECT GROUP_CONCAT(dd.id) AS dd_grouped, qd.dispatching, qd.returning, qd.id as quotation_detail_id, d.*, q.serial as quotation_serial, q.client_id, c.name FROM dispatching AS d
    LEFT JOIN dispatchingDetail AS dd ON dd.dispatch_id = d.id
    INNER JOIN quotationDetail AS qd ON qd.id = dd.quotation_detail_id
    INNER JOIN quotation AS q ON d.quotation_id = q.id
    INNER JOIN clients AS c ON q.client_id = c.id
    WHERE enterprise_id = ?
    GROUP BY id
    ORDER BY d.created_at DESC
    `
    const values = [
        req.userData.enterprise_id.toString()
    ]
    const db: DataBase = await initDatabase(res, req)
    const resp: Array<dispatchScheme> = await db.readQuery<dispatchScheme>(query, values)
    db.closeConnection()
    if (resp.length > 0) {
        res.json(resp)
    } else {
        res.end()
    }
    return
}

export const dispatchDetail = async (req: Request, res: Response) => {
    const payload = req.query
    const query: string = `SELECT dd.*, p.name, qd.amount as amount_avaliable, qd.dispatching, part.sigla FROM dispatchingDetail as dd
    INNER JOIN quotationDetail AS qd ON dd.quotation_detail_id = qd.id
    INNER JOIN products AS p ON p.id = qd.item_id
    LEFT JOIN partners AS part ON part.id = dd.partner_id
    WHERE dispatch_id = ?`
    const values: Array<string> = [
        payload.id.toString()
    ]
    const db: DataBase = await initDatabase(res)
    const rps: any = await db.readQuery(query, values)
    db.closeConnection()
    res.json(rps)
}

export const dispatchUpdate = async (req: Request, res: Response, io: Server) => {
    try {
        const payload = req.body
        const query: string = "UPDATE dispatching SET out_store = ?, received = ? WHERE id = ?"
        const values: Array<string> = [
            payload.out_store?.toString(), payload.received?.toString(), payload.id.toString()
        ]
        const db: DataBase = await initDatabase(res)
        const rps: OkPacket = await db.updateQuery(query, values)
        if (payload.discount) {
            const queryData = `
                SELECT dd.quotation_detail_id as qdi, dd.amount as amnt, qd.quotation_id, qd.item_id FROM dispatchingDetail as dd
                INNER JOIN quotationDetail as qd ON qd.id = dd.quotation_detail_id
                WHERE dd.dispatch_id = ? 
            `
            const valuesData = [payload.id]
            const data: Array<any> = await db.readQuery(queryData, valuesData)
            updateStockDispatched(res, data, data[0].quotation_id, io)
        }
        db.closeConnection()
        if (rps.affectedRows > 0) {
            res.json({
                ok: true
            })
            return payload
        } else {
            res.status(204)
            res.end()
        }
    } catch (error) {
        console.error(error)
    }
}

// Returnings 
export const createNewReturn = async (req: Request, res: Response, io?: Server): Promise<returnScheme | null> => {
    const values: returnScheme = req.body
    const queryReturn: string = "INSERT INTO `returning` (return_date, quotation_id, created_by) VALUES (?, ?, ?)"
    const db: DataBase = await initDatabase(res)
    db.connection.beginTransaction()
    const valuesReturn: Array<string> = [
        values.return_date, values.quotation_id.toString(), values.created_by.toString()
    ]
    const resp: OkPacket = await db.insertQuery(queryReturn, valuesReturn)

    try {
        const pdtos: Array<returnDetailSchema> = req.body.products
        let query: string = "INSERT INTO returningDetail (quotation_detail_id, return_id, amount ) VALUES "
        let value: Array<string> = []
        pdtos.forEach((pdto, index) => {
            query += "(?, ?, ?)"
            query += (pdtos.length - 1) == index ? ' ' : ', '
            value = [...value,
            pdto.quotation_detail_id.toString(),
            resp.insertId.toString(),
            pdto.amount.toString(),
            ]

            //Update quotationDetail
            const queryQuotationDetail: string = 'UPDATE quotationDetail SET `returning` = `returning` + ? WHERE id = ?'
            const values: Array<string> = [
                pdto.amount.toString(), pdto.quotation_detail_id.toString()
            ]
            db.updateQuery(queryQuotationDetail, values)
        })
        db.insertQuery(query, value)
        //Update quotation
        let queryQuotation: string;
        let stage;
        if (req.body.isCompleted) {
            queryQuotation = `UPDATE quotation SET stage = 6 WHERE id = ?`
            stage = 6
        } else {
            queryQuotation = `UPDATE quotation SET stage = 5 WHERE id = ?`
            stage = 5
        }
        const valuesQuotation: Array<string> = [
            values.quotation_id.toString()
        ]
        db.updateQuery(queryQuotation, valuesQuotation)
        io.to(req.userData.socketId).emit('quotationChange', {
            stage,
            id: values.quotation_id
        })

    } catch (err) {
        console.error(err)
        db.connection.rollback()
        res.end()
        return null
    }
    db.connection.commit()
    db.closeConnection()

    if (resp.insertId) {
        values.id = resp.insertId
        res.json({
            ok: true
        })
        return values
    } else {
        res.status(204)
        res.end()
        return null
    }
}
export const listReturn = async (req: Request, res: Response) => {
    const query = 'SELECT r.*, q.`serial` as quotation_serial, q.client_id, c.name FROM `returning` AS r INNER JOIN quotation AS q ON r.quotation_id = q.id INNER JOIN clients AS c ON q.client_id = c.id WHERE enterprise_id = ? ORDER BY r.created_at DESC'
    const values = [
        req.userData.enterprise_id.toString()
    ]
    const db: DataBase = await initDatabase(res, req)
    const resp: Array<returnScheme> = await db.readQuery<returnScheme>(query, values)
    db.closeConnection()
    if (resp.length > 0) {
        res.json(resp)
    } else {
        res.end()
    }
    return
}
export const returnDetail = async (req: Request, res: Response) => {
    const payload = req.query
    const query: string = `SELECT rd.*, p.name, qd.amount as amount_avaliable, qd.returning, qd.dispatching FROM returningDetail as rd
    INNER JOIN quotationDetail AS qd ON rd.quotation_detail_id = qd.id
    INNER JOIN products AS p ON p.id = qd.item_id
    WHERE return_id = ?`
    const values: Array<string> = [
        payload.id.toString()
    ]
    const db: DataBase = await initDatabase(res)
    const rps: any = await db.readQuery(query, values)
    db.closeConnection()
    res.json(rps)
}

export const returnUpdate = async (req: Request, res: Response) => {
    try {
        const payload = req.body
        const query: string = "UPDATE `returning` SET return_date = ? WHERE id = ?"
        const values: Array<string> = [
            payload.return_date.toString(), payload.id.toString()
        ]
        const db: DataBase = await initDatabase(res)
        const rps: OkPacket = await db.updateQuery(query, values)
        db.closeConnection()
        if (rps.affectedRows > 0) {
            res.json({
                ok: true
            })
            return payload
        } else {
            res.status(204)
            res.end()
        }
    } catch (error) {
        console.error(error)
    }
}

export const listInvoices = async (req: Request, res: Response) => {
    const query: string = `SELECT i.*, c.name as client_name FROM invoicing as i 
        INNER JOIN clients as c ON c.id = i.client_id
    WHERE deleted = 0`
    const db: DataBase = await initDatabase(res, req)
    const invoices: Array<invoicingSchema> = await db.readQuery<invoicingSchema>(query, [])
    res.json(invoices)
}

