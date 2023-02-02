import { saveLocalResource } from './../handlers/storageHandler';
import { mediaUpdateDTO, enterpriseMediaInfo } from '@/schemas'
import { Request, Response } from "express";
import { DataBase, initDatabase } from "../classes/db";
import fs from 'fs'
import path from 'path'

export const saveEnterpriseLogo = async (req: Request, res: Response): Promise<boolean> => {
    const db: DataBase = await initDatabase(res)
    const toUpdate: mediaUpdateDTO = req.body
    const queryGetInfo: string = `SELECT e.shortcut, m.path, m.filename, m.host FROM enterprise as e
    INNER JOIN media as m ON e.logo = m.id
    WHERE e.id = ?
    `
    const valuesGetInfo: Array<string> = [req.userData.enterprise_id.toString()]
    const mediaInfo: Array<enterpriseMediaInfo> = await db.readQuery<enterpriseMediaInfo>(queryGetInfo, valuesGetInfo)
    const buffer = Buffer.from(toUpdate.b64.split(',')[1], "base64")
    db.closeConnection()
    const folderpath: string = path.join(__dirname,'../../public/logos')
    const filename: string = mediaInfo[0].filename
    try{
        await saveLocalResource(buffer, folderpath, filename)
    }catch(error){
        res.status(500)
        res.end()
        return false
    }
    res.end()

    return true
}
