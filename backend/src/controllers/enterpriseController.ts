import { initDatabase, DataBase } from '../classes/db';
import { Request, Response } from "express";

export const validateEnterprise = async (req: Request, res: Response): Promise<any> => {
    const db: DataBase = await initDatabase(res)
    const query: string = "Select id FROM enterprise WHERE shortcut = ?"
    const values: Array<string> = [req.params.shortcut]
    const response: Array<any> = await db.readQuery<any>(query, values)
    db.closeConnection()
    return response 
}