import { DataBase, initDatabase } from "../classes/db";
import { Request, Response } from "express";
import { quotationTermsSchema } from "@/schemas";
import { OkPacket } from "mysql";


export const listQuotationTerms = async (req: Request, res: Response) => {
    const query: string = `SELECT * FROM quotationTerms WHERE enterprise_id = ? ORDER BY place ASC`
    const values: string[] = [
        req.userData.enterprise_id.toString()
    ]
    const db: DataBase = await initDatabase(res, req)
    const response = await db.readQuery(query, values)
    res.json(response)
}

export const saveQuotationTerm = async (req: Request, res: Response): Promise<quotationTermsSchema[]> => {
    let terms: quotationTermsSchema[] =  req.body.terms
    const db: DataBase = await initDatabase(res)
    for(const term of terms){
        if(term.id.toString().includes('t')){
            term.id = 'null'
        }
        const newTerm = await db.upsert('quotationTerms', {
            enterprise_id: term.enterprise_id.toString(),
            condition_text: term.condition_text,
            place: term.place.toString()
        }, {
            id: term.id.toString()
        })
        term.id = parseInt(newTerm.id.toString())
    }
    res.end()
    return terms
}

