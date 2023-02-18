import { DataBase, initDatabase } from "../classes/db"
import { partnerSchema } from "../schemas/partnerSchema"
import { Request, Response } from "express"
import { OkPacket } from "mysql"
import { Server } from "socket.io"

export const createNewPartner = async (req:Request, res: Response, io?: Server): Promise< partnerSchema > => { 
    try {
        const values: partnerSchema = req.body
        const queryPartners: string = "INSERT INTO `partners` (name, nit, sigla, enterprise) VALUES (?, ?, ?, ?)"
        const db: DataBase = await initDatabase(res)
        const valuesPartners: Array<string> = [
            values.name, values.nit.toString(), values.sigla.toString(), req.userData.enterprise_id.toString()
        ]
        const resp: OkPacket = await db.insertQuery(queryPartners, valuesPartners)
        db.closeConnection()
        if(resp.insertId){
            values.id = resp.insertId
            res.json({
                ok: true
            })
            io.to(req.userData.socketId).emit('partnerCreate', {
                partner: values,
                id:  resp.insertId
            })
        }else{
            res.status(204)
            res.end()
            return null
        }
    } catch (error) {
        res.status(500)
        res.end()
    }
}
export const listPartners = async (req: Request, res: Response) => {
    try {
        const query = 'SELECT p.* FROM partners AS p WHERE enterprise = ? AND removed = 1 ORDER BY p.created_at DESC'    
        const values = [
            req.userData.enterprise_id.toString()
        ]
        const db: DataBase = await initDatabase(res, req)
        const resp: Array<partnerSchema> = await db.readQuery<partnerSchema>(query, values)
        db.closeConnection()
        if(resp.length > 0){
            res.json(resp)
        }else{
            res.end()
        }
    } catch (error) {
        res.status(500)
        res.end()
    }
}

export const updatePartner = async (req: Request, res: Response, io: Server) => {
    try {
        const payload = req.body
        const db: DataBase = await initDatabase(res);
        const rps: OkPacket = await db.updateQueryDynamic('partners', payload);
        db.closeConnection()
        if (rps.affectedRows > 0) {
            res.json({
                ok: true
            })
            io.to(req.userData.socketId).emit('partnerUpdate', payload)
        } else {
            res.status(204)
            res.end()
        }
    } catch (error) {
        console.log(error.message)
        res.status(500)
        res.end()
    }
}