import { text } from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
const fromMail = process.env.MAIL
const password = process.env.MAIL_PASSWORD

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: fromMail,
        pass: password
    },
    tls: {
        rejectUnauthorized: false
    }
})

export const normalMail = async (data) => {
    let options = {
        from: fromMail,
        to: data.mail,
        subject: data.subject,
        text: data.text,
        html: data.html
    };
    try {
        const result = await transporter.sendMail(options);
        console.log('Email sent successfully:', result);
        return true;
    } catch (error) {
        console.log('Error in sending email:', error);
        return false;
    }
};