require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});
transporter.verify()
    .then(console.log('Email service is running'))
    .catch( err =>{
        console.log("Error in email config: "+ err)
    });

module.exports = transporter;