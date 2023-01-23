import nodemailer from "nodemailer";
import {env} from 'process'
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { MailOptions } from "nodemailer/lib/json-transport";
import {join} from 'path'
import Mail from "nodemailer/lib/mailer";

interface configEmailType {
    attachments?: Mail.Attachment[]
}

const hostname = "hostname from account page";

const transportOptions: SMTPTransport.Options = {
    host: env.MAIL_HOST,
    port: parseInt(env.MAIL_PORT),
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
    }}

const transporter = nodemailer.createTransport(transportOptions)

export const sendEmail = async (destinationEmails : Array<string>, 
        subject: string, 
        content: string,
        config?: configEmailType
        ): Promise<boolean> => {


    let mailOptions: MailOptions = {
        from: env.MAIL_USER,
        to: destinationEmails,
        subject: subject,
        html: content,   
        attachments: [
            ...(config?.attachments ?? [])
        ]     
    }
    
    return await new Promise((resolve) => { 
        transporter.sendMail(mailOptions, (err, success) => {
            if (err) {
                console.log('Mailing error:', err)
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}