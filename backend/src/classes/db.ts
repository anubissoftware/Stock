import { Request, Response } from 'express';
import { createConnection, Connection, OkPacket } from 'mysql'
import * as dotenv from 'dotenv'
import { join } from 'path'
import { env } from 'process'
dotenv.config({ path: join(__dirname, '../../', '.env') })


export const initDatabase = async (res: Response, req?: Request) => {
    const database: DataBase = new DataBase(res);
    if (req) {
        database.setRequest(req)
    }
    const response = await database.createConnection()
    if (!response) {
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
    private request?: Request
    public connection: Connection;

    constructor(res: Response) {
        this.response = res
    }

    setRequest(request: Request) {
        this.request = request
    }

    async createConnection() {
        let connected: boolean
        try {
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
        } catch (error: any) {
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

    validateParam(str: string): void {
        if (str.split(' ').length > 1 || str.split(';').length > 1) {
            this.response.json({
                system: 'Fuck off.'
            })
            console.error('Bad query')
            this.closeConnection()
        }
    }

    makeConditionalString(): { str: string, vals: Array<string>, pag: string } {
        const query = this.request.query
        let str: string = ' '
        let vals: Array<string> = []
        let pag: string = '  '
        if (query.date) {
            this.validateParam(query.date.toString())
            if (query.exact) {
                str += ` DATE_FORMAT(${query.date.toString()}, '%Y-%m-%d') = ? `
                vals.push(query.exact.toString())
                delete query.exact
            } else {
                if (query.min_date) {
                    str += ` DATE_FORMAT(${query.date.toString()}, '%Y-%m-%d') >= ? `
                    vals.push(query.min_date.toString())
                }
                if (query.min_date && query.max_date) {
                    str += ' and '
                }
                if (query.max_date) {
                    str += ` DATE_FORMAT(${query.date.toString()}, '%Y-%m-%d') <= ? `
                    vals.push(query.max_date.toString())
                }
                delete query.max_date
                delete query.min_date
            }
            delete query.date
        }

        if (query.limit) {
            this.validateParam(query.limit.toString())
            pag += ` limit ${query.limit.toString()} `
        }

        if (query.page) {
            this.validateParam(query.page.toString())
            const test = (parseInt(query.page.toString()) - 1) * parseInt(query.limit.toString())
            pag += ` offset ${test.toString()} `
        }

        delete query.page
        delete query.limit


        if (Object.keys(query).length > 0) {
            if (str.length > 3) {
                str += ' and '
            }
            const len = Object.keys(query).length - 1
            for (const [index, key] of Object.keys(query).entries()) {
                this.validateParam(key)
                const val = query[key].toString()
                this.validateParam(val)
                if (val.split(',').length > 1) {
                    const localVal = val.split(',')
                    str += '('
                    for (const [index, vl] of localVal.entries()) {
                        str += ` ${key} like '%${vl}%'`
                        if (index < localVal.length - 1) {
                            str += ' or '
                        }
                    }
                    str += ')'
                } else {
                    str += ` ${key} like '%${val}%' `
                }
                if (index < (len)) {
                    str += ' and '
                }
            }
        }

        return { str, vals, pag }
    }

    async readQuery<T>(query: string, values: Array<string> | null): Promise<Array<T>> {
        try {
            if (this.request?.query && Object.keys(this.request.query).length > 0) {
                const temp: Array<string> = query.split('WHERE')
                let { str, vals, pag } = this.makeConditionalString()
                if (temp.length == 1) {
                    query = temp[0] + ' WHERE ' + str
                } else if (temp.length == 2) {
                    if (str.length > 3) {
                        str += ' and '
                    }
                    const aux: Array<string> = [temp[0], ' WHERE ', str, temp[1], pag]
                    values.unshift(...vals)
                    query = aux.join('')
                }
            }

            return await new Promise((resolve, reject) => {
                this.connection.query(query, [...values], (err, res) => {
                    if (err) reject(new Error(err.sqlMessage))
                    resolve(res)
                })
            })
        } catch (err) {
            console.error('err reading')
            console.error(err)
            return []
        }
    }

    async updateQuery(query: string, values: Array<string> | null): Promise<OkPacket> {
        return await new Promise((resolve, reject) => {
            this.connection.query(query, [...values], (err, res) => {
                if (err) reject(new Error(err.sqlMessage))
                resolve(res)
            })
        })
    }

    async updateQueryDynamic(table: string, body: any , values: Array<string> | null): Promise<OkPacket> {
        let query:string = `UPDATE ${table} SET `
        let bodyKeys = Object.keys(body)
        for(const [index, key] of bodyKeys.entries()){
            if (body[key] !==  null && body[key] !== undefined && body[key] !== '') {
                if (key != 'id' ) {
                    query+= `${key} = '${body[key]}',`;
                }
            }
        }
        query = query.slice(0, -1); //Remove last commas
        query+= ' WHERE id = ?'
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

