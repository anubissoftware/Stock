import { Response } from 'express';
import { createConnection, Connection, OkPacket } from 'mysql'
import * as dotenv from 'dotenv'
import {join} from 'path'
import {env} from 'process'
dotenv.config({path: join(__dirname, '../../', '.env')})


export const initDatabase = async (res: Response) => {
    const database: DataBase = new DataBase(res);
    const response = await database.createConnection()
    if(!response){
        process.exit()
    }
    return database;
}


export class DataBase {
    private readonly host: string = env.DB_HOST;
    private readonly user: string = env.DB_USER;
    private readonly password: string = env.DB_PASSWORD;
    private readonly database: string = env.DB_NAME;
    private readonly port: number = parseInt(env.DB_PORT);
    private response: Response;
    public connection: Connection;

    constructor(res: Response) {
        this.response = res
    }

    async createConnection() {
        let connected: boolean
        try{
            connected = await new Promise((resolve, reject) => {
                try {
                    this.connection = createConnection({
                        host: this.host,
                        user: this.user,
                        password: this.password,
                        database: this.database,
                        port: this.port
                    });
                    this.connection.connect((err) => {
                        err ? reject(false) : resolve(true);
                    });
                } catch (err: any) {
                    reject(false);
                }
            });
        }catch(error: any){
            console.error("Error in DB connection")
            this.response.status(500);
            this.response.send("Contact with the provider");
            return false
        }
        if (!connected) {
            this.response.status(500);
            this.response.end();
        }
        return true;
    }

    async insertQuery(query: string, values: Array<string> | null): Promise<OkPacket> {
        return await new Promise((resolve, reject) => {
            this.connection.query(query, [...values], (err, res) => {
                if (err) reject(new Error(err.sqlMessage))
                resolve(res)
            })
        })
    }

    async readQuery<T>(query: string, values: Array<string> | null): Promise<Array<T>> {
        return await new Promise((resolve, reject) => {
            this.connection.query(query, [...values], (err, res) => {
                if (err) reject(new Error(err.sqlMessage))
                resolve(res)
            })
        })
    }

    async updateQuery(query: string, values: Array<string> | null): Promise<OkPacket> {
        return await new Promise((resolve, reject) => {
            this.connection.query(query, [...values], (err, res) => {
                if (err) reject(new Error(err.sqlMessage))
                resolve(res)
            })
        })
    }

    closeConnection() {
        this.connection.end()
    }

}

