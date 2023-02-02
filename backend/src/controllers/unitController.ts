import { Request, Response } from "express";
import { DataBase, initDatabase } from "../classes/db";
import { unitSchema } from '@/schemas'


export const getUnits = async (req: Request, res: Response): Promise<void> => {
    const db: DataBase = await initDatabase(res);
    const query: string = `SELECT * FROM units`
    const response: Array<unitSchema> = await db.readQuery(query, [])
    db.closeConnection()
    if (response.length > 0) {
        res.status(200)
        res.json(response)
    } else {
        res.status(204)
        res.end()
    }
}