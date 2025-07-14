const fs = require('fs');
const path = require('path');
const { readSheet } = require('../routes/sheets');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const templatePath = path.join(__dirname, '..', 'template.html');
let baseHTML = fs.readFileSync(templatePath, 'utf8');
baseHTML = baseHTML.replace(/{{FORM_URL}}/g, process.env.FORM_URL);

const credentialsPath = path.join(__dirname, '..', 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,       // e.g. icpep.seplm2025@gmail.com
        pass: process.env.SENDER_PASS         // App password
    }
});


let logs = [];

async function sendEmails() {
    const rows = await readSheet();
    logs.length = 0; // Clears the array by reference

    for (const row of rows) {
        const orgName = row[0];
        const recipientEmail = row[1];

        const personalizedHTML = baseHTML.replace('{{ORG_NAME}}', orgName);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: recipientEmail,
            subject: "Verifying Your Organization's Contact Email | ICpEP.SE - PLM 2025",
            html: personalizedHTML,
            attachments: [
                {
                    filename: 'BigHeader.png',
                    path: './assets/BigHeader.png',
                    cid: 'header_image'
                },
                {
                    filename: 'ICPEPLogo.png',
                    path: './assets/ICPEPLogo.png',
                    cid: 'footer_image'
                }
            ]
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            const msg = `Email sent to ${orgName} <${recipientEmail}>: ${info.response}`;
            console.log(msg);
            logs.push(msg);
        } catch (error) {
            const msg = `Failed to send to ${recipientEmail}: ${error.message}`;
            console.error(msg);
            logs.push(msg);
        }
    }

    return logs;
}

module.exports = { sendEmails, logs };


