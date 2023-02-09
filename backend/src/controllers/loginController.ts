import { modulesSchema, clientToRegister, clientEmail, clientCellphone, clientValidate } from '@/schemas';
import { OkPacket } from "mysql"
import { DataBase, initDatabase } from "../classes/db";
import { Request, Response } from "express";
import moment from 'moment'
import { sendEmail } from "./emailController";
import { OAuth2Client } from 'google-auth-library'
import * as dotenv from 'dotenv'
import { join } from 'path'
import {env} from 'process'
dotenv.config({ path: join(__dirname, '../../', '.env') })

const generateNumber = (length: number): number => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
}

export const validateEmail = async (req: Request, res: Response): Promise<any> => {
    const clientEmail: clientEmail = req.body as clientEmail
    const db: DataBase = await initDatabase(res)
    const query: string = `SELECT c.id FROM customer AS c
    WHERE c.email = ?`
    const values: Array<string> = [clientEmail.email];
    const response = await db.readQuery(query, values)
    console.log(response)
    db.closeConnection()
    if (response.length == 0) {
        res.status(200)
        res.json({
            message: 'Email disponible'
        })
        res.end()
    } else {
        res.status(204)
        res.json({
            message: 'Email no disponible'
        })
        res.end()
    }
}

export const validateCellphone = async (req: Request, res: Response): Promise<any> => {
    const clientCellphone: clientCellphone = req.body as clientCellphone
    const db: DataBase = await initDatabase(res)
    const query: string = `SELECT c.id FROM customer AS c
    WHERE c.cellphone = ?`
    const values: Array<string> = [clientCellphone.cellphone];
    const response = await db.readQuery(query, values)
    db.closeConnection()
    if (response.length == 0) {
        res.status(200)
        res.json({
            message: 'cellphone disponible'
        })
        res.end()
    } else {
        res.status(204)
        res.json({
            message: 'Cellphone no disponible'
        })
        res.end()
    }
}

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const clientToRegister: clientToRegister = req.body as clientToRegister
        const db: DataBase = await initDatabase(res)
        const insertCustomer: string = `INSERT INTO customer (name, email, cellphone, password) VALUES (?, ?, ?, ?)`
        const values: Array<string> = [
            clientToRegister.name,
            clientToRegister.email,
            clientToRegister.cellphone,
            clientToRegister.password
        ]
        const result: OkPacket = await db.insertQuery(insertCustomer, values)
        const idInserted: number = result.insertId
        const code = (generateNumber(6)).toString()
        const exp: number = moment().unix() + 60 * 60
        const insertValidationCodes: string = `INSERT INTO validationCodes (code, exp, fk_customer) VALUES (?, ?, ?)`
        const values2: Array<any> = [
            code,
            exp,
            idInserted
        ]
        const result2: OkPacket = await db.insertQuery(insertValidationCodes, values2)
        if (result2.insertId) {
            await sendEmail(
                [clientToRegister.email],
                'Code to registry',
                `The code ${code} has been generated, you must enter this code in the next step.`
            )
        }
        db.closeConnection()
        res.status(200)
        res.json({
            message: 'Usuario registrado'
        })
        res.end()
    } catch (error) {
        console.log(error)
        res.status(204)
        res.json({
            message: 'Error en registro de usuario',
            errorConsole: error.message
        })
        res.end()
    }
}

/**
 * Function to validate code from new Customer
 * @param req
 * @param res 
 */
export const activateCustomer = async (req: Request, res: Response): Promise<any> => {
    try {
        const clientValidate: clientValidate = req.body as clientValidate
        const db: DataBase = await initDatabase(res)
        const validateCode: string = `SELECT * FROM validationCodes AS validC
        INNER JOIN customer ON validC.fk_customer = customer.id
        WHERE validC.code = ? AND customer.email = ?`
        const values: Array<string> = [clientValidate.code, clientValidate.email]
        const result: OkPacket = await db.insertQuery(validateCode, values)
        if (result[0] == undefined) {
            throw new Error("Codigo no coincide");
        }
        const updateUser: string = 'UPDATE customer SET activated = 1 WHERE email = ?';
        const values2: Array<string> = [clientValidate.email]
        const response: OkPacket = await db.insertQuery(updateUser, values2)
        if (response.affectedRows) {
            db.closeConnection()
            res.json({
                message: 'Usuario activado'
            })
            res.status(200)
            res.end()
        }
    } catch (error) {
        res.status(204)
        res.json({
            message: 'Error en registro de usuario',
            errorConsole: error.message
        })
        res.end()
    }
}

export const menusInRol = async (req: Request, rolId: number, db: DataBase): Promise<Array<modulesSchema>> => {
    const queryMenus: string = "SELECT rp.`read`, rp.`write`, rp.`edit`, m.`name`, m.depends, m.icon, m.url, m.id, m.`order` FROM rol AS r INNER JOIN rolPermitions AS rp ON rp.rol = r.id   INNER JOIN modules AS m ON m.id = rp.module INNER JOIN enterpriseModules AS em ON em.module_id = rp.module WHERE r.id = ? AND m.`active` = 1 AND rp.`read` = 1 AND m.`order` is not null ORDER BY m.`order` ASC"
    const valuesMenus: Array<string> = [rolId.toString()]
    const respMenus: Array<modulesSchema> = await db.readQuery<modulesSchema>(queryMenus, valuesMenus)
    const Menus: Array<modulesSchema> = []

    respMenus.map((menu: modulesSchema) => {
        if (menu.url == null && menu.depends == null) {
            const children: Array<modulesSchema> = respMenus.filter(men => men.depends == menu.id)
            menu.children = [...children]
            Menus.push(menu)
        } else if (menu.url.length > 0 && menu.depends == null) {
            Menus.push(menu)
        }
    })

    return Menus
}
