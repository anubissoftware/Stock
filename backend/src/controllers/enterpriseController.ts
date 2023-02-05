import { initDatabase, DataBase } from '../classes/db';
import { Request, Response } from "express";
import { OkPacket } from "mysql"

export const validateEnterprise = async (req: Request, res: Response): Promise<any> => {
    const db: DataBase = await initDatabase(res)
    const query: string = "Select id FROM enterprise WHERE shortcut = ?"
    const values: Array<string> = [req.params.shortcut]
    const response: Array<any> = await db.readQuery<any>(query, values)
    db.closeConnection()
    return response 
}

export const changeBrandColors = async (req: Request, res: Response): Promise<any> => {
    try {
        const payload = req.body
        console.log(payload)
        const values: Array<string> = [payload.colors.toString(), payload.enterprise_id.toString()]
        const query: string = `UPDATE enterprise SET colors = ? WHERE id = ?`;
        const db: DataBase = await initDatabase(res)
        const rps: OkPacket = await db.updateQuery(query, values)
        db.closeConnection()
        if (rps.affectedRows > 0) {
            res.json({
                ok: true,
            })
            return payload
        } else {
            res.status(204)
            res.end()
        }
    } catch (error) {
        console.log(error)
        res.status(400)
        res.json({
            message: 'Contraseña no pudo ser cambiada'
        })
        res.end()
    }
}