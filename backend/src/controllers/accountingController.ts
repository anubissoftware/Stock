import { Request, Response } from "express";
import { OkPacket } from "mysql";
import { productsInCartType, quotationSchema } from "@/shared";
import { DataBase, initDatabase } from "../classes/db";
import { sendEmail } from "./emailController";
import { join } from 'path'
import * as dotenv from 'dotenv'
import { env } from 'process'
import { Server } from "socket.io";
import moment from "moment";
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
    const query: string = `SELECT qd.*, p.name FROM quotationDetail as qd
    INNER JOIN products AS p ON p.id = qd.item_id
    WHERE quotation_id = ?`
    const values: Array<string> = [
        payload.id.toString()
    ]
    const db: DataBase = await initDatabase(res)
    const rps: any = await db.readQuery(query, values)
    db.closeConnection()
    res.json(rps)
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
    const query: string = "UPDATE quotation SET `value` = ?, min_validity = ?, max_validity = ?, `from` = ?, `to` = ?, email = ?, updated_by = ? WHERE enterprise_id = ? AND id = ?"
    const qvalues: Array<string> = [
        values.value.toString(), values.min_validity, values.max_validity, values.from, values.to,
        values.email, req.userData.id.toString(), req.userData.enterprise_id.toString(),
        values.id.toString()
    ]
    const db: DataBase = await initDatabase(res)
    let rsp: OkPacket
    try {
        db.connection.beginTransaction()
        rsp = await db.updateQuery(query, qvalues)
        if (rsp.affectedRows == 0) {
            throw new Error('No updated quotation: ' + values.id)
        }
        const pdtos: Array<productsInCartType> = req.body.products
        for (const pdto of pdtos) {
            if (pdto.id) {
                const pdtoQuery: string = "UPDATE quotationDetail SET amount = ?, `value` = ?, `from` = ?, `to` = ?, days = ? WHERE id = ?"
                const pdtoValues: Array<string> = [
                    pdto.amount.toString(), pdto.value.toString(), pdto.start_rent ? moment(pdto.start_rent).format('YYYY-MM-DD') : null,
                    pdto.end_rent ? moment(pdto.end_rent).format('YYYY-MM-DD') : null, pdto.days?.toString(), pdto.id.toString()
                ]
                const rspto: OkPacket = await db.updateQuery(pdtoQuery, pdtoValues)
                if (rspto.affectedRows == 0) {
                    throw new Error('No updated detail quotation: ' + pdto.id)
                }
            } else {
                const pdtoQuery: string = "INSERT INTO quotationDetail (item_id, amount, `value`, quotation_id, `from`, `to`, `days`) VALUES (?, ?, ?, ?, ?, ?, ?)"
                const pdtoValues: Array<string> = [
                    pdto.id.toString(), pdto.amount.toString(), pdto.value.toString(),
                    values.id.toString(), pdto.start_rent ?? null, pdto.end_rent ?? null, pdto.days?.toString()
                ]
                const rspto: OkPacket = await db.insertQuery(pdtoQuery, pdtoValues)
                if (rspto.affectedRows == 0) {
                    throw new Error('No inserted detail quotation: ' + pdto)
                }
            }
        }
    } catch (err) {
        console.log(err)
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
    const getSerial: string = `SELECT q.serial + 1 as serial FROM quotation AS q WHERE q.enterprise_id = ? ORDER BY q.serial DESC LIMIT 1`
    const getSerialV: Array<string> = [
        req.userData.enterprise_id.toString()
    ]
    const queryQuotation: string = "INSERT INTO quotation (`value`, client_id, project_id, min_validity, max_validity, isRenting, one_day, `from`, `to`, user, enterprise_id, `serial`, email)       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "

    const db: DataBase = await initDatabase(res)
    db.connection.beginTransaction()
    const serial: Array<{ serial: number }> = await db.readQuery<{ serial: number }>(getSerial, getSerialV)
    const nextSerial: string = serial.length > 0 ? serial[0]?.serial?.toString() : '1'
    const valuesQuotation: Array<string> = [
        values.value.toString(), values.client_id.toString(), values.project_id?.toString(),
        values.min_validity, values.max_validity, values.isRenting ? '1' : '0',
        values.one_day && values.isRenting ? '1' : '0', values.from, values.to, req.userData.id.toString(),
        req.userData.enterprise_id.toString(), nextSerial, values.email
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
        console.log(err)
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
        `SELECT q.serial, q.email, q.value, c.name, c.contact_email FROM quotation as q
        INNER JOIN clients as c ON c.id = q.client_id
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
            Su cotización espera por ser aprobada:
        </h1>
        <p
            style="font-size: 20px;"
        >
            Se ha enviado la cotización con serial:
            <span style="font-style: italic;">
                ${quotationInfo[0].serial.toString(36).toUpperCase()}
            </span>
        </p>
        <a href="${env.FRONTEND_HOST}quotations?v=${Buffer.from(quotation_id.toString()).toString('base64')}" class="button">
            Visualizar cotización
        </a>
    
    </body>
    
    </html>
    `
        const subject = `Cotización # pendiente`

        sendEmail(
            [quotationInfo[0].email],
            subject,
            message
        ).then((r) => {
            console.log('user', req.userData.socketId)
            console.log('sent')
            io.to(req.userData.socketId).emit('notification', {
                description: `La cotización <strong>${quotationInfo[0].serial.toString(36).toUpperCase()}</strong> ha sido enviada con éxito.`,
                ok: true
            })
        })
    } else {
        io.to(req.userData.socketId).emit('notification', {
            description: `No se ha podido enviar la cotización <strong>${quotationInfo[0].serial.toString(36).toUpperCase()}</strong>.`,
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
    const db: DataBase = await initDatabase(res)
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
    
    const query: string = `SELECT e.* FROM quotation AS q INNER JOIN enterprise AS e ON e.id = q.enterprise_id WHERE q.id = ? `
    const values: Array<string> = [
        payload
    ]
    const db: DataBase = await initDatabase(res)

    const qQuery: string = `SELECT * FROM quotation WHERE id = ?`
    const qValues: Array<string> = [
        payload
    ] 

    const ent = await db.readQuery(query, values)
    const qot = await db.readQuery(qQuery, qValues)
    db.closeConnection()
    res.json({
        enterprise: ent[0],
        quotation: qot[0]
    })
} 
