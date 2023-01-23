import { OkPacket } from 'mysql';
import { categoryQuery, categoryToDelete, categoryToSave} from '@/shared'
import { initDatabase, DataBase } from '../classes/db';
import { Request, Response } from "express";


export const getCategories = async (req: Request, res: Response): Promise<void> => {
    const db: DataBase = await initDatabase(res)
    const query: string = `SELECT id, name, color FROM category WHERE enterprise = ?`
    const values: Array<string> = [req.userData.enterprise_id.toString()]
    const response: Array<categoryQuery> = await db.readQuery<categoryQuery>(query, values) 
    db.closeConnection()
    if(response.length > 0){
        res.status(200)
        res.json(response)
    }else{
        res.status(204)
        res.end
    }
    return
}

export const saveCategory = async (req: Request, res: Response): Promise<categoryQuery | object> => {
    const db: DataBase = await initDatabase(res)
    const request: categoryToSave = req.body
    const query: string = `INSERT INTO category (name, color, enterprise) VALUES (?, ?, ?)`
    const values: Array<string> = [
        request.name, request.color, req.userData.enterprise_id.toString()
    ]
    const response: OkPacket = await db.insertQuery(query, values)
    db.closeConnection()
    if(response.affectedRows > 0 && response.insertId != 0){
        res.status(200)
        const categoryCreated: categoryQuery = {
            id: response.insertId,
            name: request.name,
            color: request.color
        }
        res.json(categoryCreated)
        return categoryCreated
    }else{
        res.status(204)
        res.end()
        return {}
    }
}

export const updateCategory = async(req: Request, res: Response): Promise<categoryQuery | object> => {
    const db: DataBase = await initDatabase(res)
    const cat: categoryQuery = req.body
    const query: string = `UPDATE category SET name = ?, color = ? WHERE id = ?`
    const values: Array<string> = [
        cat.name, cat.color, cat.id.toString()
    ]
    const response: OkPacket = await db.insertQuery(query, values)
    db.closeConnection()
    if(response.changedRows > 0){
        res.status(200)
        res.json(cat)
        return cat
    }else{
        res.status(204)
        res.end()
        return {}
    }
}

export const deleteCategory = async(req: Request, res: Response): Promise<number> => {
    const db: DataBase = await initDatabase(res)
    const toDel: categoryToDelete = req.body
    const query: string = `DELETE FROM category WHERE id = ? AND enterprise = ?`
    const values: Array<string> = [toDel.id.toString(), req.userData.enterprise_id.toString()]
    const response: OkPacket = await db.updateQuery(query, values)
    if(response.affectedRows == 0){
        res.status(204)
        res.end()
    }
    res.status(200)
    res.end()
    return toDel.id
}

