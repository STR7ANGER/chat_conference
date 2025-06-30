import nodemailer from 'nodemailer';

export const emailTransporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'xilfoxy@gmail.com',
        pass: 'krcl tdnk pejd hkrk'
    }
});