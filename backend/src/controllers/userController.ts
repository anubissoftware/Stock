import { userData, UserLogin} from '@/shared'
import { OkPacket } from "mysql"
import { Response } from "express";
import { DataBase } from "../classes/db";
import moment from "moment";

export const login = async (userLogin: UserLogin, db: DataBase): Promise<Array<userData>> => {
    const query: string = `SELECT u.id, u.name, u.nickname, u.isAdmin, u.enterprise as enterprise_id, e.name as enterprise_name,
    m.path as enterprise_path, e.shortcut, u.rol, e.renting, e.quoting
    FROM users AS u 
    INNER JOIN enterprise as e ON e.id = u.enterprise
    LEFT JOIN media as m ON m.id = e.logo
    WHERE u.nickname = ? AND u.password = ?`
    const values: Array<string> = [userLogin.nickname, userLogin.password];
    return db.readQuery(query, values)
}

export const setToken = async (userId: string, token: string, db: DataBase): Promise<OkPacket> => {
    const query: string = `UPDATE users SET token = ? WHERE id = ?`;
    const values: Array<string> = [token, userId]
    return db.updateQuery(query, values)
}

export const unSetToken = async(userId: string, db: DataBase): Promise<OkPacket> => {
    const query: string = `UPDATE users SET token = null WHERE id = ?`;
    const values: Array<string> = [userId]
    return db.updateQuery(query, values)
}

export const validateToken = async (token: string, db: DataBase): Promise<boolean | string> => {
    const userInfo: userData = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    if (userInfo.exp < moment().unix()) {
        return false;
    } else {
        const query: string = `SELECT id, name, nickname, isAdmin, enterprise, socketId FROM users AS u WHERE u.token = ?`;
        const values: Array<string> = [token];
        const response: Array<userData> = await db.readQuery<userData>(query, values);
        if (response.length > 0 && response[0].id == userInfo.id) {
            return response[0].socketId;
        }else{
            return false
        }
    }
}