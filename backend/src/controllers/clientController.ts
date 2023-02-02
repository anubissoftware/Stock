import { DataBase, initDatabase } from './../classes/db';
import { Request, Response } from "express";
import { clientEnterpriseSchema, projectSchema } from '@/schemas';

import { join } from 'path'
import * as dotenv from 'dotenv'
import { env } from 'process'
import { OkPacket } from 'mysql';
import { saveLocalResource } from '../handlers/storageHandler';
import moment from 'moment';
dotenv.config({ path: join(__dirname, '../../', '.env') })

const handleName = (title: string) => {
    return title.replace(' ', '')
}

export const readClients = async (req: Request, res: Response) => {
    const db: DataBase = await initDatabase(res)
    const query: string = `
        SELECT c.*, m.filename, m.path, m.host, m.id as media_id from clients AS c 
        LEFT JOIN media AS m ON c.rut = m.id
        WHERE enterprise = ? AND (name like "%${req.query.filter?.toString() ?? ''}%")
        ORDER BY registro DESC
        LIMIT 100
    `
    const values: Array<string> = [
        req.userData.enterprise_id.toString()
    ]
    const response: Array<clientEnterpriseSchema> = await db.readQuery<clientEnterpriseSchema>(query, values)
    db.closeConnection()
    res.json(response)
}

export const addClient = async (req: Request, res: Response) => {
    let data: clientEnterpriseSchema = req.body
    let types: { id: number, name: string } = data.type as { id: number, name: string }
    data.type = types.id
    const db: DataBase = await initDatabase(res)
    db.connection.beginTransaction()
    const path = `/clients/${req.userData.enterprise_id}/`
    const filenamelist = data.rut.name.split('.')
    const filename = handleName(data.name) + '_' + moment().format('YYYY-MM') + "." + filenamelist[filenamelist.length - 1]
    try {
        const queryMedia: string = `
            INSERT INTO media (path, filename, host) VALUES
            (?, ?, ?)
        `
        const valuesMedia: Array<string> = [
            path,
            filename,
            env.SERVER_HOST
        ]
        const mediaResponse: OkPacket = await db.insertQuery(queryMedia, valuesMedia)
        if (!mediaResponse.insertId) throw new Error('No inserted ID in media query')

        const query: string = `
            INSERT INTO clients (name, type, nit, rut, email, contact_name, contact_phone, 
                contact_email, enterprise) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
        const values: Array<string> = [
            data.name, data.type.toString(),
            data.nit, mediaResponse.insertId.toString(),
            data.email, data.contact_name, data.contact_phone,
            data.contact_email, req.userData.enterprise_id.toString()
        ]
        const response: OkPacket = await db.insertQuery(query, values)
        if (!response.insertId) throw new Error('No inserted ID in client query')
        data.id = response.insertId
        const buffer: Buffer = Buffer.from(data.rut.info.split(',')[1], "base64")
        const route: string = join(__dirname, '../../public', path)
        await saveLocalResource(buffer, route, filename)

        data.rut.info = env.SERVER_HOST + path + filename
        data.host = env.SERVER_HOST

    } catch (err) {
        console.log(err)
        db.connection.rollback()
        db.closeConnection()
        res.status(500)
        res.end()
        return
    }
    db.connection.commit()
    db.closeConnection()

    res.json({
        ok: true
    })
    return data
}

export const editClient = async (req: Request, res: Response) => {
    let data: clientEnterpriseSchema = req.body
    let types: { id: number, name: string } = data.type as { id: number, name: string }
    data.type = types.id
    const filenamelist = data.rut.name.split('.')
    const filename = handleName(data.name) + '_' + moment().format('YYYY-MM') + "." + filenamelist[filenamelist.length - 1]
    if (!data.id) {
        res.json({
            ok: false,
            message: 'No ID on Data'
        })
        return
    }
    const db: DataBase = await initDatabase(res)
    const query: string = `
        UPDATE clients SET 
        name = ?, type = ?, nit = ?,
        email = ?, contact_name = ?,
        contact_phone = ?, contact_email = ?
        WHERE id = ?
    `
    const values: Array<string> = [
        data.name, data.type.toString(), data.nit,
        data.email, data.contact_name, data.contact_phone,
        data.contact_email,
        data.id.toString()
    ]
    try {
        db.connection.beginTransaction()
        const response: OkPacket = await db.updateQuery(query, values)
        if (response.affectedRows == 0) throw new Error('No updated client')
        const infoFile = data.rut.info.split(',')
        if (infoFile.length > 1) {
            // Save new file
            const buffer: Buffer = Buffer.from(infoFile[1], "base64")
            const route: string = join(__dirname, '../../public', data.path)
            const media: string = `
                UPDATE media SET filename = ? WHERE id = ?
            `
            const mediaV: Array<string> = [
                filename, data.media_id.toString()
            ]
            await db.updateQuery(media, mediaV)
            await saveLocalResource(buffer, route, filename)
            data.rut.info = env.SERVER_HOST + data.path + filename
        }
    } catch (err) {
        console.log(err)
        res.json({
            ok: false,
            message: 'No se realizó el cambio en el cliente'
        })
        db.connection.rollback()
        db.closeConnection()
        return
    }
    db.connection.commit()
    db.closeConnection()
    res.json({
        ok: true
    })
    return data
}

export const deleteClient = async (req: Request, res: Response) => {
    const clientData: { id: number } = req.body

    const fQuery: string = `
        SELECT rut as id FROM clients WHERE id = ?
    `
    const fValues: Array<string> = [
        clientData.id.toString()
    ]
    const sQuery: string = `DELETE FROM clients WHERE id = ?`
    const tQuery: string = `DELETE FROM media WHERE id = ?`

    const db: DataBase = await initDatabase(res)
    const fRes: Array<clientEnterpriseSchema> = await db.readQuery<clientEnterpriseSchema>(fQuery, fValues)
    db.connection.beginTransaction()
    const sRes: OkPacket = await db.insertQuery(sQuery, fValues)
    if (sRes.affectedRows == 0) {
        res.json({
            ok: false
        })
        db.connection.rollback()
        db.closeConnection()
        return
    }
    if (fRes[0].id) {
        const tRes: OkPacket = await db.insertQuery(tQuery, [fRes[0].id.toString()])
        if (tRes.affectedRows == 0) {
            res.json({
                ok: false
            })
            db.connection.rollback()
            db.closeConnection()
            return
        }
    }
    db.connection.commit()
    db.closeConnection()
    res.json({
        ok: true
    })
    return clientData
}

export const saveProject = async (req: Request, res: Response) => {
    const bd: projectSchema = req.body as projectSchema
    let query: string
    let values: Array<string>
    const db: DataBase = await initDatabase(res)
    let resp: OkPacket
    if((bd.id)){
        query = `
            UPDATE projects SET name = ?, address = ?, contact_name = ?, contact_phone = ?,
                contact_email = ?, budget = ?, renting = ? WHERE id = ? `
        values = [
            bd.name, bd.address, bd.contact_name, bd.contact_phone,
            bd.contact_email, bd.budget.toString(), (bd.renting ? 1 : 0).toString(),
            bd.id.toString()
        ]
        resp = await db.updateQuery(query, values)
    }else{
        query = `
            INSERT INTO projects (name, address, contact_name, contact_phone,
                contact_email, client_id, budget, renting) VALUES
            (?, ?, ?, ?, ?, ?, ?, ?)
        `
        values = [
            bd.name, bd.address, bd.contact_name, bd.contact_phone,
            bd.contact_email, bd.client_id.toString(), bd.budget.toString(), (bd.renting ? 1 : 0).toString()
        ]
        resp = await db.insertQuery(query, values)
    }
    if(resp.insertId > 0 || resp.affectedRows > 0){
        bd.id = bd.id ?? resp.insertId
        res.json({
            ok: true
        })
        return bd
    } else{
        res.status(204)
        res.end()
        return
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    const query: string = `DELETE FROM projects WHERE id = ?`
    const values: Array<string> = [
        req.body.id
    ]
    const db: DataBase = await initDatabase(res)
    const resp: OkPacket = await db.insertQuery(query, values)
    if(resp.affectedRows > 0){
        res.json({
            ok: true
        })
        return req.body
    }
    res.end()
    return 
}

export const getProjects = async (req: Request, res: Response) => {
    const query: string = `SELECT * FROM projects WHERE client_id = ? AND (name like "%${req.query.name?.toString() ?? ''}%" OR DATE_FORMAT(register, '%Y-%m-%d') like "%${req.query.name?.toString() ?? ''}%") ORDER BY register DESC
    LIMIT 100
    `
    const values: Array<string> = [
        req.query.client_id.toString(),
        
    ]
    const db: DataBase = await initDatabase(res)
    const resp: Array<any> = await db.readQuery(query, values) 
    db.closeConnection()
    if(resp.length > 0){
        res.status(200)
    }else{
        res.status(204)
    }
    res.json(resp)
}

