import { OkPacket } from "mysql"
import { DataBase } from "../classes/db";

export const loginCustomer = async (clientLogin: any, db: DataBase): Promise<Array<any>> => {
    const query: string = `SELECT * FROM customer AS c
    WHERE c.email = ? AND c.password = ?`
    const values: Array<string> = [clientLogin.nickname, clientLogin.password];
    return db.readQuery(query, values)
}

export const setTokenCustomer = async (customerId: string, token: string, db: DataBase): Promise<OkPacket> => {
    const query: string = `UPDATE customer SET token = ? WHERE id = ?`;
    const values: Array<string> = [token, customerId]
    return db.updateQuery(query, values)
}