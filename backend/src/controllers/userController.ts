import { modulesSchema, userData, UserLogin } from '@/schemas'
import { OkPacket } from "mysql"
import { Response, Request } from "express";
import { DataBase, initDatabase } from "../classes/db";
import { OAuth2Client } from 'google-auth-library'
import { Server } from "socket.io"
import * as dotenv from 'dotenv'
import { join } from 'path'
import { env } from 'process'
dotenv.config({ path: join(__dirname, '../../', '.env') })
import moment from "moment";
import { menusInRol } from './loginController';

const loginQuerySelect: string = `
    SELECT u.id, u.name, u.nickname, u.email, u.email_verified ,u.isAdmin, u.enterprise as enterprise_id, e.name as enterprise_name,
    m.path as enterprise_path, e.shortcut, u.rol, e.renting, e.quoting, e.selling, e.projects, e.colors,
    e.cart
    FROM users AS u 
    INNER JOIN enterprise as e ON e.id = u.enterprise
    LEFT JOIN media as m ON m.id = e.logo
`

export const login = async (userLogin: UserLogin, db: DataBase): Promise<Array<userData>> => {
    const query: string = `${loginQuerySelect}
    WHERE u.nickname = ? AND u.password = ?`
    const values: Array<string> = [userLogin.nickname, userLogin.password];
    return db.readQuery(query, values)
}

export const setToken = async (userId: string, token: string, db: DataBase): Promise<OkPacket> => {
    const query: string = `UPDATE users SET token = ? WHERE id = ?`;
    const values: Array<string> = [token, userId]
    return db.updateQuery(query, values)
}

export const unSetToken = async (userId: string, db: DataBase): Promise<OkPacket> => {
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
        } else {
            return false
        }
    }
}

export const syncUserWithGoogle = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token, id } = req.body
        const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const query: string = `UPDATE users SET email = ?, email_verified = 1 WHERE id = ?`;
        const values: Array<string> = [payload.email.toString(), id.toString()]
        const db: DataBase = await initDatabase(res)
        const rps: OkPacket = await db.updateQuery(query, values)
        console.log(rps)
        db.closeConnection()
        if (rps.affectedRows > 0) {
            res.json({
                ok: true,
                email: payload.email
            })
            return payload
        } else {
            res.status(204)
            res.end()
        }
    } catch (error) {
        console.log(error)
        res.status(500)
        res.json({
            message: 'Correo ya registrado'
        })
        res.end()
    }
}

export const googleLogin = async (req: Request, res: Response, io: Server): Promise<any> => {
    const { token } = req.body
    const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const db: DataBase = await initDatabase(res)
    const query: string = `${loginQuerySelect}
    WHERE u.email = ?`
    const values: Array<string> = [payload.email.toString()];
    const rps = await db.readQuery(query, values)
    if (rps.length != 0) {
        const userResponse: userData = rps[0] as userData;
        userResponse.exp = moment().unix() + 60 * 60;
        const tokenUser: string = Buffer.from(JSON.stringify(userResponse), 'utf-8').toString('base64')
        const userId: string = userResponse.id.toString();
        const settoken: OkPacket = await setToken(userId, tokenUser, db);
        const menus: Array<modulesSchema> = await menusInRol(req, userResponse.rol, db)
        db.closeConnection()
        if (settoken.changedRows > 0) {
            res.json({
                token: tokenUser,
                user: userResponse,
                menus: menus
            })
            res.end()
            io.to('e' + userResponse.enterprise_id).emit('userConnected', { id: userResponse.id, nickname: userResponse.nickname })
        } else {
            res.status(500)

            res.end()
        }
    } else {
        res.status(400)
        res.json({
            message: 'Email no registrado'
        })
        res.end()
    }
}

export const changePassword = async (req: Request, res: Response): Promise<any> => {
    try {
        const payload = req.body
        const values: Array<string> = [payload.newPass.toString(), payload.lastPass.toString(), payload.nickname.toString()]
        const query: string = `UPDATE users SET password = ? WHERE password = ? AND nickname = ?`;
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
        res.status(400)
        res.json({
            message: 'Contraseña no pudo ser cambiada'
        })
        res.end()
    }
}

